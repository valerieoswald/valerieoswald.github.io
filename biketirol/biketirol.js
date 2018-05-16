/*
    Vorbereitung: GPX Track herunterladen und nach GeoJSON konvertieren
    -------------------------------------------------------------------
    -Datenquelle https://www.data.gv.at/suche/?search-term=bike+trail+tirol&searchIn=catalog
    -Download Einzeletappen / Zur Ressource ...
    -Alle Dateien im unterverzeichnis data/ ablegen
    -Die .gpx Datei der eigenen Etappe als etappe00.gpx speichern
    -Die .gpx Datei über https://mapbox.github.io/togeojson/ in .geojson umwandeln und als etappe00.geojson speichern
    -Die etappe00.geojson Datei in ein Javascript Objekt umwandeln und als etappe00.geojson.js speichern

    -> statt 00 natürlich die eigene Etappe (z.B. 01,02, ...25)
*/

// -eine neue Leaflet Karte definieren

// -Grundkartenlayer mit OSM, basemap.at, Elektronische Karte Tirol (Sommer, Winter, Orthophoto jeweils mit Beschriftung) über L.featureGroup([]) definieren
// -WMTS URLs siehe https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol

//- Maßstab metrisch ohne inch

// -Start- und Endpunkte der Route als Marker mit Popup, Namen, Wikipedia Link und passenden Icons für Start/Ziel von https://mapicons.mapsmarker.com/

// -GeoJSON Track als Linie in der Karte einzeichnen und auf Ausschnitt zoomen
// - Einbauen nicht über async, sondern über ein L.geoJSON() mit einem Javascript Objekt (wie beim ersten Stadtspaziergang Wien Beispiel)

// -Baselayer control für OSM, basemap.at, Elektronische Karte Tirol hinzufügen

// -Overlay controls zum unabhängigem Ein-/Ausschalten der Route und Marker hinzufügen

let myMap = L.map("map");
const etappe22Group = L.featureGroup ();
let markerGroup = L.featureGroup();
let tirolsommer = L.featureGroup ();
let tirolwinter = L.featureGroup ();
let tirolortho = L.featureGroup ();

let myLayers ={
    osm: L.tileLayer (
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            subdomains: ["a", "b", "c"],
            attribution : "Datenquelle: <a href= 'https://www.basemap.at'> openstreetmap.org"
            }
    ),
    geolandbasemap: L.tileLayer (
    "https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
    subdomains : ["maps", "maps1", "maps2", "maps3", "maps4"], 
    attribution : "Datenquelle: <a href= 'https://www.basemap.at'> basemap.at"
    }
),
    sommer: L.tileLayer (
    "http://wmts.kartetirol.at/wmts/gdi_base_summer/{z}/{x}/{y}.jpeg80", {
        attribution : "Datenquelle: <a href= 'http://wmts.kartetirol.at/wmts'> kartetirol.at"
        }
    ),
    winter: L.tileLayer (
    "http://wmts.kartetirol.at/wmts/gdi_base_winter/{z}/{x}/{y}.jpeg80", {
        attribution : "Datenquelle: <a href= 'http://wmts.kartetirol.at/wmts'> kartetirol.at"
        }
    ),
    ortho: L.tileLayer (
    "http://wmts.kartetirol.at/wmts/wmts/gdi_ortho/{z}/{x}/{y}.jpeg80", {
       attribution : "Datenquelle: <a href= 'http://wmts.kartetirol.at/wmts'> kartetirol.at"
       }
    ),  
    tirolschrift: L.tileLayer (
        "http://wmts.kartetirol.at/wmts/wmts/gdi_nomenklatur/{z}/{x}/{y}.png8", {
           attribution : "Datenquelle: <a href= 'http://wmts.kartetirol.at/wmts'> kartetirol.at"
           }
        ),  
};   

tirolsommer = L.featureGroup([myLayers.sommer, myLayers.tirolschrift]);
tirolwinter = L.featureGroup([myLayers.winter, myLayers.tirolschrift]);
tirolortho = L.featureGroup([myLayers.ortho, myLayers.tirolschrift]);


// L.control.layers(baseMaps, overlayMaps).addTo(map)
myMap.addLayer(myLayers.osm);
let myMapControl = L.control.layers({ 
    "openstreetmap": myLayers.osm,
    "geolandbasemap": myLayers.geolandbasemap,
    // "tirol sommer": myLayers.sommer,
    // "tirol winter": myLayers.winter,
    // "tirol ortho": myLayers.ortho, 
    "tirol sommer": tirolsommer,
    "tirol winter": tirolwinter,
    "tirol ortho": tirolortho,}
, {
    // "tirol Beschriftung" : myLayers.tirolschrift,
    "Etappe 22" : etappe22Group,
    "Start und Ziel" : markerGroup,
    }, {
        collapsed : false
    });

// Warum zeigts beim orthofoto die schrift nicht mit an?

myMap.addControl(myMapControl); 

L.control.scale({ 
    position: 'bottomleft', 
    metric: true,
    imperial: false, 
    maxWidth: 200,    
}).addTo(myMap)

myMap.setView([47.267,11.383], 11);

const start = [47.134392, 11.452644];
const ziel = [47.163916, 11.37897];
myMap.addLayer(markerGroup);

let startMarker = L.marker(start,{icon: L.icon ({iconUrl: 'images/start.png', iconSize: [45, 50],iconAnchor: [22, 50]})},{title: "Start"}).addTo(markerGroup);
let zielMarker = L.marker (ziel,{icon: L.icon ({iconUrl: 'images/ziel.png',iconSize: [45, 50],iconAnchor: [22, 50]})}, {title: "Ziel"}).addTo(markerGroup);

// let startMarker = L.marker(start,{title: "Start"}).addTo(markerGroup);
// warum verlieren die Marker den title, wenn ich das icon ändere?? Wenn ichs als erstes element nenn, kommt der blaue Marker, als letztes wird er nicht angezeigt?

startMarker.bindPopup ("<h1>Start</h1><a href='https://de.wikipedia.org/wiki/Matrei_am_Brenner'>Matrei");  
zielMarker.bindPopup ("<h1>Ziel</h1><a href=' https://de.wikipedia.org/wiki/Mieders'>Mieders");

console.log("etappe22: ", etappe22);
let geojson= L.geoJSON(etappe22).addTo(etappe22Group);

etappe22Group.addLayer(geojson);
myMap.fitBounds(etappe22Group.getBounds());
myMap.addLayer(etappe22Group);
