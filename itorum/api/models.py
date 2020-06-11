from django.db import models
from datetime import date
# Create your models here.

class Users(models.Model):
    username = models.CharField(max_length=25, unique=True)
    password = models.CharField(max_length=50)
    can_json = models.BooleanField(default=False)
    can_ui = models.BooleanField(default=True)

class Customers(models.Model):
    email = models.EmailField()

class Orders(models.Model):
    customer = models.ForeignKey(Customers, on_delete=models.CASCADE)
    price = models.IntegerField(default=0)
    date = models.DateField(default=date.today())

    def to_json(self):
        return({
            "id": self.pk,
            "customer": self.customer.email,
            "price": self.price,
            "date": '{}-{}-{}'.format(self.date.day, self.date.month, self.date.year)
        })
