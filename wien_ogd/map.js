// Leaflet Karte initialisieren
let karte = L.map("divKarte", {
    fullscreenControl: true
});
// Gruppe für GeoJSON Layer definieren
let geojsonGruppe = L.featureGroup().addTo(karte);

// Grundkartenlayer definieren
const grundkartenLayer = {
    osm: L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            subdomains: ["a", "b", "c"],
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    ),
    geolandbasemap: L.tileLayer(
        "https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
            subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
            attribution: "Datenquelle: <a href='https://www.basemap.at'>basemap.at</a>"
        }
    ),
    bmapoverlay: L.tileLayer(
        "https://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png", {
            subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
            attribution: "Datenquelle: <a href='https://www.basemap.at'>basemap.at</a>"
        }
    ),
    bmapgrau: L.tileLayer(
        "https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
            subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
            attribution: "Datenquelle: <a href='https://www.basemap.at'>basemap.at</a>"
        }
    ),
    bmaphidpi: L.tileLayer(
        "https://{s}.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg", {
            subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
            attribution: "Datenquelle: <a href='https://www.basemap.at'>basemap.at</a>"
        }
    ),
    bmaporthofoto30cm: L.tileLayer(
        "https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
            subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
            attribution: "Datenquelle: <a href='https://www.basemap.at'>basemap.at</a>"
        }
    ),
}

// Map control mit Grundkarten und GeoJSON Overlay definieren
let kartenAuswahl = L.control.layers({
    "Openstreetmap": grundkartenLayer.osm,
    "basemap.at Grundkarte": grundkartenLayer.geolandbasemap,
    "basemap.at grau": grundkartenLayer.bmapgrau,
    "basemap.at Orthofoto": grundkartenLayer.bmaporthofoto30cm,
}, {
    "GeoJSON Layer": geojsonGruppe,
});
karte.addControl(kartenAuswahl);

// Grundkarte "grau" laden
karte.addLayer(grundkartenLayer.bmapgrau)

// Maßstabsleiste metrisch hinzufügen
L.control.scale({
    maxWidth: 200,
    imperial: false,
}).addTo(karte);

// asynchrone Funktion zum Laden eines GeoJSON Layers
async function ladeGeojsonLayer(datenAttribute) {
    const response = await fetch(datenAttribute.json);
    console.log(datenAttribute);
    const response_json = await response.json();

    if(datenAttribute.icon) {
        console.log("Pause")
    }

    // GeoJSON Geometrien hinzufügen und auf Ausschnitt zoomen
    const geojsonObjekt = L.geoJSON(response_json, {
        onEachFeature : function(feature,layer) {
        // console.log(feature.properties);
       let popup ="<h3>Attribute</h3>";
        for (attribut in feature.properties){
            let wert = feature.properties[attribut]; 
            if (wert && wert.toString().startsWith("http:")){
                popup += `${attribut}:<a href = "${wert}">Weblink</a><br/>`;  
            } else {
                popup += `${attribut}: ${wert}<br/>`;

            }
        // console.log(attribut, feature.properties[attribut])
        // popup += `${attribut}: ${feature.properties[attribut]}<br/>`;
        }
        // console.log(popup)
        layer.bindPopup(popup, {
            maxWidth : 600, 
        });
     },
     pointToLayer : function(geoJsonPoint, latlng) {
        if (datenAttribute.icon) {
            return L.marker(latlng, {
              icon : L.icon ({
                  iconUrl : datenAttribute.icon,
                  iconAnchor : [16, 32],
                  popupAnchor : [0, -32],
              })  
            })
        } else {
            return L.marker(latlng);
        }
    }
    });
    geojsonGruppe.addLayer(geojsonObjekt);
    karte.fitBounds(geojsonGruppe.getBounds());
};
// einträge im pull down menü werden alphabetisch geordnet!
wienDatensaetze.sort(function(a,b){
    if (a.titel < b.titel){
        return -1;
    } else if (a.titel > b.titel){
        return 1;
    } else {
        return 0;
    }
})
// den GeoJSON Layer für Grillplätze laden
ladeGeojsonLayer(wienDatensaetze [3]);

let layerAuswahl = document.getElementById("layerAuswahl")
for (let i=0; i<wienDatensaetze.length; i++) {
    layerAuswahl.innerHTML += `<option value="${i}">${wienDatensaetze[i].titel}</option>`  
    // += hängt mir Sepp immer nach dem was in der html datei ist an!
    console.log(i, wienDatensaetze[i].titel)
}

layerAuswahl.onchange = function (evt) {
    geojsonGruppe.clearLayers();
    let i = evt.target.value;
    console.log(i, wienDatensaetze[i])
    // damit die Layer übereinander nicht addiert werden, sondern immer nur einer!
    ladeGeojsonLayer(wienDatensaetze[i]);
}
// console.log(wienDatensaetze)
