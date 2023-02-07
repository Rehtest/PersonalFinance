# Project Title

Personal Finance: One Stop Money Manager.

## Distinctiveness and Complexity

This is a Django web application utilizing Python, Javascript, HTML & CSS to create a one stop money manager which allows users to save budgets, create investment profiles and forecast future value of these investments up to a period of 10 years.

The application contains 3 models - User (a default user model), Budget (a model to capture different budget elements for each user and multiple such budgets per user) and Investment (a model to capture different investment elements per budget per user and multiple such investment profiles).

The application is meant to allow individuals to input a budget profile and use this profile to input an investment profile. From this investment profile, the user may forecast future values of the investment.

The User Interface contains sliders that update values real-time making it easier for a user to know how close they are to hitting their budget / investment amount. These sliders update the input values and also update a remaining budget field to let users know they are getting close to their total budgets.

The User Interface is improved by charts using the Chart js library that allow an easy visual reference of a user's current budget and elements for that budget (in the budget view). Similarly, it allows for visualization of the size of one's current investment portfolio and monthly investment contributions (in the investment view). This extends to the forecast page which again allows for visualization of future values of the same investment basis selected annual growth rates.

The overall structure of a page generally consists of input forms which can be filled with budget / investment numbers, sliders connected to these inputs and a chart that updates basis the sliders and inputs. Pages also contain buttons such as the edit button to allow for users to edit their existing budget / investment profile or create a new profile. These are Javascript enabled to allow for users to edit data that is currently on the page.

The application has multiple paths to allow users to register, login, logout, access their budgets, investments and make forecasts. It also contains 3 API routes to allow users to edit their budget (through the edit and save buttons on the budget page), their investment (through the edit and save buttons on the investment page) and change profiles (through the change profile button on Budget and Investment pages).

## Project Description

This section includes details of the overall project flow as well as individual project files.

### Project Flow

The Project contains a navigation bar that allows users who are not logged in to Login and Register. Users who are logged in can plan / view their budget, investments and forecast future investments.

For users who are not logged in:
The project allows users who are not logged in to plan a budget using the inputs and sliders, visualizing the same through a chart in real-time. Users are prompted to log in for additional functionality.

For users who are logged in:
Users can plan their budget and save it using the index page. This is the first step for users who are enabled by sliders that update in real-time the current spend and remaining budget elements along with a chart. The investments and forecast pages prompt users to complete the previous steps - input a budget and an investment.

Once users create a new budget, the index page allows them to edit the budget or change their profile. Editing the budget allows for users to save changes in the same budget profile or create a completely new profile. The latest updated / created profile is always loaded for the user to view. If the user wishes to change profile, the change profile button allows users to select the required profile from existing profiles.

Once users create a budget, they are able to plan their investment. This is done basis the savings value in the previous budget. Here, users are able to input a current value for each of the investment elements as well as a monthly contribution. Sliders and charts display real-time updates to the monthly contribution. Users can then save the investment profile.

Once users create an investment profile, the investment page allows them to edit the profile or change to another profile similar to the home page. The user's monthly contributions and current value of investments are also visualized through charts.

Finally, users can use the forecast tool. This page loads the current investment profile and has fields to capture annual growth percentages for each investment type. It also contains forecast value fields for each investment type that are filled as the slider is moved and a chart that updates with forecasted investment values. The slider can be used to forecast months ahead up to 120 months.

### Project Files

The project includes a single django application called 'personalfinance'.

The settings.py file includes an import of 'reverse_lazy' to change the default 'login url' for all 'login_required' views in views.py. This also includes 'personalfinance' as an INSTALLED_APP.

The urls.py file uses includes all personalfinance urls in the urlpatterns.

#### The personalfinance directory includes all files for the personal finance application:

##### Static

3 javascript files in the static directory - forecast.js for the forecast page, investments.js for the investments page and index.js for the home page. Functionality will be explained in the following section on html templates

1 css file in the static directory - custom styling that applies across all pages

##### Templates

6 html templates - layout capturing the overall layout of the site, index for the home page, investments for the investment page, forecast for the forecasting page, login for the login page and register for the register page. All pages utilize the bootstrap library for styling.

Layout - The layout page sets the overall layout including bootstrap usage, a navbar with different functionality for users who are logged in and not logged in, a block for custom scripts and a block for body content

Login - This page consists of a simple login form and an error message when login details are incorrect.

Register - This page consists of a simple register form and an error message when registration details are already in use / incorrect.

Index - This is the home page of the application and links to the index javascript file as well as as the chart js library. The page consists of 2 sections:
HTML - Existing budget displays the budget when one is already present for the user. This contains the budget values and a chart as well as two buttons that allow users to edit their budget and change budget profiles.
New budget displays a budget form to create a new budget profile and is the default for not logged in users. This also includes a save button that is displayed by javascript when an existing budget is edited.
Javascript - If there is an existing budget, the existing budget section is displayed and a chart is created using the budget data. The edit button on the page closes the existing budget section and populates the 'new budget' form with the existing budget details. The change profile button sends a post request to update the modified date of a budget profile. The save button sends a post request to update the details of the existing budget, displays the save was successful on the document and then redirects to the page.
If there is no existing budget, the new budget page is initialized - this includes creating a chart, linking the sliders with inputs and enabling the chart be updated in real-time using the update_chart function.

Investments - This is the investment page of the application and links to the investments javascript file as well as the chart js library. It is structured similarly to the index page, with two sections: Existing investments, when one is present and New investment, when one needs to be created. The javascript on this page is also structured similarly to the index file with edit, save and profile change functionality along with charts.

Forecast - The forecast page is structured with a form that is populated with investment details and allows users to input annual growth %ages for each of the investment types. Forecast value fields are initially blank to be filled by the javascript running on the page. The forecast.js file runs on this page to create a chart and update forecast values basis the number of months and annual growth percentages for each of the elements. The total value of investments is also forecasted.

#### Application files

admin.py gives admin access to the User, Budget and Investments models

models.py captures 3 models - the default User model, a budget model linked to the User model that captures budget elements, timestamp and a modified date with descending ordering on the modified date and an Investment model linked to the budget model with investment elements, a timestamp and modified date with descending ordering.

urls.py includes the paths - home page route through index, register route through register, login route through login, logout route through logout, investments view route through investments and the forecast route through forecast. This also includes 3 API routes - edit-budget to edit an existing budget, investment to edit an existing investment and profiles to change the budget / investment profile

views.py - This includes the budget items and investment items for reference, these are also passed to the templates - changes to these variables may need changes in the models as well.
The index view displays the home page, login_view displays the login page, register displays the register page and logout_view displays the logout page.
The save_budget view displays the investment page on GET and saves a new budget entry on POST.
The edit_budget view is used to edidt an existing budget through POST and through the edit button on the index page.
The investment view is used to edit an existing investment item through POST when submitted through the edit button on the investment page. The view is also used to create a new investment through post when the create new investment form is submitted on the investment page.
The profiles view is used to change profiles using the change profile buttons on the budget and investment pages
The forecast view is used to forecast an existing budget

### How to Run the Application

The application can be run using the python command runserver on the root directory to create a web application instance.

### Additional information

The application is built using the Django framework and requires installation if not already present on the user's system. The application also uses the bootstrap framework for CSS styling and the Chartjs Javascript library for charting functionality. The rest of the application works using the django framework, standard css and javascript.