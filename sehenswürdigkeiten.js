
let myMap = L.map("mapdiv");
const wienGroup = L.featureGroup ();

let myLayers ={
osm: L.tileLayer (
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        subdomains: ["a", "b", "c"], // subdomains https://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/
        attribution : "Datenquelle: <a href= 'https://www.basemap.at'> openstreetmap.org"
        }
),
geolandbasemap: L.tileLayer (
    "https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
    subdomains : ["maps", "maps1", "maps2", "maps3", "maps4"], // http://leafletjs.com/reference-1.3.0.html#tilelayer-subdomains
    attribution : "Datenquelle: <a href= 'https://www.basemap.at'> basemap.at" // http://leafletjs.com/reference-1.3.0.html#layer-attribution
    }
), 
bmapoverlay: L.tileLayer (
    "https://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png", {
        subdomains : ["maps", "maps1", "maps2", "maps3", "maps4"], 
        attribution : "Datenquelle: <a href= 'https://www.basemap.at'> basemap.at"
        }
),
bmapgrau: L.tileLayer (
    "https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
        subdomains : ["maps", "maps1", "maps2", "maps3", "maps4"], 
        attribution : "Datenquelle: <a href= 'https://www.basemap.at'> basemap.at"
        }
),
bmaphidpi: L.tileLayer (
    "https://{s}.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg", {
        subdomains : ["maps", "maps1", "maps2", "maps3", "maps4"], 
        attribution : "Datenquelle: <a href= 'https://www.basemap.at'> basemap.at"
        }
),
bmaporthofoto30cm: L.tileLayer (
    "https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
        subdomains : ["maps", "maps1", "maps2", "maps3", "maps4"], 
        attribution : "Datenquelle: <a href= 'https://www.basemap.at'> basemap.at"
        }
),
basemapneu : L.tileLayer(
    "https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
    subdomains : ["maps", "maps1", "maps2", "maps3", "maps4"], // http://leafletjs.com/reference-1.3.0.html#tilelayer-subdomains
    attribution : "Datenquelle: <a href='https://www.basemap.at'>basemap.at" // http://leafletjs.com/reference-1.3.0.html#layer-attribution
}
),
};


myMap.addLayer(myLayers.osm); // http://leafletjs.com/reference-1.3.0.html#map-addlayer
let myMapControl = L.control.layers({ // http://leafletjs.com/reference-1.3.0.html#control-layers
"Openstreetmap": myLayers.osm,
"geolandbasemap": myLayers.geolandbasemap,
"bmapgrau": myLayers.bmapgrau,
"bmapoverlay": myLayers.bmapoverlay,
"bmaphidpi": myLayers.bmaphidpi,
"bmaporthofoto30cm": myLayers.bmaporthofoto30cm,
},{
"basemap.at Overlay" : myLayers.bmapoverlay,
"Stadtspaziergang" : wienGroup,
}, {
    collapsed : false
});

myMap.addControl(myMapControl); 
// http://leafletjs.com/reference-1.3.0.html#map-addcontrol

L.control.scale({ 
    position: 'bottomleft', 
    metric: true,
    imperial: false, 
    maxWidth: 200,    
}).addTo(myMap);

// http://leafletjs.com/reference-1.3.0.html#control-scale
// http://leafletjs.com/reference-1.3.0.html#control-scale-imperial
// http://leafletjs.com/reference-1.3.0.html#control-scale


myMap.setView([47.267,11.383], 8); // http://leafletjs.com/reference-1.3.0.html#map-setview

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
    const wiendata = await response.json ();
    console.log("GeoJson:", wiendata);
    const geojson = L.geoJSON (wiendata, {
        style: function(feature){
            return {color: "#ff0000"};
        }, 
        pointToLayer: function(geoJsonPoint, latlng) {
            return L.marker(latlng, {
                 icon: L.icon ({
                    iconUrl: 'sight-2.png'
                })
            });
        }
        
    });
    wienGroup.addLayer(geojson);
    myMap.fitBounds(wienGroup.getBounds());
}


const url = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&srsName=EPSG:4326&outputFormat=json&typeName=ogdwien:SPAZIERPUNKTOGD,ogdwien:SPAZIERLINIEOGD"

addGeojson(url);


myMap.addLayer(wienGroup);
