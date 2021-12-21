mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: ganisrael.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(ganisrael.geometry.coordinates)
    .setPopUp(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h3>${ganisrael.title}</h3><p>${ganisrael.location}</p>`
        )
    )
    .addTo(map)