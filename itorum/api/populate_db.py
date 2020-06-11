import random
import json
import datetime

def add_users():
    users = []
    for i in range(1, 4):
        pk = i
        username = 'user_{}'.format(i)
        password = '12345'
        can_json = random.choice([True, False])
        can_ui = random.choice([True, False])
        users.append(
            {
                'model': 'api.users',
                'pk': pk,
                'fields': {
                    'username': username,
                    'password': password,
                    'can_json': can_json,
                    'can_ui': can_ui
                }
            }
        )
    return users

def add_customers():
    customers = []
    for i in range(1, 15):
        pk = i
        email = 'customer_{}@itorum.com'.format(i)
        customers.append(
            {
                "model": 'api.customers',
                "pk": pk,
                "fields": {
                    "email": email
                }
            }
        )
    return customers

def add_orders():
    orders = []
    initial_date = datetime.date.today()
    for i in range(1, 151):
        pk = i
        customer = random.randint(1, 14)
        price = 100 * random.randint(1, 10)
        date = initial_date - datetime.timedelta(days=random.randint(1, 50))
        orders.append(
            {
                "model": "api.orders",
                "pk": pk,
                "fields": {
                    "customer": customer,
                    "price": price,
                    "date": date.isoformat()
                }
            }
        )
    return orders

if __name__ == '__main__':
    with open('users.json', 'w') as f:
        json.dump(add_users(), f)
    with open('customers.json', 'w') as f:
        json.dump(add_customers(), f)
    with open('orders.json', 'w') as f:
        json.dump(add_orders(), f)


