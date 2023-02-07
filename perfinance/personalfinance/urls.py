from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("register", views.register, name="register"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("investments", views.save_budget, name="save_budget"),
    path("forecast", views.forecast, name="forecast"),

    #API Routes
    path("edit-budget", views.edit_budget, name="edit_budget"),
    path("investment", views.investment, name="investment"),
    path("profiles", views.profiles, name="change_profile")
]