const DEFAULT_POSITION = [-0.21905488442129317, -78.51296688026623];

const map = L.map('map').setView(DEFAULT_POSITION, 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let markers = [];

async function fetchPlaces(query) {
    const [latitude, longitude] = DEFAULT_POSITION;
    const radius = 3000;
    const limit = 50;
    const oauthToken = 'RH0KL1MRW0FWSYY3SOB4XXXXXXXXXXXXX '; // (CAMBIAR POR SU TOKEN, CREARLO EN:https://es.foursquare.com/developers/home)

    const url = `https://api.foursquare.com/v2/venues/search?v=20231010&query=${query}&ll=${latitude},${longitude}&radius=${radius}&limit=${limit}&oauth_token=${oauthToken}`;

    try {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        };

        const response = await fetch(url, options);
        const data = await response.json();
        const places = data.response.venues;

        clearMarkers();

        places.forEach(place => {
            const { lat, lng } = place.location;
            const marker = L.marker([lat, lng])
                .addTo(map)
                .bindPopup(`<strong>${place.name}</strong><br />${place.location.address ? place.location.address + ' y ' + place.location.crossStreet : 'No address available'}`);
            markers.push(marker);
        });
    } catch (error) {
        console.error('Error fetching places:', error);
    }
}

function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}

document.getElementById('museumsButton').addEventListener('click', () => {
    fetchPlaces('Museo');
});

document.getElementById('restaurantsButton').addEventListener('click', () => {
    fetchPlaces('Restaurante');
});

fetchPlaces(['Museo', 'Restaurante']); // Por defecto muestra restaurantes y museos al cargar la página
