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

let myMap = L.map("map", {
    fullscreenControl: true
});
const etappe22Group = L.featureGroup ();
let markerGroup = L.featureGroup();
let tirolsommer = L.featureGroup ();
let tirolwinter = L.featureGroup ();
let tirolortho = L.featureGroup ();
let overlaySteigung = L.featureGroup().addTo(myMap);

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
    "Start und Ziel" : markerGroup,
    "Steigung" : overlaySteigung,
    "Etappe 22" : etappe22Group,
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

// console.log("etappe22: ", etappe22);
// let geojson= L.geoJSON(etappe22).addTo(etappe22Group);

// etappe22Group.addLayer(geojson);

//höhenprofil dazu
let hoehenProfil = L.control.elevation({
    position: "topright",
    theme: "steelblue-theme",
    collapsed: true,
}).addTo(myMap);

let gpxTrack = new L.GPX ("data/etappe22.gpx", {
    async: true, 
}).addTo(etappe22Group);
gpxTrack.on("loaded", function(evt) {
    console.log("get_distance", evt.target.get_distance().toFixed(0))
    console.log("get_elevation_min", evt.target.get_elevation_min().toFixed(0))
    console.log("get_elevation_max",evt.target.get_elevation_max().toFixed(0))
    console.log("get_elevation_gain",evt.target.get_elevation_gain().toFixed(0))
    console.log("get_elevation_loss",evt.target.get_elevation_loss().toFixed(0))
    let laenge = evt.target.get_distance().toFixed(0);
    document.getElementById("laenge").innerHTML = laenge;
    let tiefster = evt.target.get_elevation_min().toFixed(0);
    document.getElementById("tiefster").innerHTML = tiefster;
    let hoechster = evt.target.get_elevation_max().toFixed(0);
    document.getElementById("hoechster").innerHTML = hoechster;
    let aufstieg = evt.target.get_elevation_gain().toFixed(0);
    document.getElementById("aufstieg").innerHTML = aufstieg;
    let abstieg = evt.target.get_elevation_loss().toFixed(0);
    document.getElementById("abstieg").innerHTML = abstieg;

    myMap.fitBounds(evt.target.getBounds());
});

gpxTrack.on("addline", function(evt){
    hoehenProfil.addData(evt.line);
    console.log(evt.line);
    console.log(evt.line.getLatLngs());
    console.log(evt.line.getLatLngs()[0]);
    console.log(evt.line.getLatLngs()[0].lat);
    console.log(evt.line.getLatLngs()[0].lng);
    console.log(evt.line.getLatLngs()[0].meta);
    console.log(evt.line.getLatLngs()[0].meta.ele);

    // alle Segmente der Steigunslinie hinzufügen
    let gpxLinie = evt.line.getLatLngs();
//    let i=1 weils beim zweiten punkt startet
    for (let i=1; i < gpxLinie.length; i++) {
        let p1 = gpxLinie[i-1];
        let p2 = gpxLinie[i];
    
//  Entfernung berechnen
        let dist = myMap.distance(
            [p1.lat, p1.lng],
            [p2.lat, p2.lng]
        );

        // Höhenunterschied berechnen
        let delta = p2.meta.ele -p1.meta.ele;

        // Steigung in Prozent berechnen
        // let proz = 0;
        // if (dist > 0) {
        //     proz = (delta / dist * 100.0).toFixed(1);
        // }
        let proz = (dist > 0) ? (delta / dist * 100.0).toFixed(1) : 0;
        // if dist > 0 -> schaut, dass nicht durch 0 divideirt wird (sonst fehler und strecke wird nicht weiterberechnet)
        // toFixed(1) -> eine Nachkommastelle!

        // Bedingung ? Ausdruck! : Ausdruck2

        console.log(p1.lat,p1.lng,p2.lat,p2.lng, dist, delta, proz);
        let farbe = 
            proz >10  ? "#d7301f" : 
            proz >6   ? "#fc8d59": 
            proz >2   ? "#fdcc8a" : 
            proz >0   ? "#fef0d9" : 
            proz >-2  ? "#edf8fb" : 
            proz >-6  ? "#b2e2e2" : 
            proz >-10 ? "#66c2a4" : 
                        "#238b45";
// http://colorbrewer2.org/#type=sequential&scheme=YlGnBu&n=3

        let segment = L.polyline(
            [
                [p1.lat, p1.lng],
                [p2.lat, p2.lng],
            ], {
                color : farbe,
                weight : 10,
            }
        ).addTo(overlaySteigung);
    }
});

 

// um die position im Höhenprofil zu bestimmen im leaflet.elevation-0.0.4.min.js und src.js -> L.Browser.touch suchen und mit L.Browser.mobile ersetzen!! 


// myMap.fitBounds(etappe22Group.getBounds());
// myMap.addLayer(etappe22Group);




// http://colorbrewer2.org/#type=sequential&scheme=YlGnBu&n=3