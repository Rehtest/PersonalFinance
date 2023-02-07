document.addEventListener('DOMContentLoaded', function() {
    var number_of_months_handler = document.querySelector('#months')

    //Check if there is an existing investment portfolio
    if (document.querySelector("#investment_name") != null) {
        //Get elements for forecast
        var current_values = document.getElementsByClassName('chart-data')
        var current_monthly_values = document.getElementsByClassName('chart-data-monthly')
        var growth_rates = document.getElementsByClassName('annual-growth')
        var forecast_values = document.getElementsByClassName('forecast-value')
        var slider = document.getElementById('month-slider')

        //Create chart with existing current values
        var chart_data = [];
        var chart_data_points = document.getElementsByClassName('chart-data');
        for (let i=1; i<chart_data_points.length; i++) {
            chart_data.push(chart_data_points[i].innerHTML);
        };
        var chart = document.getElementById('myChart').getContext('2d');
        var new_chart = new Chart(chart, {
            type: 'pie',
            data: {
                labels: ["Cash", "Emergency", "Equity", "Debt", "Property", "Gold", "Retirals", "Other"],
                datasets: [{
                    label: '%age of forecast',
                    data: chart_data,
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
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        display:false
                    }]
                }
            }
        )

        
        //Add forecast functionality when slider is moved (start from 1 for chart-data and chart-data-monthly classes as chart-data[0] is the budget and chart-data-monthly[0] is a blank field)
        slider.addEventListener('change', () => {
            var total_forecast = 0;
            for (let i=0; i<forecast_values.length; i++) {
                forecast_values[i].value = forecaster(current_values[i+1].innerHTML, current_monthly_values[i+1].innerHTML, slider.value, growth_rates[i].value)*1;
                total_forecast += parseInt(forecast_values[i].value);
                update_chart(new_chart)
            }
            number_of_months_handler.innerHTML = `Number of months: ${slider.value}. Total Forecast value: ${total_forecast}`;
        })
    }
});
    


function forecaster(base, monthly, months, multiplier) {
    months = months*1
    base = base*1
    while (months >= 1) {
        let growth = (base * (multiplier/12)/100)
        let new_base = growth + monthly*1 + base
        base = new_base
        months -= 1
    }
    return Math.round(base, 2);
}

function update_chart(chart) {
    var chart_data_root = document.getElementsByClassName("forecast-value");
    var chart_data = [];
    for (let i=0; i<chart_data_root.length; i++) {
        chart_data.push(chart_data_root[i].value);
    }
    chart.data.datasets[0].data = chart_data;
    chart.update();
}