
let myMap = L.map("mapdiv");
let markerGroup = L.featureGroup();
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
"Marker": markerGroup,
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


myMap.setView([47.267,11.383], 11); // http://leafletjs.com/reference-1.3.0.html#map-setview

const uni = [47.264, 11.385];
const usi = [47.257, 11.356];
const technik =[47.263, 11.343];
const patscherkofl = [47.220023, 11.466054];
const igls = [47.232433, 11.408626];

myMap.addLayer(markerGroup);
const markerOptions =  {title: "Universität Innsbruck",
draggable: false,
riseOnHover: true,
opacity: 0.7,
};
L.marker(uni,markerOptions).addTo(markerGroup);
L.marker (usi, markerOptions).addTo(markerGroup);
L.marker (technik, markerOptions).addTo(markerGroup);
let patscherkoflMarker = L.marker (patscherkofl, {title: "Patscherkofl"}).addTo(markerGroup);
L.marker (igls, {title: "Igls"}).addTo(markerGroup);

patscherkoflMarker.bindPopup ("<p>Patscherkofl</p><img style='width:200px' src='js/leaflet/images/patscherkofl.jpg' alt='Patscherkofl'/>");

let lift = L.polyline([patscherkofl, igls], {
    color: "red",
});
myMap.addLayer(lift);

let uniPolygon = L.polygon([uni, usi, technik]);
myMap.addLayer(uniPolygon);
uniPolygon.bindPopup("Ende!")

myMap.fitBounds(markerGroup.getBounds());