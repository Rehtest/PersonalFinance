import json
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.shortcuts import render
from django.db import IntegrityError
from django.http import HttpResponseRedirect, JsonResponse

from .models import User, Budget, Investment

BUDGET_ITEMS = ["housing", "transportation", "food", "utilities", "healthcare", "savings", "recreation", "miscellaneous"]
INVESTMENT_ITEMS = ["cash", "emergency", "equity", "debt", "property", "gold", "retirals", "other"]

# Create your views here.
def index(request):
    #Try to get the latest budget for a user
    if request.user.is_authenticated:
        try:
            budget_profiles = Budget.objects.filter(user=request.user)
            budget_details = budget_profiles[0]
        except:
            budget_profiles = None
            budget_details = None
    else:
        budget_profiles = None
        budget_details = None
    return render(request, "personalfinance/index.html", {
        "items": BUDGET_ITEMS,
        "budget_details": budget_details,
        "profiles": budget_profiles
    })

def login_view(request):
    if request.method == "POST":

        #Login the user
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        #Authenticate
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "personalfinance/login.html", {
                "message": "Invalid username / password"
            })
            
    return render(request, "personalfinance/login.html")

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Match passwords
        password = request.POST["password"]
        password_confirm = request.POST["confirmation"]
        if password == password_confirm:
            try:
                user = User.objects.create_user(username, email, password)
                user.save()
                login(request, user)
                return HttpResponseRedirect(reverse("index"))

            except IntegrityError:
                return render(request, "personalfinance/register.html", {
                    "message": "User already exists."
                })
        
        else:
            return render(request, "personalfinance/register.html", {
                "message": "Passwords must match"
            })

    return render(request, "personalfinance/register.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))

@login_required
def save_budget(request):
    if request.method == "POST":
        user = request.user
        budget_input =  request.POST["budget"]
        housing_input = request.POST["housing"]
        transportation_input = request.POST["transportation"]
        food_input = request.POST["food"]
        utilities_input = request.POST["utilities"]
        healthcare_input = request.POST["healthcare"]
        savings_input = request.POST["savings"]
        recreation_input = request.POST["recreation"]
        miscellaneous_input = request.POST["miscellaneous"]
        name_input = request.POST["budget_profile"]
        
        new_budget_input = Budget(user=user, name=name_input, budget=budget_input, housing=housing_input, transportation=transportation_input, food=food_input,
        utilities=utilities_input, healthcare=healthcare_input, savings=savings_input, recreation=recreation_input, miscellaneous=miscellaneous_input)

        new_budget_input.save()

        return HttpResponseRedirect(reverse('index'))

    try:
        budget_id = Budget.objects.filter(user=request.user)[0]
        investment_profiles = Investment.objects.filter(user=request.user, investment=budget_id)
        investment_details = investment_profiles[0]
        budget_details = None
    except:
        try:
            budget_profiles = Budget.objects.filter(user=request.user)
            budget_details = budget_profiles[0]
            investment_details = None
            investment_profiles = None
        except:
            investment_details = None
            budget_details = None
            investment_profiles = None
    return render(request, "personalfinance/investments.html", {
        "investment": investment_details,
        "no_investment": budget_details,
        "items": INVESTMENT_ITEMS,
        "profiles": investment_profiles
    })

def edit_budget(request):
    if request.method != "POST":
        return JsonResponse({"error": "Post request required."}, status=400)

    #Save the edited budget
    data = json.loads(request.body)
    print(data)

    edit_budget = data["budget_item"]
    edit_budget_value = data["budget"]
    edit_housing_value = data["housing"]
    edit_transportation_value = data["transportation"]
    edit_food_value = data["food"]
    edit_utilities_value = data["utilities"]
    edit_healthcare_value = data["healthcare"]
    edit_savings_value = data["savings"]
    edit_recreation_value = data["recreation"]
    edit_miscellaneous_value = data["miscellaneous"]
    edit_name = data["name"]

    budget_item = Budget.objects.get(id=edit_budget)
    budget_item.budget = edit_budget_value
    budget_item.housing = edit_housing_value
    budget_item.transportation = edit_transportation_value
    budget_item.food = edit_food_value
    budget_item.utilities = edit_utilities_value
    budget_item.healthcare = edit_healthcare_value
    budget_item.savings = edit_savings_value
    budget_item.recreation = edit_recreation_value
    budget_item.miscellaneous = edit_miscellaneous_value
    budget_item.name = edit_name

    budget_item.save()

    return JsonResponse({"message" : "complete"})

def investment(request):
    if request.method != "POST":
        return JsonResponse({"error": "Post request required."}, status=400)

    #Save the investment from edit form
    try:
        data = json.loads(request.body)
        if data:
            cash = data["cash"]
            emergency = data["emergency"]
            equity = data["equity"]
            debt = data["debt"]
            property = data["property"]
            gold = data["gold"]
            retirals = data["retirals"]
            other = data["other"]
            cashmonthly = data["cashmonthly"]
            emergencymonthly = data["emergencymonthly"]
            equitymonthly = data["equitymonthly"]
            debtmonthly = data["debtmonthly"]
            propertymonthly = data["propertymonthly"]
            goldmonthly = data["goldmonthly"]
            retiralsmonthly = data["retiralsmonthly"]
            othermonthly = data["othermonthly"]
            name = data["name"]

            investment_id = data["investment"]
            investment_item = Investment.objects.get(id=investment_id)

            investment_item.cash = cash
            investment_item.emergency = emergency
            investment_item.equity = equity
            investment_item.debt = debt
            investment_item.property = property
            investment_item.gold = gold
            investment_item.retirals = retirals
            investment_item.other = other
            investment_item.cash_monthly = cashmonthly
            investment_item.emergency_monthly = emergencymonthly
            investment_item.equity_monthly = equitymonthly
            investment_item.debt_monthly = debtmonthly
            investment_item.property_monthly = propertymonthly
            investment_item.gold_monthly = goldmonthly
            investment_item.retirals_monthly = retiralsmonthly
            investment_item.other_monthly = othermonthly
            investment_item.name = name

            investment_item.save()

            print("All steps completed.")
            return JsonResponse({"message": "Successful."})

        #Save the investment from standard form
    except:
        form_values = request.POST
        print(form_values)
        user = request.user
        cash = request.POST["cash"]
        emergency = request.POST["emergency"]
        equity = request.POST["equity"]
        debt = request.POST["debt"]
        property = request.POST["property"]
        gold = request.POST["gold"]
        retirals = request.POST["retirals"]
        other = request.POST["other"]
        cashmonthly = request.POST["cashmonthly"]
        emergencymonthly = request.POST["emergencymonthly"]
        equitymonthly = request.POST["equitymonthly"]
        debtmonthly = request.POST["debtmonthly"]
        propertymonthly = request.POST["propertymonthly"]
        goldmonthly = request.POST["goldmonthly"]
        retiralsmonthly = request.POST["retiralsmonthly"]
        othermonthly = request.POST["othermonthly"]
        name = request.POST["investment_profile"]

        investment_id = request.POST["investment"]
        investment = Budget.objects.get(id=investment_id)

        new_investment = Investment(user=user, name=name, investment=investment, cash=cash, cash_monthly=cashmonthly, emergency=emergency, emergency_monthly=emergencymonthly, equity=equity, equity_monthly=equitymonthly,
        debt=debt, debt_monthly=debtmonthly, property=property, property_monthly=propertymonthly, gold=gold, gold_monthly=goldmonthly, retirals=retirals, retirals_monthly=retiralsmonthly,
        other=other, other_monthly=othermonthly)
        
        new_investment.save()

        return HttpResponseRedirect(reverse('save_budget'))
        

@login_required
def profiles(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print(data)
        change_option = data["change"]
        if change_option == "budget":
            change_id = data["id"]
            selected_budget = Budget.objects.get(id=change_id)
            selected_budget.save()
            return HttpResponseRedirect(reverse('index'))
        elif change_option == "investment":
            change_id = data["id"]
            selected_investment = Investment.objects.get(id=change_id)
            selected_investment.save()
            return HttpResponseRedirect(reverse('save_budget'))
        
    else:
        return JsonResponse({"error": "Post request required."}, status=400)

@login_required
def forecast(request):
    user = request.user
    user_details = User.objects.get(username=user)
    user_id = user_details.id

    user_budgets = Budget.objects.filter(user_id=user_id)
    
    if user_budgets:
        selected_budget = user_budgets[0].id
        user_investment = Investment.objects.filter(investment=selected_budget)
        
        if user_investment:
            selected_investment = user_investment[0]
            
        else:
            selected_investment = None
    else:
        selected_investment = None

    return render(request, "personalfinance/forecast.html", {
        "investment": selected_investment,
        "items": INVESTMENT_ITEMS
    })
