// Importing CSV file
console.log("Importing CSV file");

var temp = []; // Temperature value array
var humi = []; // Humidity value array
var chartDate = [];  // Date array

$.ajax({
  url:'./javascripts/temp.csv', 
  type:'get',
  dataType:'text',
  cache:false,
  success: function(str){
    temp = str.split(',');
    console.log("temp :"+temp[0]);
    console.log("Number of array elements "+temp.length);
  }
}).done(function() { 
  $.ajax({
    url:'./javascripts/humi.csv', 
    type:'get',
    dataType:'text',
    cache:false,
    success: function(str){
      humi = str.split(',');
      console.log("humi :"+humi[0]);
      console.log("Number of array elements "+humi.length);
    }
}).done(function() { 
  $.ajax({
    url:'./javascripts/chartDate.csv', 
    type:'get',
    dataType:'text',
    cache:false,
    success: function(str){
      chartDate = str.split(',');
      console.log("chartDate :"+chartDate[0]);
      console.log("Number of array elements "+chartDate.length);
    }
  }).done(function() {

// Creating Line Chart
console.log("Creating Line Chart");

var ctx = document.getElementById("myLineChart").getContext("2d");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [{
        data: temp,
        label: "Temperature",
        borderColor: window.chartColors.red,
				backgroundColor: window.chartColors.red,
        fill: false,
        // This binds the dataset to the left y axis
        yAxisID: 'left-y-axis'
    }, {
      data: humi,
      label: "Humidity",
      borderColor: window.chartColors.blue,
      backgroundColor: window.chartColors.blue,
      fill: false,
      // This binds the dataset to the right y axis
      yAxisID: 'right-y-axis'
    }],
    labels: chartDate
  },
  options: {
    title: {
      display: true,
      text: 'Chart.js Line Chart - Multi Axis'
    },
    scales: {
        yAxes: [{
            id: 'left-y-axis',
            type: 'linear',
            position: 'left'
        }, {
            id: 'right-y-axis',
            type: 'linear',
            position: 'right'
        }],
        xAxes: [{
          ticks: {
            reverse: true
          }
      }]
    }
  }
});
});
});
});


