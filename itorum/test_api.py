import requests
import base64

def test_api(login, password):
    auth_string_bytes = '{}:{}'.format(login, password).encode('UTF-8')
    auth_string_base64 = base64.b64encode(auth_string_bytes).decode('UTF-8')

    response = requests.get(
        'http://127.0.0.1:8000/api/orders',
        headers={'Authorization': 'Basic {}'.format(auth_string_base64)},
    )

    return response.status_code

def test_orders_info():
    response = requests.get('http://127.0.0.1:8000/api/orders_info')
    return response.status_code

if __name__ == '__main__':
    print(test_api('user_2', '12345'))
    print(test_api('user_1', '12345'))
    print(test_orders_info())