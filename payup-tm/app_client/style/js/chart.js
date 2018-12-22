// getDebtChart: get chart representing the debt with respect to time
var getDebtChart = function(days, debt, interest, currency) {
    return new Chart(document.getElementById("line-chart"), {
        responsive: true,
        type: 'line',
        maintainAspectRatio: false,
        // data
        data: {
            labels: days,
            datasets: [{ 
                data: debt,
                label: "Debt",
                borderColor: "#3e95cd",
                fill: true
            },{
                data: interest,
                label: "Interest Accumulated",
                borderColor: "#ffff00",
                fill: false
            }]
        },
        options: {
            // title
            title: {
                display: true,
                text: 'Your Debt Status By Days Passed (in ' + currency + ')'
            }, scales: {
                // axis labels
                yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'amount in ' + currency
                        }
                }],
                xAxes: [{
                    scaleLabel: {
                            display: true,
                            labelString: 'day'
                        }
                }]
            }
            
        }
    });
};