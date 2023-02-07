document.addEventListener('DOMContentLoaded', function() {

    //This is used later to select which sections are displayed
    form_checker = document.querySelector("#savings")

    //Check if there is an existing investment portfolio
    if (document.getElementById("existing-investment") != null) {

        //This hides the "Plan Your Investment" section and creates a chart from existing monthly investment data
        document.querySelector('#new-investment').style.display = 'none';
        var current_investment_values = [];
        var existing_chart_data = [];
        var existing_investment_inputs = document.getElementsByClassName("chart-data")
        var current_savings_budget = existing_investment_inputs[0].innerHTML;
        var existing_chart_data_points = document.getElementsByClassName('chart-data-monthly');
        for (let i=1; i<existing_chart_data_points.length; i++) {
            existing_chart_data.push(existing_chart_data_points[i].innerHTML);
            current_investment_values.push(existing_investment_inputs[i].innerHTML);
        };
        var existing_chart = document.getElementById('monthlyInvestmentChart').getContext('2d');
        var monthlyInvestmentChart = new Chart(existing_chart, {
            type: 'pie',
            data: {
                labels: ["Cash", "Emergency", "Equity", "Debt", "Property", "Gold", "Retirals", "Others"],
                datasets: [{
                    label: '%age investment',
                    data: existing_chart_data,
                    backgroundColor: [
                        'rgba(255, 99, 132)',
                        'rgba(54, 162, 235)',
                        'rgba(255, 206, 86)',
                        'rgba(75, 192, 192)',
                        'rgba(153, 102, 255)',
                        'rgba(255, 159, 64)',
                        'rgba(124, 228, 12)',
                        'rgba(178, 86, 224)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Monthly Investments',
                    fontSize: 18,
                    fontColor: '#000',
                    fontFamily: 'Arial',
                    position: 'top'
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            var dataset = data.datasets[tooltipItem.datasetIndex];
                            var total = dataset.data.reduce(function(previousValue, currentValue) {
                                return previousValue*1 + currentValue*1;
                            });
                            var currentValue = dataset.data[tooltipItem.index];
                            var percentage = Math.floor(((currentValue/total) * 100) + 0.5);
                            return percentage + "%";
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        display:false
                    }]
                }
            }
        });

        //This creates a new chart with current investment data
        var current_investment_chart = document.getElementById('currentInvestmentChart').getContext('2d');
        var currentInvestmentChart = new Chart(current_investment_chart, {
            type: 'pie',
            data: {
                labels: ["Cash", "Emergency", "Equity", "Debt", "Property", "Gold", "Retirals", "Others"],
                datasets: [{
                    label: '%age investment',
                    data: current_investment_values,
                    backgroundColor: [
                        'rgba(255, 99, 132)',
                        'rgba(54, 162, 235)',
                        'rgba(255, 206, 86)',
                        'rgba(75, 192, 192)',
                        'rgba(153, 102, 255)',
                        'rgba(255, 159, 64)',
                        'rgba(124, 228, 12)',
                        'rgba(178, 86, 224)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Current Investments',
                    fontSize: 18,
                    fontColor: '#000',
                    fontFamily: 'Arial',
                    position: 'top'
                },
                tooltips: {
                    callbacks: {
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        display:false
                    }]
                }
            });

        //Edit button functionality for existing investment
        edit_button = document.querySelector("#edit-button")
        edit_button.addEventListener('click', () => {

            document.querySelector('#new-investment').style.display = 'block';
            var new_investment_inputs = document.getElementsByClassName("investment-item-input")
            var new_investment_monthly_inputs = document.getElementsByClassName("investment-item-monthly-input")
            for (let i=0; i<existing_chart_data.length; i++) {
                new_investment_inputs[i].value = current_investment_values[i];
                new_investment_monthly_inputs[i].value = existing_chart_data[i];
            }
            //Add existing name to the input name field
            current_name = document.querySelector('#investment_name')
            investment_profile = document.querySelector('#investment_profile')
            investment_profile.value = current_name.innerHTML;

            //Bug fix - get the investment id from the save data button and pass it into the hidden input
            var save_button_dataset = document.querySelector('#save-button').getAttribute("data-investment-id");
            var hidden_investment_id = document.getElementById("hidden_investment_id");
            hidden_investment_id.value = save_button_dataset;

            var new_savings_budget_value = document.querySelector("#savings");
            new_savings_budget_value.innerHTML = current_savings_budget;
            new_investment();
            document.querySelector('#existing-investment').style.display = 'none';
        })

        //Change profile functionality for existing budget
        var budget_button_holder = document.querySelector('#investment-button-holder');
        var investment_profile_select = document.querySelector('#investment-profile-select');
        var profile_select_dropdown = document.getElementById('investment-options')
        let csrf_token_value = document.querySelector('input[name=csrfmiddlewaretoken]').value;
        profile_select_dropdown.style.display = 'none';
        
        investment_profile_select.addEventListener('click', () => {
            profile_select_dropdown.style.display = 'block'
        })

        profile_select_dropdown.addEventListener('change', () => {
            var selected_option = profile_select_dropdown.value;
            console.log(selected_option);
            fetch('/profiles', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrf_token_value
                },
                body: JSON.stringify({
                    "id": selected_option,
                    "change": "investment"
                })
            })
            successful_redirect();
        })
    } else if (form_checker.innerHTML == '') {
        document.querySelector('#new-investment').style.display = 'none';
        var helper = document.querySelector(".helper")
        helper.innerHTML = "Please create a budget first."
    } else {
        //Initialize investment handling
        new_investment();
    }
    
    //Save button functionality for edited investment portfolio after edit button is used
    var save_button = document.querySelector('#save-button');
    let find_token = document.querySelector('input[name=csrfmiddlewaretoken]')
    if (save_button) {
        let csrf_token = find_token.value;

        save_button.addEventListener('click', () => {
            var edit_item = save_button.getAttribute("data-investment-id")
            var edited_cash_value = document.getElementById('cash').value;
            var edited_emergency_value = document.getElementById('emergency').value;
            var edited_equity_value = document.getElementById('equity').value;
            var edited_debt_value = document.getElementById('debt').value;
            var edited_property_value = document.getElementById('property').value;
            var edited_gold_value = document.getElementById('gold').value;
            var edited_retirals_value = document.getElementById('retirals').value;
            var edited_other_value = document.getElementById('other').value;
            
            var edited_cash_monthly_value = document.getElementById('cashmonthly').value;
            var edited_emergency_monthly_value = document.getElementById('emergencymonthly').value;
            var edited_equity_monthly_value = document.getElementById('equitymonthly').value;
            var edited_debt_monthly_value = document.getElementById('debtmonthly').value;
            var edited_property_monthly_value = document.getElementById('propertymonthly').value;
            var edited_gold_monthly_value = document.getElementById('goldmonthly').value;
            var edited_retirals_monthly_value = document.getElementById('retiralsmonthly').value;
            var edited_other_monthly_value = document.getElementById('othermonthly').value; 
            
            var edited_name = document.getElementById('investment_profile').value;

            fetch('/investment', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrf_token
                },
                body: JSON.stringify({
                    "investment": edit_item,
                    "cash": edited_cash_value,
                    "emergency": edited_emergency_value,
                    "equity": edited_equity_value,
                    "debt": edited_debt_value,
                    "property": edited_property_value,
                    "gold": edited_gold_value,
                    "retirals": edited_retirals_value,
                    "other": edited_other_value,
                    "cashmonthly": edited_cash_monthly_value,
                    "emergencymonthly": edited_emergency_monthly_value,
                    "equitymonthly": edited_equity_monthly_value,
                    "debtmonthly": edited_debt_monthly_value,
                    "propertymonthly": edited_property_monthly_value,
                    "goldmonthly": edited_gold_monthly_value,
                    "retiralsmonthly": edited_retirals_monthly_value,
                    "othermonthly": edited_other_monthly_value,
                    "name": edited_name
                })
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
            })
            successful_redirect();
        })
    }
});

function load_remainder() {
    var saving = document.querySelector('#savings');
    let investment_item_values = document.getElementsByClassName("investment-item-monthly-input")
    let investment = 0;
    for (let j=0; j<investment_item_values.length; j++) {
        number = investment_item_values[j].value;
        investment -= number;
    }

    //Calculate remainder
    let investment_value = -investment;
    let remainder = saving.innerHTML - investment_value;
    
    let remainder_tag = document.querySelector("#remainder");

    remainder_tag.innerHTML = `Remaining budget: ${remainder}`;

}

function set_slider() {
    var saving = document.getElementById('savings');
    saving_value = parseInt(saving.innerHTML)
    var sliders = document.getElementsByClassName("investment-item-slider");
    for (let i=0; i<sliders.length; i++) {
        sliders[i].max = saving_value;
        sliders[i].step = 100;
    }
}

function update_chart(chart) {
    var chart_data_root = document.getElementsByClassName("investment-item-monthly-input");
    var chart_data = [];
    for (let i=0; i<chart_data_root.length; i++) {
        chart_data.push(chart_data_root[i].value);
    }
    chart.data.datasets[0].data = chart_data;
    chart.update();
}

function new_investment() {

    //Create chart data
    var chart_labels_root = document.getElementsByClassName("investment-item-input");
    var chart_labels = [];
    for (let i=0; i<chart_labels_root.length; i++) {
        chart_labels.push(chart_labels_root[i].name);
    }
    console.log(chart_labels)
    

    //Create chart
    var ctx = document.getElementById('myChart').getContext('2d');
    var new_chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chart_labels,
            datasets: [{
                label: '%age investment',
                data: [0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 206, 86)',
                    'rgba(75, 192, 192)',
                    'rgba(153, 102, 255)',
                    'rgba(255, 159, 64)',
                    'rgba(124, 228, 12)',
                    'rgba(178, 86, 224)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function(previousValue, currentValue) {
                            return previousValue*1 + currentValue*1;
                        });
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = Math.floor(((currentValue/total) * 100) + 0.5);
                        return percentage + "%";
                    }
                }
            },
            scales: {
                yAxes: [{
                    display:false
                }]
            }
        }
    });
    update_chart(new_chart);


    //Link the inputs and sliders, loading remainder and updating chart with any change
    const budget_inputs = document.getElementsByClassName("investment-item-monthly-input")
    const budget_sliders = document.getElementsByClassName("investment-item-slider")
    for (let i=0; i<budget_sliders.length;i++) {
        budget_sliders[i].addEventListener('input', () => {
            budget_inputs[i].value = budget_sliders[i].value;
            load_remainder();
            update_chart(new_chart);
        })
    }
    for (let i=0; i<budget_inputs.length;i++) {
        budget_inputs[i].addEventListener('input', () => {
            budget_sliders[i].value = budget_inputs[i].value;
            load_remainder();
            update_chart(new_chart);
        })
    }
    set_slider();
}

function successful_redirect() {
    var message = document.querySelector('#message');
    message.innerHTML = 'Save successful. Please wait to return to your last page.'
    message.style.backgroundColor = '#B5F1CC';
    setTimeout(function() {
        location.reload()}, 2000);
}