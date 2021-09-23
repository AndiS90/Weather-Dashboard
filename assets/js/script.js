var citiesArray = [];
var cityInput = $('#cityInput');
var searchBtnEl = $('#searchBtn');
var cityAppenderEl = $('#cityAppender')
var cityFormEl = $('#city-form');

//this section pulls the stored city history and sets it when entered
function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {
        citiesArray = storedCities;
    }

    renderCities();
}

init();

function storeCities() {

    // Stringify and set key in localStorage to citiesArray (array)
    localStorage.setItem("cities", JSON.stringify(citiesArray));

};

cityFormEl.on('submit', function(event) {
    event.preventDefault();

    var citiesText = cityInput.val();

    // Return from function early if submitted citiesText is blank
    if (citiesText === "") {
        return;
    }

    // Add new city to cities array, clear the input
    citiesArray.push(citiesText);
    cityInput.val("");

    // Store updated cities in localStorage, re-render the list
    storeCities();
    renderCities();

    searchApiCurrent(citiesText);
    searchApiForecast(citiesText);

});

function renderCities() {

    cityAppenderEl.html('');

    for (var i = 0; i < citiesArray.length; i++) {

        var cityButton = $('<button>');
        cityButton.text(citiesArray[i]);
        cityButton.attr('type', 'button');
        cityButton.addClass('btn');
        cityButton.addClass('btn-secondary');
        cityButton.addClass('btn-block');
        cityButton.addClass('mt-1');
        cityAppenderEl.append(cityButton);

        cityButton.on("click", searchAgain);

    }
}
//end city history code

function searchAgain(event){
var pastCity = $(event.target).text();

if(pastCity) {
    searchApiCurrent(pastCity);
    searchApiForecast(pastCity);
}

}


// cityFormEl.on('submit', function(event) {
//     event.preventDefault();

//     var cityName= cityInput.val();
//     searchApiCurrent(cityName);
//     searchApiForecast(cityName);
// });

function searchApiCurrent(cityName) {
    
  
    if (cityName) {
     var queryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName 
      + '&units=imperial&appid=478e401a93735bdfa0c38415c842b721';
    }
  

    // $.getJSON(queryUrl, (data) => {
    //     console.log(data);
    // }

    $.ajax({
    	url: queryUrl,
        dataType: 'json',
    	success: function(data){ 
    	  console.log(data);
    	},
    	error: function(){
    		alert("There was an error.");
    	}
    });

}



    function searchApiForecast(cityName) {    
  
        if (cityName) {
        var  queryUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName 
          + '&units=imperial&appid=478e401a93735bdfa0c38415c842b721';
        }
      
        
    // $.getJSON(queryUrl, (data) => {
    //     console.log(data);
    // }

    
        $.ajax({
            url: queryUrl,
            dataType: 'json',
            success: function(data){ 
         console.log(data);

            },
            error: function(){
                alert("There was an error.");
            }
        });

    }