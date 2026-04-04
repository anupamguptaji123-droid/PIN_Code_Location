document.getElementById('pincode-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const pincode = document.getElementById('pincode').value.trim();
    if (pincode.length === 6 && /^\d{6}$/.test(pincode)) {
        fetchLocation(pincode);
    } else {
        displayError('Please enter a valid 6-digit PIN code.');
    }
});

function fetchLocation(pincode) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div>Loading...</div>';
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pincode + ', India')}&limit=1`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const place = data[0];
                const address = place.display_name;
                const lat = parseFloat(place.lat);
                const lon = parseFloat(place.lon);
                displayResults(address, lat, lon);
            } else {
                displayError('Location not found for this PIN code.');
            }
        })
        .catch(error => {
            console.error('Error fetching location:', error);
            displayError('Error fetching location. Please try again.');
        });
}

function displayResults(address, lat, lon) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div id="address">' + address + '</div>';
    // Initialize map in the existing #map div
    const map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([lat, lon]).addTo(map);
}

function displayError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div style="color: red;">' + message + '</div>';
}