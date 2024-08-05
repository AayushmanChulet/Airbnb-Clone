mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});
console.log(listing.geometry.coordinates);
const marker = new mapboxgl.Marker({ color: "red",})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<h5>${listing.location}</h5><p>Exact loaction will be provided after booking.</p>`))
        .addTo(map);
        