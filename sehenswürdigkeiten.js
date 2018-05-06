
let myMap = L.map("mapdiv");
const sehenswürdigkeitenGroup = L.featureGroup ();

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
"Sehenswürdigkeiten" : sehenswürdigkeitenGroup,
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
    const sehenswürdigkeiten_standorte = await response.json ();
    console.log("GeoJson:", sehenswürdigkeiten_standorte);
    const geojson = L.geoJSON (sehenswürdigkeiten_standorte, { 
        pointToLayer: function(geoJsonPoint, latlng) {
            return L.marker(latlng, {
                 icon: L.icon ({
                    iconUrl: 'sight-2.png'
                })
            });
        }
        
    });
    geojson.bindPopup(function(layer){
        const props = layer.feature.properties;
        const popupText= `<h1>${props.NAME}</h1>
        <p> ${props.ADRESSE} </p>`;
        return popupText; 
        console.log("Layer for popup:", layer);
    });
    sehenswürdigkeitenGroup.addLayer(geojson);
    myMap.fitBounds(sehenswürdigkeitenGroup.getBounds());
}


const url = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json"

addGeojson(url);


myMap.addLayer(sehenswürdigkeitenGroup);
