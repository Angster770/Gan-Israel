mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: ganisrael.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

new mapboxgl.Marker()
    .setLngLat(ganisrael.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h3>${ganisrael.title}</h3><p>${ganisrael.location}</p>`
        )
    )
    .addTo(map)