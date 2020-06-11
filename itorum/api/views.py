from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie

from django.core.exceptions import ObjectDoesNotExist

from .models import Users, Orders, Customers

import json
import base64
import datetime

def auth_user(username, password):
    try:
        user = Users.objects.get(username=username)
        if user.password == password and user.can_ui:
            return True
        else:
            return False
    except ObjectDoesNotExist:
        print('no such user')
        return False

def auth_api_user(username, password):
    try:
        user = Users.objects.get(username=username)
        if user.password == password and user.can_json:
            return True
        else:
            return False
    except ObjectDoesNotExist:
        print('no such user')
        return False

def get_user_from_basic(auth_data):
    #Декодируем base64 строку
    auth_string = base64.b64decode(auth_data).decode('UTF-8')
    return {
        'login': auth_string.split(':')[0],
        'password': auth_string.split(':')[1]
    }

def get_orders():
    orders = {}
    for order in Orders.objects.order_by('-date'):
        orders[order.pk] = order.to_json()
    return orders

def get_month_orders_info():
    orders_info = {}
    end_date = datetime.date.today()
    start_date = end_date - datetime.timedelta(days = end_date.weekday())
    week = start_date.isocalendar()[1]
    dates = 'from {} to {}'.format(start_date, end_date)
    orders_info[dates] = {}

    for day in [end_date - datetime.timedelta(days=i) for i in range(end_date.weekday()+1)]:
        orders = Orders.objects.filter(date=day)
        orders_info[dates][day.isoformat()] = [order.to_json() for order in orders]

    for i in range(1, 4):
        end_date = start_date
        start_date = start_date - datetime.timedelta(days=7)
        week = start_date.isocalendar()[1]
        dates = 'from {} to {}'.format(start_date, end_date)
        orders_info[dates] = {}
        for day in [end_date - datetime.timedelta(days=i) for i in range(1, 8)]:
            orders = Orders.objects.filter(date=day)
            orders_info[dates][day.isoformat()] = [order.to_json() for order in orders]

    return orders_info


def get_customers():
    customers = {}
    for customer in Customers.objects.all():
        customers[customer.pk] = {
            "email": customer.email
        }
    return customers

# Create your views here.
@ensure_csrf_cookie
def auth_ui(request):
    if request.method == 'GET':
        if request.session.get('is_authorized', False):
            return HttpResponse('Success', status=200)
        if "Authorization" not in request.headers:
            return HttpResponse('Unauthorized', status=401)
        auth_data = request.headers['Authorization'].split(' ')[1]
        user_data = get_user_from_basic(auth_data)
        if auth_user(user_data['login'], user_data['password']):
            request.session['is_authorized'] = True
            return HttpResponse('Success', status=200)
        else:
            return HttpResponse('Unauthorized', status=401)
    elif request.method == 'HEAD':
        return HttpResponse(status=200)
    else:
        return HttpResponce('Not allowed', status=405)

def log_out(request):
    if request.method == 'GET':
        if request.session.get('is_authorized', False):
            request.session.flush
            return HttpResponse('Success', status=200)
        else:
            return HttpResponse('Unauthorized', status=401)
    elif request.method == 'HEAD':
        return HttpResponse(status=200)
    else:
        return HttpResponce('Not allowed', status=405)

def orders(request):
    if request.method == 'GET':
        #Если пользователен авторизован в данной сессии возвращаем заказы
        if request.session.get('is_authorized', False):
            responce = JsonResponse(get_orders())
            print('is authorized')
            return responce
        #Если пользователь не авторизован и нет заголовка авторизации возвращаем 401
        if "Authorization" not in request.headers:
            return HttpResponse('Unauthorized', status=401)
        auth_data = request.headers['Authorization'].split(' ')[1]
        user_data = get_user_from_basic(auth_data)
        print(user_data)
        #Если пользователь авторизован в веб-интерфейсе
        if auth_user(user_data['login'], user_data['password']):
            print(user_data)
            if request.session.get('is_authorized', False):
                responce = JsonResponse(get_orders())
                return responce
            else:
                return HttpResponse('Forbidden', status=403)
        if auth_api_user(user_data['login'], user_data['password']):
            responce = JsonResponse(get_orders())
            return responce
        else:
            return HttpResponse('Wrong request', status=406)

    elif request.method == 'HEAD':
        return HttpResponse(status=200)

    elif request.method == 'POST':
        data = json.loads(request.body.decode())
        print(data)
        customer_id = int(data['customer'])
        price = int(data['price'])
        try:
            customer = Customers.objects.get(pk = customer_id)
            order = Orders(customer=customer, price=price)
            order.save()
            return HttpResponse(status=201)
        except ObjectDoesNotExist:
            print('no such customer')
            return HttpResponse('Wrong request', status=406)
        except Exception as e:
            return HttpResponse('Server Error', status=500)

    elif request.method == 'DELETE':
        data = json.loads(request.body.decode())
        order_id = data.get('id', False)
        # order_id = False
        if order_id:
            try:
                order = Orders.objects.get(pk = order_id)
                order.delete()
                return HttpResponse(status=204)
            except ObjectDoesNotExist:
                return HttpResponse('Wrong request', status=406)
        else:
            return HttpResponse('Wrong request', status=406)
    else:
        return HttpResponce('Not allowed', status=405)

def customers(request):
    if request.method == 'GET':
        if request.session.get('is_authorized', False):
            responce = JsonResponse(get_customers())
            return responce
        else:
            return HttpResponse('Unauthorized', status=401)
    elif request.method == 'HEAD':
        return HttpResponse(status=200)
    else:
        return HttpResponce('Not allowed', status=405)

def orders_info(request):
    if request.method == 'GET':
        return JsonResponse(get_month_orders_info())
    elif request.method == 'HEAD':
        return HttpResponse(status=200)
    else:
        return HttpResponce('Not allowed', status=405)
