var citiesArray = [];
var cityInput = $('#cityInput');
var searchBtnEl = $('#searchBtn');
var cityAppenderEl = $('#cityAppender')
var cityFormEl = $('#city-form');
var currentCity= $('#currentCity');
var today = moment().format('MM/DD/YYYY');

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

          var iconcode = data.weather[0].icon;
          var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
         var icon = $('<img>').attr('src', iconurl);
            currentCity.html('<strong>'+ cityName +'</strong> &nbsp;' 
            + today + '&nbsp;' );
            currentCity.append(icon);

        $('#cTemp').html('Temp: &nbsp;' + data.main.temp + '°F');
        $('#cWind').html('Wind: &nbsp;' + data.wind.speed+ 'MPH');
        $('#cHumidity').html('Humidity: &nbsp;' + data.main.humidity + '%');
        $('#cUV').html('UV Index: &nbsp;');    

        var lat = data.coord.lat;
        var lon = data.coord.lon;
        console.log(lat);
        console.log(lon);
        setUV(lat, lon);

    	},
    	error: function(){
    		alert("There was an error.");
    	}
    });

}


function setUV(lat, lon){
   
    var queryUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat + "&lon=" + lon + "&appid=478e401a93735bdfa0c38415c842b721";

    $.ajax({
        url: queryUrl,
        dataType: 'json',
        success: function(data){ 
     console.log(data);

     var uvi = data.current.uvi;
    var uvBadge =  $('<button>');
    uvBadge.addClass('btn');
    uvBadge.attr('type', 'button');
    
    uvBadge.text(uvi);


     if (uvi<=2){
        uvBadge.addClass('btn-success');

     }else if (uvi <=5){
        uvBadge.addClass('btn-warning');

     }else{
        uvBadge.addClass('btn-danger');

     };

     $('#cUV').append(uvBadge);

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
        var forecast= $('#forecast');
     

      for(i=0; i<41; i++){
        while(i%8==0) {
        var iconcode =  data.list[i].weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
       var icon = $('<img>').attr('src', iconurl);

       var reformatDate = moment(data.list[i].dt_text, "YYYY-MM-DD HH:mm:ss").format("MM-DD-YYYY");
     var container= $('<div>').addClass('col-sm-2');
        forecast.append(container);
        var card = $('<div>').addClass('card')
            .addClass('bg-light').addClass('mb-3')
            .attr('style', 'max-width:18rem;');
        container.append(card);
       
        var header = $('<h5>').addClass('card-header')
        .text(reformatDate);
        card.append(header);

        var body =$('</div>').addClass('card-body');
        header.append(body);

        var title =$('<div>').addClass('card-title');
        body.append(title);
        title.append(icon);

        var cardText = $('<p>').addClass('card-text');
        body.append(cardText);

        var uList= $('<ul>').addClass('list-group').addClass('list-group-flush');
        cardText.append(uList);

        var temp= $('<li>').addClass('list-group-item').addClass('mt-1')
        .text('Temp: &nbsp;' + data.list[i].main.temp + '°F')
        uList.append(temp);

        var wind= $('<li>').addClass('list-group-item').addClass('mt-1')
        .text('Wind: &nbsp;' + data.list[i].wind.speed + 'MPH')
        uList.append(wind);

        var humidity= $('<li>').addClass('list-group-item').addClass('mt-1')
        .text('Humidity: &nbsp;' + data.list[i].main.humidity + '%')
        uList.append(humidity);

        }
      }

            },
            error: function(){
                alert("There was an error.");
            }
        });

    }