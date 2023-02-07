from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    pass

# Budget items are defined in views.py (BUDGET_ITEMS)
class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
    name = models.CharField(max_length=64)
    budget = models.IntegerField(blank=True, null=True)
    housing = models.IntegerField(blank=True, null=True)
    transportation = models.IntegerField(blank=True, null=True)
    food = models.IntegerField(blank=True, null=True)
    utilities = models.IntegerField(blank=True, null=True)
    healthcare = models.IntegerField(blank=True, null=True)
    savings = models.IntegerField(blank=True, null=True)
    recreation = models.IntegerField(blank=True, null=True)
    miscellaneous = models.IntegerField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-modified_date']

#Investment items are defined in views.py (INVESTMENT_ITEMS) 
class Investment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="investor")
    name = models.CharField(max_length=64)
    investment = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name="investment")
    cash = models.IntegerField(blank=True, null=True)
    cash_monthly = models.IntegerField(blank=True, null=True)
    emergency = models.IntegerField(blank=True, null=True)
    emergency_monthly = models.IntegerField(blank=True, null=True)
    equity = models.IntegerField(blank=True, null=True)
    equity_monthly = models.IntegerField(blank=True, null=True)
    debt = models.IntegerField(blank=True, null=True)
    debt_monthly = models.IntegerField(blank=True, null=True)
    property = models.IntegerField(blank=True, null=True)
    property_monthly = models.IntegerField(blank=True, null=True)
    gold = models.IntegerField(blank=True, null=True)
    gold_monthly = models.IntegerField(blank=True, null=True)
    retirals = models.IntegerField(blank=True, null=True)
    retirals_monthly = models.IntegerField(blank=True, null=True)
    other = models.IntegerField(blank=True, null=True)
    other_monthly = models.IntegerField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-modified_date']