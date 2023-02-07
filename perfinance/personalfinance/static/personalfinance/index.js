document.addEventListener('DOMContentLoaded', function() {

    //Check if there is an existing budget
    if (document.getElementById("existing-budget-form") != null) {

        // This hides the "Plan your Budget" section and creates a chart from existing budget data
        document.querySelector('#new-budget-form').style.display = 'none';
        var existing_chart_data = [];
        var existing_chart_data_points = document.getElementsByClassName('chart-data');
        for (let i=1; i<existing_chart_data_points.length; i++) {
            existing_chart_data.push(existing_chart_data_points[i].innerHTML);
        };
        var existing_chart = document.getElementById('budgetChart').getContext('2d');
        var budget_chart = new Chart(existing_chart, {
            type: 'pie',
            data: {
                labels: ["housing", "transportation", "food", "utilities", "healthcare", "savings", "recreation", "miscellaneous"],
                datasets: [{
                    label: '%age of budget',
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

        //Edit button functionality for existing budget
        edit_button = document.querySelector("#edit-button")
        edit_button.addEventListener('click', () => {
            document.querySelector('#new-budget-form').style.display = 'block';
            var new_budget_inputs = document.getElementsByClassName("budget-item-input")
            for (let i=0; i<existing_chart_data.length; i++) {
                new_budget_inputs[i].value = existing_chart_data[i];
            }
            //Add existing name to the input name field
            current_name = document.querySelector('#budget_name')
            budget_profile = document.querySelector('#budget_profile')
            budget_profile.value = current_name.innerHTML;

            var new_budget_value = document.querySelector('#budget');
            new_budget_value.value = existing_chart_data_points[0].innerHTML
            new_budget();
            set_slider();
            document.querySelector('#existing-budget-form').style.display = 'none';
        })

        //Change profile functionality for existing budget
        var budget_button_holder = document.querySelector('#budget-button-holder');
        var budget_profile_select = document.querySelector('#budget-profile-select');
        var profile_select_dropdown = document.getElementById('budget-options')
        let csrf_token_value = document.querySelector('input[name=csrfmiddlewaretoken]').value;
        profile_select_dropdown.style.display = 'none';
        
        budget_profile_select.addEventListener('click', () => {
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
                    "change": "budget"
                })
            })
            successful_redirect();
        })
    } else {
        new_budget();
    }

    //Save button functionality for edited budget after edit button is used
    var save_button = document.querySelector('#save-button');
    let find_token = document.querySelector('input[name=csrfmiddlewaretoken]')
    if (save_button) {
        let csrf_token = find_token.value;

        save_button.addEventListener('click', () => {
            var edit_item = save_button.getAttribute("data-budget-id")
            var edited_budget_value = document.getElementById('budget').value;
            var edited_housing_value = document.getElementById('housing').value;
            var edited_transportation_value = document.getElementById('transportation').value;
            var edited_food_value = document.getElementById('food').value;
            var edited_utilities_value = document.getElementById('utilities').value;
            var edited_healthcare_value = document.getElementById('healthcare').value;
            var edited_savings_value = document.getElementById('savings').value;
            var edited_recreation_value = document.getElementById('recreation').value;
            var edited_miscellaneous_value = document.getElementById('miscellaneous').value;
            var edited_name = document.getElementById('budget_profile').value;

            fetch('/edit-budget', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrf_token
                },
                body: JSON.stringify({
                    "budget_item": edit_item,
                    "budget": edited_budget_value,
                    "housing": edited_housing_value,
                    "transportation": edited_transportation_value,
                    "food": edited_food_value,
                    "utilities": edited_utilities_value,
                    "healthcare": edited_healthcare_value,
                    "savings": edited_savings_value,
                    "recreation": edited_recreation_value,
                    "miscellaneous": edited_miscellaneous_value,
                    "name": edited_name
                })
            })
            .then(response => response.json())
            .then(result => {
                console.log(result)
            })
            successful_redirect();
        })
    }
});

function load_remainder() {
    var budget = document.querySelector('#budget');
    let budget_item_values = document.getElementsByClassName("budget-item-input")
    let spend = 0;
    for (let j=0; j<budget_item_values.length; j++) {
        number = budget_item_values[j].value;
        spend -= number;
    }

    //Calculate remainder
    let spend_value = -spend;
    let remainder = budget.value - spend_value;
    
    let spend_tag = document.querySelector("#spend");
    let remainder_tag = document.querySelector("#remainder");

    spend_tag.innerHTML = `Your Current Spend: ${spend_value}`;
    remainder_tag.innerHTML = `Remaining budget: ${remainder}`;

}

function set_slider() {
    var budget = document.getElementById('budget');
    var sliders = document.getElementsByClassName("budget-item-slider");
    for (let i=0; i<sliders.length; i++) {
        sliders[i].max = budget.value;
        sliders[i].step = 500;
    }
}

function update_chart(chart) {
    var chart_data_root = document.getElementsByClassName("budget-item-input");
    var chart_data = [];
    for (let i=0; i<chart_data_root.length; i++) {
        chart_data.push(chart_data_root[i].value);
    }
    chart.data.datasets[0].data = chart_data;
    chart.update();
}

function new_budget() {

    //Create chart data
    var chart_labels_root = document.getElementsByClassName("budget-item-input");
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
                label: '%age of budget',
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

    //Change sliders maximum and step when budget changes
    const budget_handler = document.querySelector('#budget');
    budget_handler.addEventListener('change', set_slider)


    //Link the inputs and sliders, loading remainder and updating chart with any change
    const budget_inputs = document.getElementsByClassName("budget-item-input")
    const budget_sliders = document.getElementsByClassName("budget-item-slider")
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
}

function successful_redirect() {
    var message = document.querySelector('#message');
    message.innerHTML = 'Save successful. Please wait to return to your last page.'
    message.style.backgroundColor = '#B5F1CC';
    setTimeout(function() {
        location.reload()}, 2000);
}