var map = L.map("map", {
    center: [30,-90],
    zoom: 4,
});


L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  zoom:3,
  maxZoom: 30,
  minZoom:1,
  id: "mapbox.outdoors",
  accessToken: API_KEY
}).addTo(map);


d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson', function(data){
//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson
    console.log(data.features);
    for (x=0; x < data.features.length; x++){
        var latlng = data.features[x].geometry.coordinates;
        console.log(latlng[0],  latlng[1]);

        
        function coloring(){
            if (data.features[x].properties.mag >= 6){
                return "red";
            } else if(data.features[x].properties.mag <= 5.99 && data.features[x].properties.mag >= 5){
                return 'yellow';
            } else if (data.features[x].properties.mag <=4.99){
                return 'green';

            }
        }

        function time_Stamp(time){
            var date = new Date (time*1000);
            var hr = date.getHours();
            var minute = "0" + date.getMinutes();
            var seconds = '0' + date.getSeconds();
            return hr + ':' + minute.substr(-2) + ':' + seconds.substr(-2);
        }

        L.circle([latlng[1], latlng[0]], {
            fillColor:  coloring(),
            fillOpacity: 0.5, 
            color: "black", 
            stroke: .0001, 
            radius: (data.features[x].properties.mag*15000)
        }).addTo(map).bindPopup("<h2><center><u>" + data.features[x].properties.place + "</u></center></h2><center><h3><i> Magnitude: " + data.features[x].properties.mag + "</i></h3></center><center><h3><i> Number of Reports : " + data.features[x].properties.felt + "</i></h3></center>" + "</i></h3></center><center><h3><i> Time Occured : " + time_Stamp(data.features[x].properties.time) + "</i></h3></center>" )

    }

});

var legend = L.control({position: 'topright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'lg');
    div.innerHTML += "<h4> Magnitude: </h4>";
    div.innerHTML += '<i style = "background: #ff0000"></i><span> 6+ </span><br>'
    div.innerHTML += '<i style = "background: #FFFF00"></i><span> 5 to 5.99 </span><br>'
    div.innerHTML += '<i style = "background: #00ff00"></i><span> 4.99 to 4.50 </span><br>'
    
    return div;

};

legend.addTo(map);