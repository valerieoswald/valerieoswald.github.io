
let myMap = L.map("mapdiv");
const citybikeGroup = L.featureGroup ();

var markers = L.markerClusterGroup();
myMap.addLayer(markers);

let myLayers ={
geolandbasemap: L.tileLayer (
    "https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
    subdomains : ["maps", "maps1", "maps2", "maps3", "maps4"],
    attribution : "Datenquelle: <a href= 'https://www.basemap.at'> basemap.at"
    }
), 
};


myMap.addLayer(myLayers.geolandbasemap); 
let myMapControl = L.control.layers({
"geolandbasemap": myLayers.geolandbasemap,
},{
"Citybike Standorte" : citybikeGroup,
}, {
    collapsed : false
});

myMap.addControl(myMapControl); 


L.control.scale({ 
    position: 'bottomleft', 
    metric: true,
    imperial: false, 
    maxWidth: 200,    
}).addTo(myMap);




myMap.setView([48.212501, 16.385729], 8); 

// console.log("Spaziergang: ", Spaziergang);
// let geojson= L.geoJSON(Spaziergang).addTo(wienGroup);
// geojson.bindPopup(function(layer){
//     const props = layer.feature.properties;
//     const popupText= `<h1>${props.NAME}</h1>
//     <p> ${props.BEMERKUNG} </p>`;
//     return popupText; 
//     // console.log("Layer for popup:", layer);
// });



async function addGeojson (url) {
    // console.log("Url wird geladen: ", url);
    const response = await fetch(url);
    // console.log("Response: ", response);
    const citybike_standorte = await response.json ();
    console.log("GeoJson:", citybike_standorte);
    const geojson = L.geoJSON (citybike_standorte, { 
        pointToLayer: function(geoJsonPoint, latlng) {
            return L.marker(latlng, {
                 icon: L.icon ({
                    iconUrl: 'bicycle_parking.png'
                })
            });
        }
        
    });
    geojson.bindPopup(function(layer){
        const props = layer.feature.properties;
        const popupText= `<h1>${props.STATION}</h1>`;
        return popupText; 
        console.log("Layer for popup:", layer);
    });
    

    const hash = new L.hash(myMap);
    markers.addLayer(geojson)
    // citybikeGroup.addLayer(geojson);
    // myMap.fitBounds(citybikeGroup.getBounds());
    myMap.fitBounds(markerClusterGroup.getBounds());
}




const url = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:CITYBIKEOGD&srsName=EPSG:4326&outputFormat=json"

addGeojson(url);


myMap.addLayer(citybikeGroup);
