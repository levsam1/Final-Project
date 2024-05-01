// Define default latitude, longitude, and zoom level for Charleston, SC
var defaultLat = 32.7834; // Default latitude for map N
var defaultLng = -79.9370; // Default longitude for map W
var defaultZoom = 13; // Default zoom level for map

// Initialize the Leaflet map on the 'map' div
var map = L.map('map').setView([defaultLat, defaultLng], defaultZoom);

// Add a tile layer to the map using OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize arrays to store markers and polylines (lines between markers)
var markers = [];
var lines = [];
var totalDistance = 0; // Variable to keep track of total distance between markers
var unit = 'km'; // Default distance unit

// Function to calculate the distance between two points in kilometers
function calculateDistance(point1, point2) {
    return point1.distanceTo(point2) / 1000; // Returns distance in kilometers
}

// Updates marker popups and total distance text based on the current unit (km or miles)
function updateMarkersAndTotalDistance() {
    markers.forEach(function(marker, index) {
        // Update each marker's popup with the distance from the previous marker
        if (index > 0) {
            var prevMarker = markers[index - 1];
            var distance = calculateDistance(prevMarker.getLatLng(), marker.getLatLng());
            var popupContent = unit === 'km' ? distance.toFixed(2) + " km" : (distance * 0.621371).toFixed(2) + " miles";
            marker.getPopup().setContent(popupContent);
        }
    });
    updateTotalDistance(); // Update the displayed total distance
}

// Function to update the displayed total distance with the current unit
function updateTotalDistance() {
    var distanceText = unit === 'km' ? totalDistance.toFixed(2) + " km" : (totalDistance * 0.621371).toFixed(2) + " miles";
    document.getElementById("total-distance").innerText = "Total Distance: " + distanceText;
}

// Event handler to toggle between kilometers and miles
document.getElementById("toggle-unit").addEventListener("click", function() {
    unit = unit === 'km' ? 'miles' : 'km';
    updateMarkersAndTotalDistance(); // Update distances after unit change
    document.getElementById("toggle-unit").innerText = "Toggle Unit (" + unit + ")";
});

// Add marker on map click and draw line between the new marker and the previous one
function onMapClick(e) {
    var marker = L.marker(e.latlng, {title: "Marker"}).addTo(map).bindPopup("Marker");
    markers.push(marker);

    // If there are at least two markers, calculate the distance between the last two markers
    if (markers.length >= 2) {
        var prevMarker = markers[markers.length - 2];
        var distance = calculateDistance(prevMarker.getLatLng(), marker.getLatLng());
        totalDistance += distance; // Add to the total distance

        // Draw a line between the two markers and add it to the map
        var line = L.polyline([prevMarker.getLatLng(), marker.getLatLng()], {color: 'red'}).addTo(map);
        lines.push(line); // Store the line for later use
        line.bindPopup(distance.toFixed(2) + " " + unit); // Show distance on line click
    }

    updateMarkersAndTotalDistance(); // Update distances with the new marker added
}

// Resets the map to the default view, removes all markers and lines, and resets the total distance
document.getElementById("reset-map").addEventListener("click", function() {
    map.setView([defaultLat, defaultLng], defaultZoom); // Reset map view
    markers.forEach(function(marker) { map.removeLayer(marker); }); // Remove all markers
    markers = []; // Clear the markers array
    totalDistance = 0; // Reset total distance

    lines.forEach(function(line) { map.removeLayer(line); }); // Remove all lines
    lines = []; // Clear the lines array

    updateMarkersAndTotalDistance(); // Update distances after reset
});

// Removes the last marker added to the map and updates distances accordingly
document.getElementById("remove-last-marker").addEventListener("click", function() {
    if (markers.length > 0) {
        var lastMarker = markers.pop(); // Remove the last marker
        map.removeLayer(lastMarker); // Remove the marker from the map

        if (lines.length > 0) {
            var lastLine = lines.pop(); // Remove the last line
            map.removeLayer(lastLine); // Remove the line from the map
            // Subtract the distance of the removed line from total distance
            totalDistance -= calculateDistance(markers[markers.length - 1].getLatLng(), lastMarker.getLatLng());
        }

        updateMarkersAndTotalDistance(); // Update distances after removing a marker
    }
});

map.on('click', onMapClick); // Register click event on the map to add markers





