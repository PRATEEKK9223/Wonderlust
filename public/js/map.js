
mapboxgl.accessToken = 'pk.eyJ1IjoicHJhdGVla2stOTIyMyIsImEiOiJjbWgwNmpnY3QwYjdwMmtxeXM1ZmsydTByIn0.KGmLQoR9qoF6ZlxE55h8Og';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates , // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });


// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({ color: 'orange'})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ closeOnClick: false })
        .setHTML(`<h6>${listing.title}</h6><p>${listing.location}</p><p>Exact location provided after booking.</p>`))
        .addTo(map);



