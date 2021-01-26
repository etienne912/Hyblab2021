import { abrisVeloDisplayData } from "./abrisVelo.js";

async function bootstrap() {

    mapboxgl.accessToken = 'pk.eyJ1IjoiZGpvdmFubmlmb3VpbiIsImEiOiJja2szdGpvMHQxZW1sMm9vNWp0eHJ6ZXR1In0.KJzAGbwYjUS20dFd37YZgw';
    const map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/djovannifouin/ckk45pdua52v317qwdq0ijclv', // style URL
        center: [-1.5512347469335737, 47.21611304880233], // starting position [lng, lat]
        zoom: 11 // starting zoom
    });

    // Départ et arrivée: https://github.com/mapbox/mapbox-gl-directions/blob/master/API.md
    let control = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/cycling',
        language: 'fr',
        alternatives: true,
        placeholderOrigin: 'Départ',
        placeholderDestination: 'Arrivée',
        controls: {
            profileSwitcher: false,
            instructions: false
        }
    });

    document.getElementById('mapbox-controllers').appendChild(control.onAdd(map))

    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        })
    )
    // add abris velo to the map
    abrisVeloDisplayData(mapboxgl, map);
}

bootstrap();

import('./modules/stationsVelos.mjs')
    .then((module) => {
        module.getAbrisVelos();
    });

document.getElementById("input-meteo").onclick = () => {
    document.location.href = "question.html?page=météo";
};

document.getElementById("input-pollution").onclick = () => {
    document.location.href = "question.html?page=pollution";
};

document.getElementById("input-activite").onclick = () => {
    document.location.href = "question.html?page=activité";
};

document.getElementById("input-vae").onclick = () => {
    document.location.href = "question.html?page=VAE";
};