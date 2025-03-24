// Initialize the map centered on Maharashtra, India
const map = L.map('map').setView([19.7515, 75.7139], 7);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Variables to store user location and routing control
let userMarker = null;
let userLocation = null;
let routingControl = null;
let hospitals = [];
let emergencyMarker = null;

// DOM elements
const statusBar = document.getElementById('status-bar');
const statusMessage = document.getElementById('status-message');
const emergencyBtn = document.getElementById('emergency-btn');
const findHospitalBtn = document.getElementById('find-hospital-btn');
const distressBtn = document.getElementById('distress-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const helpBtn = document.getElementById('help-btn');
const userGuideModal = document.getElementById('user-guide-modal');
const closeModal = document.getElementById('close-modal');
const hospitalListContainer = document.getElementById('hospital-list-container');
const hospitalList = document.getElementById('hospital-list');
const closeHospitalList = document.getElementById('close-hospital-list');

// Sample hospital data for Maharashtra
const maharashtraHospitals = [
    { name: "JJ Hospital", lat: 18.9633, lng: 72.8317, phone: "+91-22-23735555", type: "Government" },
    { name: "Lilavati Hospital", lat: 19.0509, lng: 72.8294, phone: "+91-22-26751000", type: "Private" },
    { name: "Tata Memorial Hospital", lat: 19.0056, lng: 72.8427, phone: "+91-22-24177000", type: "Specialty" },
    { name: "KEM Hospital", lat: 19.0011, lng: 72.8414, phone: "+91-22-24107000", type: "Government" },
    { name: "Bombay Hospital", lat: 18.9432, lng: 72.8305, phone: "+91-22-22067676", type: "Private" },
    { name: "Fortis Hospital Mulund", lat: 19.1667, lng: 72.9577, phone: "+91-22-67994444", type: "Private" },
    { name: "Wockhardt Hospital", lat: 19.0176, lng: 72.8561, phone: "+91-22-61784444", type: "Private" },
    { name: "Nanavati Hospital", lat: 19.0998, lng: 72.8440, phone: "+91-22-26267500", type: "Private" },
    { name: "Hinduja Hospital", lat: 19.0507, lng: 72.8397, phone: "+91-22-24451515", type: "Private" },
    { name: "Jaslok Hospital", lat: 18.9730, lng: 72.8099, phone: "+91-22-66573333", type: "Private" },
    { name: "Sion Hospital", lat: 19.0390, lng: 72.8619, phone: "+91-22-24076381", type: "Government" },
    { name: "Cooper Hospital", lat: 19.1079, lng: 72.8397, phone: "+91-22-26207254", type: "Government" },
    { name: "Breach Candy Hospital", lat: 18.9683, lng: 72.8051, phone: "+91-22-23667888", type: "Private" },
    { name: "Holy Family Hospital", lat: 19.0544, lng: 72.8294, phone: "+91-22-26413564", type: "Private" },
    { name: "Hiranandani Hospital", lat: 19.1307, lng: 72.9160, phone: "+91-22-25763300", type: "Private" },
    { name: "Kokilaben Hospital", lat: 19.1307, lng: 72.8266, phone: "+91-22-30999999", type: "Private" },
    { name: "Saifee Hospital", lat: 18.9639, lng: 72.8101, phone: "+91-22-67570111", type: "Private" },
    { name: "Bhatia Hospital", lat: 18.9603, lng: 72.8113, phone: "+91-22-67578888", type: "Private" },
    { name: "Raheja Hospital", lat: 19.0650, lng: 72.8359, phone: "+91-22-66529999", type: "Private" },
    { name: "Masina Hospital", lat: 18.9739, lng: 72.8385, phone: "+91-22-23772888", type: "Private" },
    { name: "Seven Hills Hospital", lat: 19.1178, lng: 72.8631, phone: "+91-22-67676767", type: "Private" },
    { name: "Criticare Hospital", lat: 19.0728, lng: 72.8395, phone: "+91-22-66754000", type: "Private" },
    { name: "Global Hospital", lat: 19.0176, lng: 72.8561, phone: "+91-22-67670305", type: "Private" },
    { name: "Ruby Hall Clinic Pune", lat: 18.5308, lng: 73.8775, phone: "+91-20-66455000", type: "Private" },
    { name: "Jehangir Hospital Pune", lat: 18.5236, lng: 73.8478, phone: "+91-20-66819999", type: "Private" },
    { name: "Sassoon Hospital Pune", lat: 18.5270, lng: 73.8714, phone: "+91-20-26128000", type: "Government" },
    { name: "Aditya Birla Hospital Pune", lat: 18.6245, lng: 73.7599, phone: "+91-20-30717000", type: "Private" },
    { name: "Sahyadri Hospital Pune", lat: 18.5158, lng: 73.8308, phone: "+91-20-67213000", type: "Private" },
    { name: "Deenanath Mangeshkar Hospital Pune", lat: 18.5236, lng: 73.8478, phone: "+91-20-49153000", type: "Private" },
    { name: "Government Medical College Nagpur", lat: 21.1498, lng: 79.0882, phone: "+91-712-2701642", type: "Government" },
    { name: "Alexis Hospital Nagpur", lat: 21.1232, lng: 79.0739, phone: "+91-712-6637000", type: "Private" },
    { name: "Orange City Hospital Nagpur", lat: 21.1232, lng: 79.0739, phone: "+91-712-2747000", type: "Private" },
    { name: "AIIMS Nagpur", lat: 21.1232, lng: 79.0739, phone: "+91-712-2224741", type: "Government" },
    { name: "Civil Hospital Nashik", lat: 19.9909, lng: 73.7876, phone: "+91-253-2572038", type: "Government" },
    { name: "Wockhardt Hospital Nashik", lat: 19.9909, lng: 73.7876, phone: "+91-253-6624444", type: "Private" },
    { name: "Apollo Hospital Nashik", lat: 19.9909, lng: 73.7876, phone: "+91-253-2303403", type: "Private" },
    { name: "Government Medical College Aurangabad", lat: 19.8762, lng: 75.3433, phone: "+91-240-2402412", type: "Government" },
    { name: "MGM Hospital Aurangabad", lat: 19.8762, lng: 75.3433, phone: "+91-240-6601100", type: "Private" },
    { name: "CIIMS Hospital Aurangabad", lat: 19.8762, lng: 75.3433, phone: "+91-240-2482682", type: "Private" },
    { name: "Civil Hospital Solapur", lat: 17.6599, lng: 75.9064, phone: "+91-217-2319309", type: "Government" },
    { name: "Ashwini Hospital Solapur", lat: 17.6599, lng: 75.9064, phone: "+91-217-2323001", type: "Private" }
];

// Initialize the map with hospital markers
function initializeMap() {
    // Add hospital markers to the map
    hospitals = maharashtraHospitals.map(hospital => {
        const marker = L.marker([hospital.lat, hospital.lng], {
            icon: L.divIcon({
                className: 'hospital-marker',
                html: '<i class="fas fa-hospital"></i>',
                iconSize: [40, 40]
            })
        }).addTo(map);
        
        marker.bindPopup(`
            <div class="popup-content">
                <h3>${hospital.name}</h3>
                <p><i class="fas fa-tag"></i> ${hospital.type}</p>
                <p><i class="fas fa-phone"></i> ${hospital.phone}</p>
                <div class="popup-actions">
                    <button class="popup-btn directions-btn" onclick="getDirections(${hospital.lat}, ${hospital.lng})">
                        <i class="fas fa-directions"></i> Directions
                    </button>
                    <a href="tel:${hospital.phone}" class="popup-btn call-btn">
                        <i class="fas fa-phone-alt"></i> Call
                    </a>
                </div>
            </div>
        `);
        
        return {
            ...hospital,
            marker: marker
        };
    });
    
    // Get user's location
    getUserLocation();
}

// Get user's current location
function getUserLocation() {
    updateStatus('Locating you...', 'info');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Add user marker
                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                
                userMarker = L.marker([userLocation.lat, userLocation.lng], {
                    icon: L.divIcon({
                        className: 'user-marker',
                        html: '<i class="fas fa-user"></i>',
                        iconSize: [40, 40]
                    })
                }).addTo(map);
                
                userMarker.bindPopup('<b>Your Location</b>').openPopup();
                
                // Center map on user location
                map.setView([userLocation.lat, userLocation.lng], 13);
                
                updateStatus('Location found!', 'success', 3000);
            },
            error => {
                console.error('Error getting location:', error);
                updateStatus('Could not get your location. Please enable location services.', 'error');
                
                // Default to Maharashtra center if location not available
                map.setView([19.7515, 75.7139], 7);
            }
        );
    } else {
        updateStatus('Geolocation is not supported by your browser.', 'error');
    }
}

// Update status bar message
function updateStatus(message, type, timeout = 0) {
    statusBar.className = 'status-bar';
    statusBar.classList.add(type);
    statusMessage.textContent = message;
    
    if (timeout > 0) {
        setTimeout(() => {
            statusBar.className = 'status-bar';
            statusMessage.textContent = 'Ready to assist you in emergencies. Click "Find Hospitals" to locate nearby medical facilities.';
        }, timeout);
    }
}

// Handle emergency button click
function handleEmergency() {
    if (!userLocation) {
        updateStatus('Please allow location access first', 'error');
        getUserLocation();
        return;
    }
    
    updateStatus('Emergency mode activated! Finding nearest hospital...', 'emergency');
    
    // Add emergency marker with pulsing effect
    if (emergencyMarker) {
        map.removeLayer(emergencyMarker);
    }
    
    emergencyMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
            className: 'pulsing-marker',
            iconSize: [28, 28]
        })
    }).addTo(map);
    
    // Find nearest hospital
    const nearestHospital = findNearestHospital(userLocation);
    
    // Create route to nearest hospital
    createRoute(userLocation, nearestHospital);
    
    // Show notification
    if (Notification.permission === 'granted') {
        new Notification('Emergency Mode Activated', {
            body: `Routing to nearest hospital: ${nearestHospital.name}`,
            icon: 'img/logo.png'
        });
    }
    
    // Simulate emergency call
    simulateEmergencyCall(nearestHospital);
}

// Find nearest hospital to given location
function findNearestHospital(location) {
    let nearestHospital = null;
    let shortestDistance = Infinity;
    
    hospitals.forEach(hospital => {
        const distance = calculateDistance(
            location.lat, location.lng,
            hospital.lat, hospital.lng
        );
        
        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestHospital = hospital;
        }
    });
    
    return nearestHospital;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

// Create route between two points - FIXED VERSION
function createRoute(start, end) {
    // Remove existing route if any
    if (routingControl) {
        map.removeControl(routingControl);
    }
    
    // Make sure we have valid coordinates for start and end points
    const startPoint = L.latLng(start.lat, start.lng);
    const endPoint = L.latLng(end.lat, end.lng);
    
    try {
        // Create new route with error handling
        routingControl = L.Routing.control({
            waypoints: [
                startPoint,
                endPoint
            ],
            routeWhileDragging: false,
            showAlternatives: true,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [
                    {color: 'black', opacity: 0.15, weight: 9},
                    {color: 'white', opacity: 0.8, weight: 6},
                    {color: 'red', opacity: 0.8, weight: 3}
                ]
            },
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
                profile: 'driving'
            }),
            createMarker: function(i, waypoint, n) {
                // Don't create markers for start/end points as we already have custom markers
                return null;
            }
        }).addTo(map);
        
        // Update status when route is found
        routingControl.on('routesfound', function(e) {
            const routes = e.routes;
            const summary = routes[0].summary;
            updateStatus(`Distance: ${(summary.totalDistance / 1000).toFixed(2)} km, ETA: ${Math.round(summary.totalTime / 60)} minutes`, 'info');
            
            // Fit map to show the entire route plus markers
            const bounds = L.latLngBounds([startPoint, endPoint]);
            map.fitBounds(bounds, { padding: [50, 50] });
        });
        
        // Handle routing errors
        routingControl.on('routingerror', function(e) {
            console.error("Routing error:", e.error);
            updateStatus("Unable to calculate route. Please try again.", 'error');
        });
    } catch (error) {
        console.error("Error creating route:", error);
        updateStatus("Error creating route. Please try again.", 'error');
    }
}

// Get directions to a specific location - FIXED VERSION
function getDirections(lat, lng) {
    if (!userLocation) {
        updateStatus('Please allow location access first', 'error');
        getUserLocation();
        return;
    }
    
    // Update status
    updateStatus('Calculating route...', 'info');
    
    try {
        // Create route with proper parameters
        createRoute(
            userLocation, 
            { lat: lat, lng: lng }
        );
        
        // Close hospital list if open
        hospitalListContainer.style.display = 'none';
    } catch (error) {
        console.error("Error in getDirections:", error);
        updateStatus("Unable to get directions. Please try again.", 'error');
    }
}

// Simulate emergency call
function simulateEmergencyCall(hospital) {
    const callDialog = document.createElement('div');
    callDialog.className = 'call-dialog';
    callDialog.innerHTML = `
        <div class="call-dialog-content">
            <div class="call-header">
                <i class="fas fa-phone-alt fa-shake"></i>
                <h3>Emergency Call</h3>
            </div>
            <p>Calling ${hospital.name}...</p>
            <p>${hospital.phone}</p>
            <div class="call-actions">
                <button class="call-btn-end" id="end-call-btn">
                    <i class="fas fa-phone-slash"></i> End Call
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(callDialog);
    
    // Remove dialog when call is ended
    document.getElementById('end-call-btn').addEventListener('click', function() {
        document.body.removeChild(callDialog);
    });
}

// Handle find hospital button click
function handleFindHospital() {
    if (!userLocation) {
        updateStatus('Please allow location access first', 'error');
        getUserLocation();
        return;
    }
    
    updateStatus('Finding hospitals near you...', 'info');
    
    // Sort hospitals by distance from user
    const sortedHospitals = hospitals.map(hospital => {
        const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            hospital.lat, hospital.lng
        );
        
        return {
            ...hospital,
            distance: distance
        };
    }).sort((a, b) => a.distance - b.distance);
    
    // Display hospital list
    displayHospitalList(sortedHospitals.slice(0, 10)); // Show top 10 nearest hospitals
}

// Display hospital list
function displayHospitalList(hospitalsList) {
    hospitalList.innerHTML = '';
    
    hospitalsList.forEach(hospital => {
        const listItem = document.createElement('li');
        listItem.className = 'hospital-item';
        
        listItem.innerHTML = `
            <div class="hospital-name">
                <i class="fas fa-hospital"></i>
                ${hospital.name}
            </div>
            <div class="hospital-distance">
                <i class="fas fa-route"></i>
                ${hospital.distance.toFixed(2)} km away
            </div>
            <div class="hospital-actions">
                <button class="hospital-btn directions-btn" data-lat="${hospital.lat}" data-lng="${hospital.lng}">
                    <i class="fas fa-directions"></i> Directions
                </button>
                <a href="tel:${hospital.phone}" class="hospital-btn call-btn">
                    <i class="fas fa-phone-alt"></i> Call
                </a>
            </div>
        `;
        
        hospitalList.appendChild(listItem);
    });
    
    // Add event listeners to direction buttons
    document.querySelectorAll('.directions-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lat = parseFloat(this.getAttribute('data-lat'));
            const lng = parseFloat(this.getAttribute('data-lng'));
            getDirections(lat, lng);
        });
    });
    
    // Show hospital list
    hospitalListContainer.style.display = 'block';
}

// Handle distress signal button click
function handleDistressSignal() {
    if (!userLocation) {
        updateStatus('Please allow location access first', 'error');
        getUserLocation();
        return;
    }
    
    updateStatus('Sending distress signal with your location...', 'warning');
    
    // Add distress marker
    if (emergencyMarker) {
        map.removeLayer(emergencyMarker);
    }
    
    emergencyMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
            className: 'pulsing-marker',
            iconSize: [28, 28]
        })
    }).addTo(map);
    
    // Simulate sending distress signal
    simulateDistressSignal();
}

// Simulate sending distress signal
function simulateDistressSignal() {
    const distressDialog = document.createElement('div');
    distressDialog.className = 'call-dialog';
    distressDialog.innerHTML = `
        <div class="call-dialog-content">
            <div class="call-header warning">
                <i class="fas fa-exclamation-triangle fa-shake"></i>
                <h3>Distress Signal</h3>
            </div>
            <p>Sending your location to emergency services...</p>
            <p class="coordinates">Lat: ${userLocation.lat.toFixed(6)}, Lng: ${userLocation.lng.toFixed(6)}</p>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="call-actions">
                <button class="call-btn-end" id="cancel-distress-btn">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(distressDialog);
    
    // Animate progress bar
    const progressFill = distressDialog.querySelector('.progress-fill');
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            distressDialog.querySelector('.call-header').innerHTML = '<i class="fas fa-check-circle"></i><h3>Signal Sent</h3>';
            distressDialog.querySelector('p').textContent = 'Emergency services have been notified of your location.';
            distressDialog.querySelector('.progress-bar').style.display = 'none';
            distressDialog.querySelector('#cancel-distress-btn').textContent = 'Close';
        } else {
            width += 2;
            progressFill.style.width = width + '%';
        }
    }, 50);
    
    // Remove dialog when canceled
    document.getElementById('cancel-distress-btn').addEventListener('click', function() {
        clearInterval(interval);
        document.body.removeChild(distressDialog);
        
        if (width >= 100) {
            updateStatus('Distress signal sent successfully!', 'success', 3000);
        } else {
            updateStatus('Distress signal canceled.', 'info', 3000);
            // Remove emergency marker if signal was canceled
            if (emergencyMarker) {
                map.removeLayer(emergencyMarker);
                emergencyMarker = null;
            }
        }
    });
}

// Handle search button click - FIXED VERSION
function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        updateStatus('Please enter a search term', 'error', 3000);
        return;
    }
    
    updateStatus('Searching for: ' + searchTerm, 'info');
    
    // Filter hospitals based on search term
    const filteredHospitals = hospitals.filter(hospital => 
        hospital.name.toLowerCase().includes(searchTerm) || 
        hospital.type.toLowerCase().includes(searchTerm)
    );
    
    if (filteredHospitals.length === 0) {
        updateStatus('No hospitals found matching your search', 'error', 3000);
        return;
    }
    
    // If user location is available, sort by distance
    if (userLocation) {
        filteredHospitals.forEach(hospital => {
            hospital.distance = calculateDistance(
                userLocation.lat, userLocation.lng,
                hospital.lat, hospital.lng
            );
        });
        
        filteredHospitals.sort((a, b) => a.distance - b.distance);
    }
    
    // Display hospital list
    displayHospitalList(filteredHospitals);
    
    // Create bounds to fit all filtered hospitals
    if (filteredHospitals.length > 0) {
        const bounds = L.latLngBounds(filteredHospitals.map(h => [h.lat, h.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}
// Make sure these DOM elements are correctly selected
function initializeSearchBar() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (!searchInput || !searchBtn) {
        console.error('Search elements not found in the DOM');
        return;
    }
    
    // Add event listeners
    searchBtn.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
}

// Fix the search functionality
function initializeSearchBar() {
    // Make sure we have the correct references
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (!searchInput || !searchBtn) {
        console.error('Search elements not found in the DOM');
        return;
    }
    
    // Add event listeners
    searchBtn.addEventListener('click', function() {
        handleSearch();
    });
    
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });
}

// Unified search function
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        updateStatus('Please enter a search term', 'error', 3000);
        return;
    }
    
    updateStatus('Searching for: ' + searchTerm, 'info');
    
    console.log('Searching for:', searchTerm); // Debug log
    console.log('Total hospitals:', hospitals.length); // Debug log
    
    // Filter hospitals based on search term
    const filteredHospitals = hospitals.filter(hospital => 
        hospital.name.toLowerCase().includes(searchTerm) || 
        hospital.type.toLowerCase().includes(searchTerm)
    );
    
    console.log('Filtered hospitals:', filteredHospitals.length); // Debug log
    
    if (filteredHospitals.length === 0) {
        updateStatus('No hospitals found matching your search', 'error', 3000);
        return;
    }
    
    // If user location is available, sort by distance
    if (userLocation) {
        const hospitalsWithDistance = filteredHospitals.map(hospital => {
            return {
                ...hospital,
                distance: calculateDistance(
                    userLocation.lat, userLocation.lng,
                    hospital.lat, hospital.lng
                )
            };
        });
        
        hospitalsWithDistance.sort((a, b) => a.distance - b.distance);
        displayHospitalList(hospitalsWithDistance);
    } else {
        displayHospitalList(filteredHospitals);
    }
    
    // Create bounds to fit all filtered hospitals
    if (filteredHospitals.length > 0) {
        const bounds = L.latLngBounds(filteredHospitals.map(h => [h.lat, h.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

// Show user guide modal - FIXED VERSION
function showUserGuide() {
    const userGuideModal = document.getElementById('user-guide-modal');
    if (userGuideModal) {
        userGuideModal.style.display = 'block';
    }
}

// Close user guide modal - FIXED VERSION
function closeUserGuide() {
    const userGuideModal = document.getElementById('user-guide-modal');
    if (userGuideModal) {
        userGuideModal.style.display = 'none';
    }
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission();
    }
}

// Update the event listeners section in your DOMContentLoaded function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    initializeMap();
    
    // Initialize search bar with proper event listeners
    initializeSearchBar();
    
    // Button event listeners
    const emergencyBtn = document.getElementById('emergency-btn');
    const findHospitalBtn = document.getElementById('find-hospital-btn');
    const distressBtn = document.getElementById('distress-btn');
    const helpBtn = document.getElementById('help-btn');
    const closeModal = document.getElementById('close-modal');
    const closeHospitalList = document.getElementById('close-hospital-list');
    
    if (emergencyBtn) emergencyBtn.addEventListener('click', handleEmergency);
    if (findHospitalBtn) findHospitalBtn.addEventListener('click', handleFindHospital);
    if (distressBtn) distressBtn.addEventListener('click', handleDistressSignal);
    if (helpBtn) helpBtn.addEventListener('click', showUserGuide);
    
    // Make sure closeModal exists before adding listener
    if (closeModal) {
        closeModal.addEventListener('click', closeUserGuide);
    }
    
    // Make sure closeHospitalList exists before adding listener
    if (closeHospitalList) {
        closeHospitalList.addEventListener('click', function() {
            const hospitalListContainer = document.getElementById('hospital-list-container');
            if (hospitalListContainer) {
                hospitalListContainer.style.display = 'none';
            }
        });
    }
    
    // Request notification permission
    requestNotificationPermission();
    
    // Show user guide on first visit
    if (!localStorage.getItem('userGuideShown')) {
        showUserGuide();
        localStorage.setItem('userGuideShown', 'true');
    }
});
// Update the displayHospitalList function to handle distance properly
function displayHospitalList(hospitalsList) {
    const hospitalList = document.getElementById('hospital-list');
    const hospitalListContainer = document.getElementById('hospital-list-container');
    
    if (!hospitalList || !hospitalListContainer) {
        console.error('Hospital list elements not found');
        return;
    }
    
    hospitalList.innerHTML = '';
    
    hospitalsList.forEach(hospital => {
        const listItem = document.createElement('li');
        listItem.className = 'hospital-item';
        
        // Format distance if available
        const distanceText = hospital.distance !== undefined ? 
            `<div class="hospital-distance">
                <i class="fas fa-route"></i>
                ${hospital.distance.toFixed(2)} km away
            </div>` : '';
        
        listItem.innerHTML = `
            <div class="hospital-name">
                <i class="fas fa-hospital"></i>
                ${hospital.name}
            </div>
            ${distanceText}
            <div class="hospital-actions">
                <button class="hospital-btn directions-btn" data-lat="${hospital.lat}" data-lng="${hospital.lng}">
                    <i class="fas fa-directions"></i> Directions
                </button>
                <a href="tel:${hospital.phone}" class="hospital-btn call-btn">
                    <i class="fas fa-phone-alt"></i> Call
                </a>
            </div>
        `;
        
        hospitalList.appendChild(listItem);
    });
    
    // Add event listeners to direction buttons
    document.querySelectorAll('.directions-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lat = parseFloat(this.getAttribute('data-lat'));
            const lng = parseFloat(this.getAttribute('data-lng'));
            getDirections(lat, lng);
        });
    });
    
    // Show hospital list
    hospitalListContainer.style.display = 'block';
}



// Refresh user location periodically
setInterval(getUserLocation, 60000); // Update location every minute
// DIRECT FIX FOR SEARCH FUNCTIONALITY
// Add this code at the end of your JavaScript file

// Immediately execute this function to fix the search
(function fixSearchBar() {
    console.log("Applying search bar fix...");
    
    // Get the search elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    // Check if elements exist
    if (!searchInput || !searchBtn) {
        console.error("Search elements not found!");
        return;
    }
    
    console.log("Search elements found, attaching event listeners...");
    
    // Remove any existing event listeners (to avoid duplicates)
    searchBtn.replaceWith(searchBtn.cloneNode(true));
    const newSearchBtn = document.getElementById('search-btn');
    
    // Add new event listeners
    newSearchBtn.addEventListener('click', function() {
        console.log("Search button clicked");
        executeSearch();
    });
    
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            console.log("Enter key pressed in search input");
            executeSearch();
        }
    });
    
    // The actual search function
    function executeSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        console.log("Executing search for:", searchTerm);
        
        if (!searchTerm) {
            alert("Please enter a search term");
            return;
        }
        
        // Filter hospitals based on search term
        const filteredHospitals = maharashtraHospitals.filter(hospital => 
            hospital.name.toLowerCase().includes(searchTerm) || 
            hospital.type.toLowerCase().includes(searchTerm)
        );
        
        console.log("Found", filteredHospitals.length, "matching hospitals");
        
        if (filteredHospitals.length === 0) {
            alert("No hospitals found matching your search");
            return;
        }
        
        // Calculate distances if user location is available
        let hospitalsToDisplay = filteredHospitals;
        
        if (userLocation) {
            hospitalsToDisplay = filteredHospitals.map(hospital => {
                const distance = calculateDistance(
                    userLocation.lat, userLocation.lng,
                    hospital.lat, hospital.lng
                );
                
                return {
                    ...hospital,
                    distance: distance
                };
            }).sort((a, b) => a.distance - b.distance);
        }
        
        // Display the results
        showSearchResults(hospitalsToDisplay);
        
        // Fit map to show all results
        const bounds = L.latLngBounds(filteredHospitals.map(h => [h.lat, h.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
    }
    
    // Function to display search results
    function showSearchResults(hospitals) {
        const hospitalList = document.getElementById('hospital-list');
        const hospitalListContainer = document.getElementById('hospital-list-container');
        
        if (!hospitalList || !hospitalListContainer) {
            console.error("Hospital list elements not found");
            return;
        }
        
        hospitalList.innerHTML = '';
        
        hospitals.forEach(hospital => {
            const listItem = document.createElement('li');
            listItem.className = 'hospital-item';
            
            // Format distance if available
            const distanceText = hospital.distance !== undefined ? 
                `<div class="hospital-distance">
                    <i class="fas fa-route"></i>
                    ${hospital.distance.toFixed(2)} km away
                </div>` : '';
            
            listItem.innerHTML = `
                <div class="hospital-name">
                    <i class="fas fa-hospital"></i>
                    ${hospital.name}
                </div>
                ${distanceText}
                <div class="hospital-actions">
                    <button class="hospital-btn directions-btn" data-lat="${hospital.lat}" data-lng="${hospital.lng}">
                        <i class="fas fa-directions"></i> Directions
                    </button>
                    <a href="tel:${hospital.phone}" class="hospital-btn call-btn">
                        <i class="fas fa-phone-alt"></i> Call
                    </a>
                </div>
            `;
            
            hospitalList.appendChild(listItem);
        });
        
        // Add event listeners to direction buttons
        document.querySelectorAll('.directions-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const lat = parseFloat(this.getAttribute('data-lat'));
                const lng = parseFloat(this.getAttribute('data-lng'));
                
                // Call the existing getDirections function
                if (typeof getDirections === 'function') {
                    getDirections(lat, lng);
                } else {
                    console.error("getDirections function not found");
                    alert("Unable to get directions. Please try again.");
                }
            });
        });
        
        // Show hospital list
        hospitalListContainer.style.display = 'block';
    }
    
    console.log("Search bar fix applied successfully");
})();
// ENHANCED SEARCH FUNCTIONALITY - GOOGLE MAPS STYLE
// Add this code at the end of your JavaScript file

(function enhanceSearchFunctionality() {
    console.log("Enhancing search functionality...");
    
    // Get the search elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    // Check if elements exist
    if (!searchInput || !searchBtn) {
        console.error("Search elements not found!");
        return;
    }
    
    // Create a container for search results
    let searchResultsContainer = document.getElementById('search-results-container');
    if (!searchResultsContainer) {
        searchResultsContainer = document.createElement('div');
        searchResultsContainer.id = 'search-results-container';
        searchResultsContainer.className = 'search-results-container';
        searchResultsContainer.style.display = 'none';
        document.body.appendChild(searchResultsContainer);
        
        // Add CSS for the search results container
        const style = document.createElement('style');
        style.textContent = `
            .search-results-container {
                position: absolute;
                top: 60px;
                left: 10px;
                width: 300px;
                max-height: 400px;
                overflow-y: auto;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 1000;
            }
            .search-results-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .search-result-item {
                padding: 10px 15px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
            }
            .search-result-item:hover {
                background-color: #f5f5f5;
            }
            .search-result-item .name {
                font-weight: bold;
                margin-bottom: 3px;
            }
            .search-result-item .address {
                font-size: 0.85em;
                color: #666;
            }
            .search-results-header {
                padding: 10px 15px;
                background: #f0f0f0;
                font-weight: bold;
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .search-results-header .close-btn {
                cursor: pointer;
                font-size: 1.2em;
            }
            .search-category {
                padding: 8px 15px;
                background: #f8f8f8;
                font-weight: bold;
                color: #555;
                border-bottom: 1px solid #ddd;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove any existing event listeners (to avoid duplicates)
    searchBtn.replaceWith(searchBtn.cloneNode(true));
    const newSearchBtn = document.getElementById('search-btn');
    
    // Add new event listeners
    newSearchBtn.addEventListener('click', function() {
        console.log("Search button clicked");
        executeSearch();
    });
    
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            console.log("Enter key pressed in search input");
            executeSearch();
        }
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchResultsContainer.contains(event.target) && 
            event.target !== searchInput && 
            event.target !== newSearchBtn) {
            searchResultsContainer.style.display = 'none';
        }
    });
    
    // The main search function
    function executeSearch() {
        const searchTerm = searchInput.value.trim();
        console.log("Executing search for:", searchTerm);
        
        if (!searchTerm) {
            alert("Please enter a search term");
            return;
        }
        
        // Show loading indicator
        updateStatus('Searching...', 'info');
        
        // Search in multiple sources
        Promise.all([
            searchHospitals(searchTerm),
            searchPlaces(searchTerm)
        ]).then(([hospitalResults, placeResults]) => {
            displaySearchResults(hospitalResults, placeResults);
            updateStatus('Search complete', 'success', 2000);
        }).catch(error => {
            console.error("Search error:", error);
            updateStatus('Search failed. Please try again.', 'error', 3000);
        });
    }
    
    // Search hospitals from your existing data
    function searchHospitals(searchTerm) {
        return new Promise((resolve) => {
            const term = searchTerm.toLowerCase();
            
            // Filter hospitals based on search term
            const filteredHospitals = maharashtraHospitals.filter(hospital => 
                hospital.name.toLowerCase().includes(term) || 
                hospital.type.toLowerCase().includes(term)
            );
            
            console.log("Found", filteredHospitals.length, "matching hospitals");
            
            // Calculate distances if user location is available
            let hospitalsToDisplay = filteredHospitals;
            
            if (userLocation) {
                hospitalsToDisplay = filteredHospitals.map(hospital => {
                    const distance = calculateDistance(
                        userLocation.lat, userLocation.lng,
                        hospital.lat, hospital.lng
                    );
                    
                    return {
                        ...hospital,
                        distance: distance
                    };
                }).sort((a, b) => a.distance - b.distance);
            }
            
            resolve(hospitalsToDisplay);
        });
    }
    
    // Search places using Nominatim API
    function searchPlaces(searchTerm) {
        return new Promise((resolve, reject) => {
            // Build the Nominatim API URL
            // Limit search to Maharashtra region for better results
            const viewbox = '72.6,22.0,80.9,16.0'; // Approximate bounding box for Maharashtra
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&viewbox=${viewbox}&bounded=1&limit=10`;
            
            fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'MedicalEmergencyApp/1.0' // It's good practice to identify your app
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Found", data.length, "places from Nominatim");
                
                // Transform the data to a consistent format
                const places = data.map(place => ({
                    name: place.display_name.split(',')[0],
                    fullAddress: place.display_name,
                    lat: parseFloat(place.lat),
                    lng: parseFloat(place.lon),
                    type: place.type,
                    category: getCategoryFromPlace(place)
                }));
                
                resolve(places);
            })
            .catch(error => {
                console.error("Error fetching places:", error);
                reject(error);
            });
        });
    }
    
    // Helper function to categorize places
    function getCategoryFromPlace(place) {
        const type = place.type;
        const category = place.category || '';
        
        if (type === 'hospital' || type === 'clinic' || category.includes('health')) {
            return 'Healthcare';
        } else if (type === 'pharmacy' || category.includes('pharmacy')) {
            return 'Pharmacy';
        } else if (type === 'police' || category.includes('police')) {
            return 'Emergency Services';
        } else if (type === 'fire_station' || category.includes('fire')) {
            return 'Emergency Services';
        } else if (type.includes('restaurant') || type.includes('cafe') || category.includes('food')) {
            return 'Food & Dining';
        } else if (type.includes('hotel') || type.includes('lodging')) {
            return 'Accommodation';
        } else if (type.includes('school') || type.includes('college') || type.includes('university')) {
            return 'Education';
        } else if (type.includes('bank') || type.includes('atm')) {
            return 'Financial Services';
        } else if (type.includes('park') || type.includes('garden')) {
            return 'Parks & Recreation';
        } else {
            return 'Other Places';
        }
    }
    
    // Display combined search results
    function displaySearchResults(hospitals, places) {
        // Create categories for organization
        const categories = {
            'Hospitals': hospitals,
            'Healthcare': places.filter(p => p.category === 'Healthcare'),
            'Pharmacy': places.filter(p => p.category === 'Pharmacy'),
            'Emergency Services': places.filter(p => p.category === 'Emergency Services'),
            'Food & Dining': places.filter(p => p.category === 'Food & Dining'),
            'Accommodation': places.filter(p => p.category === 'Accommodation'),
            'Education': places.filter(p => p.category === 'Education'),
            'Financial Services': places.filter(p => p.category === 'Financial Services'),
            'Parks & Recreation': places.filter(p => p.category === 'Parks & Recreation'),
            'Other Places': places.filter(p => p.category === 'Other Places')
        };
        
        // Clear previous results
        searchResultsContainer.innerHTML = '';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'search-results-header';
        header.innerHTML = `
            <span>Search Results</span>
            <span class="close-btn">&times;</span>
        `;
        searchResultsContainer.appendChild(header);
        
        // Add close button functionality
        header.querySelector('.close-btn').addEventListener('click', function() {
            searchResultsContainer.style.display = 'none';
        });
        
        // Create results list
        const resultsList = document.createElement('ul');
        resultsList.className = 'search-results-list';
        
        // Add results by category
        let totalResults = 0;
        
        for (const [category, items] of Object.entries(categories)) {
            if (items.length > 0) {
                // Add category header
                const categoryHeader = document.createElement('li');
                categoryHeader.className = 'search-category';
                categoryHeader.textContent = category;
                resultsList.appendChild(categoryHeader);
                
                // Add items in this category
                items.forEach(item => {
                    const resultItem = document.createElement('li');
                    resultItem.className = 'search-result-item';
                    
                    // Format distance if available
                    const distanceText = item.distance !== undefined ? 
                        `(${item.distance.toFixed(2)} km away)` : '';
                    
                    resultItem.innerHTML = `
                        <div class="name">${item.name} ${distanceText}</div>
                        <div class="address">${item.fullAddress || ''}</div>
                    `;
                    
                    // Add click event to show on map
                    resultItem.addEventListener('click', function() {
                        showOnMap(item);
                        searchResultsContainer.style.display = 'none';
                    });
                    
                    resultsList.appendChild(resultItem);
                    totalResults++;
                });
            }
        }
        
        // If no results found
        if (totalResults === 0) {
            const noResults = document.createElement('li');
            noResults.className = 'search-result-item';
            noResults.textContent = 'No results found. Try a different search term.';
            resultsList.appendChild(noResults);
        }
        
        searchResultsContainer.appendChild(resultsList);
        searchResultsContainer.style.display = 'block';
        
        // If we have results, create a bounds object to fit all results on the map
        if (totalResults > 0) {
            const allPoints = [];
            
            // Collect all points from hospitals and places
            hospitals.forEach(h => allPoints.push([h.lat, h.lng]));
            places.forEach(p => allPoints.push([p.lat, p.lng]));
            
            if (allPoints.length > 0) {
                const bounds = L.latLngBounds(allPoints);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }
    
    // Show a place on the map
    function showOnMap(place) {
        // Create a temporary marker
        const tempMarker = L.marker([place.lat, place.lng], {
            icon: L.divIcon({
                className: 'search-result-marker',
                html: '<i class="fas fa-map-marker-alt"></i>',
                iconSize: [40, 40]
            })
        }).addTo(map);
        
        // Create popup content
        let popupContent = `
            <div class="popup-content">
                <h3>${place.name}</h3>
        `;
        
        // Add type/category if available
        if (place.type || place.category) {
            popupContent += `<p><i class="fas fa-tag"></i> ${place.category || place.type}</p>`;
        }
        
        // Add address if available
        if (place.fullAddress) {
            popupContent += `<p><i class="fas fa-map-marker-alt"></i> ${place.fullAddress}</p>`;
        }
        
        // Add phone if available (mostly for hospitals)
        if (place.phone) {
            popupContent += `<p><i class="fas fa-phone"></i> ${place.phone}</p>`;
        }
        
        // Add action buttons
        popupContent += `
                <div class="popup-actions">
                    <button class="popup-btn directions-btn" onclick="getDirections(${place.lat}, ${place.lng})">
                        <i class="fas fa-directions"></i> Directions
                    </button>
        `;
        
        // Add call button if phone is available
        if (place.phone) {
            popupContent += `
                    <a href="tel:${place.phone}" class="popup-btn call-btn">
                        <i class="fas fa-phone-alt"></i> Call
                    </a>
            `;
        }
        
        popupContent += `
                </div>
            </div>
        `;
        
        // Bind and open popup
        tempMarker.bindPopup(popupContent).openPopup();
        
        // Center map on the location
        map.setView([place.lat, place.lng], 15);
        
        // Remove marker when popup is closed
        tempMarker.on('popupclose', function() {
            map.removeLayer(tempMarker);
        });
    }
    
    console.log("Enhanced search functionality applied successfully");
})();
// ENHANCED DISTRESS SIGNAL FUNCTIONALITY
// Add this code at the end of your JavaScript file

(function enhanceDistressSignal() {
    console.log("Enhancing distress signal functionality...");
    
    // Get the distress button
    const distressBtn = document.getElementById('distress-btn');
    
    if (!distressBtn) {
        console.error("Distress button not found!");
        return;
    }
    
    // Add CSS for the enhanced distress signal UI
    const style = document.createElement('style');
    style.textContent = `
        /* Distress Signal UI */
        .distress-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 2000;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .distress-panel {
            width: 90%;
            max-width: 500px;
            background-color: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .distress-header {
            background-color: #e74c3c;
            color: white;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .distress-header h2 {
            margin: 0;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
        }
        
        .distress-header h2 i {
            margin-right: 10px;
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .distress-content {
            padding: 20px;
        }
        
        .distress-location {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #e9ecef;
        }
        
        .distress-location h3 {
            margin-top: 0;
            color: #495057;
            font-size: 1rem;
            margin-bottom: 10px;
        }
        
        .coordinates {
            font-family: monospace;
            color: #495057;
            background-color: #e9ecef;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 0.9rem;
        }
        
        .distress-progress {
            margin: 25px 0;
        }
        
        .progress-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            color: #495057;
            font-weight: 500;
        }
        
        .progress-bar {
            height: 8px;
            background-color: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background-color: #e74c3c;
            width: 0%;
            transition: width 0.3s ease;
        }
        
        .distress-status {
            margin: 20px 0;
            padding: 15px;
            border-radius: 8px;
            background-color: #f8f9fa;
            border-left: 4px solid #e74c3c;
        }
        
        .distress-status.success {
            border-left-color: #2ecc71;
        }
        
        .distress-status h3 {
            margin-top: 0;
            margin-bottom: 5px;
            color: #343a40;
            font-size: 1rem;
        }
        
        .distress-status p {
            margin: 0;
            color: #6c757d;
        }
        
        .distress-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        
        .distress-btn {
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .distress-btn i {
            margin-right: 8px;
        }
        
        .distress-btn.primary {
            background-color: #e74c3c;
            color: white;
            flex: 1;
            margin-right: 10px;
        }
        
        .distress-btn.primary:hover {
            background-color: #c0392b;
        }
        
        .distress-btn.secondary {
            background-color: #f8f9fa;
            color: #495057;
            border: 1px solid #ced4da;
            flex: 1;
        }
        
        .distress-btn.secondary:hover {
            background-color: #e9ecef;
        }
        
        /* Ambulance Marker */
        .ambulance-marker {
            color: #e74c3c;
            font-size: 24px;
            filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.3));
        }
        
        .ambulance-marker i {
            animation: bounce 1s infinite alternate;
        }
        
        @keyframes bounce {
            from { transform: translateY(0); }
            to { transform: translateY(-5px); }
        }
        
        /* Pulsing Distress Marker */
        .distress-marker {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: rgba(231, 76, 60, 0.6);
            position: relative;
        }
        
        .distress-marker:before {
            content: '';
            position: absolute;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: rgba(231, 76, 60, 0.6);
            animation: pulse-ring 2s infinite;
        }
        
        .distress-marker:after {
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #e74c3c;
        }
        
        @keyframes pulse-ring {
            0% {
                transform: scale(0.5);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        /* Ambulance info window */
        .ambulance-info {
            padding: 10px;
            max-width: 250px;
        }
        
        .ambulance-info h3 {
            margin-top: 0;
            margin-bottom: 8px;
            color: #343a40;
        }
        
        .ambulance-info p {
            margin: 5px 0;
            color: #6c757d;
        }
        
        .ambulance-info .eta {
            font-weight: bold;
            color: #e74c3c;
        }
    `;
    document.head.appendChild(style);
    
    // Sample ambulance data
    const ambulances = [
        { id: 'AMB-1001', name: 'City Hospital Ambulance 1', lat: 19.0760, lng: 72.8777, status: 'available', type: 'Advanced Life Support' },
        { id: 'AMB-1002', name: 'City Hospital Ambulance 2', lat: 19.0330, lng: 72.8353, status: 'available', type: 'Basic Life Support' },
        { id: 'AMB-1003', name: 'Medical Center Ambulance', lat: 19.1136, lng: 72.9005, status: 'available', type: 'Advanced Life Support' },
        { id: 'AMB-1004', name: 'Emergency Response Unit 1', lat: 18.9542, lng: 72.8226, status: 'available', type: 'Critical Care' },
        { id: 'AMB-1005', name: 'Emergency Response Unit 2', lat: 19.2183, lng: 72.9781, status: 'available', type: 'Basic Life Support' },
        { id: 'AMB-1006', name: 'Lifeline Ambulance Service', lat: 19.0596, lng: 72.8295, status: 'available', type: 'Advanced Life Support' },
        { id: 'AMB-1007', name: 'Rapid Medical Response', lat: 18.9750, lng: 72.8258, status: 'available', type: 'Basic Life Support' },
        { id: 'AMB-1008', name: 'City Emergency Services', lat: 19.1759, lng: 72.8421, status: 'available', type: 'Advanced Life Support' }
    ];
    
    // Store ambulance markers
    let ambulanceMarkers = [];
    let distressMarker = null;
    let distressOverlay = null;
    let dispatchedAmbulance = null;
    let ambulanceRoute = null;
    
    // Replace the existing distress button functionality
    distressBtn.removeEventListener('click', handleDistressSignal);
    distressBtn.addEventListener('click', enhancedDistressSignal);
    
    // Enhanced distress signal function
    function enhancedDistressSignal() {
        if (!userLocation) {
            updateStatus('Please allow location access first', 'error');
            getUserLocation();
            return;
        }
        
        // Create distress overlay
        createDistressOverlay();
        
        // Add distress marker to map
        addDistressMarker();
        
        // Find nearby ambulances
        findNearbyAmbulances();
    }
    
    // Create the distress signal overlay
    function createDistressOverlay() {
        // Remove existing overlay if any
        if (distressOverlay) {
            document.body.removeChild(distressOverlay);
        }
        
        distressOverlay = document.createElement('div');
        distressOverlay.className = 'distress-overlay';
        
        distressOverlay.innerHTML = `
            <div class="distress-panel">
                <div class="distress-header">
                    <h2><i class="fas fa-exclamation-triangle"></i> Emergency Distress Signal</h2>
                </div>
                <div class="distress-content">
                    <div class="distress-location">
                        <h3><i class="fas fa-map-marker-alt"></i> Your Current Location</h3>
                        <div class="coordinates">
                            Latitude: ${userLocation.lat.toFixed(6)}, Longitude: ${userLocation.lng.toFixed(6)}
                        </div>
                    </div>
                    
                    <div class="distress-progress">
                        <div class="progress-label">
                            <span>Sending distress signal...</span>
                            <span id="progress-percentage">0%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-fill"></div>
                        </div>
                    </div>
                    
                    <div class="distress-status" id="distress-status">
                        <h3>Initializing Emergency Protocol</h3>
                        <p>Please wait while we locate the nearest available ambulance.</p>
                    </div>
                    
                    <div class="distress-actions">
                        <button class="distress-btn primary" id="call-emergency-btn">
                            <i class="fas fa-phone-alt"></i> Call Emergency Services
                        </button>
                        <button class="distress-btn secondary" id="cancel-distress-btn">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(distressOverlay);
        
        // Add event listeners
        document.getElementById('call-emergency-btn').addEventListener('click', function() {
            window.location.href = 'tel:102'; // Emergency ambulance number in India
        });
        
        document.getElementById('cancel-distress-btn').addEventListener('click', function() {
            cancelDistressSignal();
        });
        
        // Start progress animation
        animateProgress();
    }
    
    // Animate the progress bar
    function animateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const progressPercentage = document.getElementById('progress-percentage');
        const distressStatus = document.getElementById('distress-status');
        
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                
                // Update status to success
                progressPercentage.textContent = '100%';
                distressStatus.className = 'distress-status success';
                distressStatus.innerHTML = `
                    <h3><i class="fas fa-check-circle"></i> Distress Signal Sent Successfully</h3>
                    <p>Your location has been shared with nearby emergency services.</p>
                `;
                
                // Update the cancel button to close
                const cancelBtn = document.getElementById('cancel-distress-btn');
                cancelBtn.innerHTML = '<i class="fas fa-check"></i> Close';
                cancelBtn.addEventListener('click', function() {
                    if (distressOverlay) {
                        document.body.removeChild(distressOverlay);
                        distressOverlay = null;
                    }
                });
                
                // Simulate ambulance dispatch after signal is sent
                setTimeout(dispatchAmbulance, 1500);
                
            } else {
                width += 1;
                progressFill.style.width = width + '%';
                progressPercentage.textContent = width + '%';
                
                // Update status messages at different stages
                if (width === 30) {
                    distressStatus.innerHTML = `
                        <h3>Locating Nearby Ambulances</h3>
                        <p>Scanning for available emergency vehicles in your area...</p>
                    `;
                } else if (width === 60) {
                    distressStatus.innerHTML = `
                                                <h3>Transmitting Location Data</h3>
                        <p>Sending your precise coordinates to emergency dispatch...</p>
                    `;
                } else if (width === 85) {
                    distressStatus.innerHTML = `
                        <h3>Establishing Connection</h3>
                        <p>Connecting to the nearest available ambulance service...</p>
                    `;
                }
            }
        }, 30);
    }
    
    // Add distress marker to the map
    function addDistressMarker() {
        // Remove existing distress marker if any
        if (distressMarker) {
            map.removeLayer(distressMarker);
        }
        
        // Create custom distress marker
        const distressIcon = L.divIcon({
            className: 'distress-marker-container',
            html: '<div class="distress-marker"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
        
        // Add marker to map
        distressMarker = L.marker([userLocation.lat, userLocation.lng], {
            icon: distressIcon,
            zIndexOffset: 1000
        }).addTo(map);
        
        // Add popup to marker
        distressMarker.bindPopup(`
            <div style="text-align: center;">
                <h3 style="margin: 5px 0;">Emergency Distress Signal</h3>
                <p style="margin: 5px 0;">Your current location</p>
            </div>
        `);
        
        // Center map on distress location
        map.setView([userLocation.lat, userLocation.lng], 14);
    }
    
    // Find nearby ambulances
    function findNearbyAmbulances() {
        // Clear existing ambulance markers
        ambulanceMarkers.forEach(marker => map.removeLayer(marker));
        ambulanceMarkers = [];
        
        // Calculate distance to each ambulance and sort by proximity
        const ambulancesWithDistance = ambulances.map(ambulance => {
            const distance = calculateDistance(
                userLocation.lat, userLocation.lng,
                ambulance.lat, ambulance.lng
            );
            
            return {
                ...ambulance,
                distance: distance
            };
        }).sort((a, b) => a.distance - b.distance);
        
        // Display the 3 closest ambulances on the map
        const nearbyAmbulances = ambulancesWithDistance.slice(0, 3);
        
        // Create ambulance markers
        nearbyAmbulances.forEach(ambulance => {
            // Create custom ambulance icon
            const ambulanceIcon = L.divIcon({
                className: 'ambulance-marker',
                html: '<i class="fas fa-ambulance"></i>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            
            // Add marker to map
            const marker = L.marker([ambulance.lat, ambulance.lng], {
                icon: ambulanceIcon
            }).addTo(map);
            
            // Add popup with ambulance info
            marker.bindPopup(`
                <div class="ambulance-info">
                    <h3>${ambulance.name}</h3>
                    <p><strong>ID:</strong> ${ambulance.id}</p>
                    <p><strong>Type:</strong> ${ambulance.type}</p>
                    <p><strong>Distance:</strong> ${ambulance.distance.toFixed(2)} km away</p>
                    <p><strong>Status:</strong> ${ambulance.status}</p>
                </div>
            `);
            
            // Store marker reference
            ambulanceMarkers.push(marker);
            
            // Store the closest ambulance for dispatch
            if (ambulance === nearbyAmbulances[0]) {
                dispatchedAmbulance = ambulance;
            }
        });
    }
    
    // Dispatch the nearest ambulance
    function dispatchAmbulance() {
        if (!dispatchedAmbulance) return;
        
        // Update distress status
        const distressStatus = document.getElementById('distress-status');
        if (distressStatus) {
            distressStatus.innerHTML = `
                <h3><i class="fas fa-ambulance"></i> Ambulance Dispatched</h3>
                <p><strong>${dispatchedAmbulance.name}</strong> is on the way to your location.</p>
                <p class="eta">Estimated arrival time: ${Math.ceil(dispatchedAmbulance.distance * 2)} minutes</p>
            `;
        }
        
        // Simulate ambulance movement towards the user
        simulateAmbulanceMovement();
    }
    
    // Simulate ambulance movement
    function simulateAmbulanceMovement() {
        if (!dispatchedAmbulance || ambulanceMarkers.length === 0) return;
        
        // Get the first ambulance marker (closest one)
        const ambulanceMarker = ambulanceMarkers[0];
        
        // Create a line between ambulance and user
        if (ambulanceRoute) {
            map.removeLayer(ambulanceRoute);
        }
        
        ambulanceRoute = L.polyline([
            [dispatchedAmbulance.lat, dispatchedAmbulance.lng],
            [userLocation.lat, userLocation.lng]
        ], {
            color: '#e74c3c',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10',
            lineJoin: 'round'
        }).addTo(map);
        
        // Animate ambulance movement
        const startLat = dispatchedAmbulance.lat;
        const startLng = dispatchedAmbulance.lng;
        const endLat = userLocation.lat;
        const endLng = userLocation.lng;
        
        // Calculate number of steps based on distance
        const steps = Math.ceil(dispatchedAmbulance.distance * 10);
        let currentStep = 0;
        
        const movementInterval = setInterval(() => {
            if (currentStep >= steps) {
                clearInterval(movementInterval);
                
                // Ambulance has arrived
                if (distressStatus) {
                    distressStatus.innerHTML = `
                        <h3><i class="fas fa-check-circle"></i> Ambulance Has Arrived</h3>
                        <p><strong>${dispatchedAmbulance.name}</strong> has reached your location.</p>
                    `;
                }
                
                // Remove route line
                if (ambulanceRoute) {
                    map.removeLayer(ambulanceRoute);
                    ambulanceRoute = null;
                }
                
                return;
            }
            
            // Calculate new position
            const progress = currentStep / steps;
            const newLat = startLat + (endLat - startLat) * progress;
            const newLng = startLng + (endLng - startLng) * progress;
            
            // Update ambulance position
            ambulanceMarker.setLatLng([newLat, newLng]);
            
            // Update route
            if (ambulanceRoute) {
                map.removeLayer(ambulanceRoute);
            }
            
            ambulanceRoute = L.polyline([
                [newLat, newLng],
                [userLocation.lat, userLocation.lng]
            ], {
                color: '#e74c3c',
                weight: 4,
                opacity: 0.7,
                dashArray: '10, 10',
                lineJoin: 'round'
            }).addTo(map);
            
            // Update ETA in status
            const remainingSteps = steps - currentStep;
            const etaMinutes = Math.ceil((remainingSteps / steps) * dispatchedAmbulance.distance * 2);
            
            const distressStatus = document.getElementById('distress-status');
            if (distressStatus) {
                const etaElement = distressStatus.querySelector('.eta');
                if (etaElement) {
                    etaElement.textContent = `Estimated arrival time: ${etaMinutes} minutes`;
                }
            }
            
            currentStep++;
        }, 500);
    }
    
    // Cancel distress signal
    function cancelDistressSignal() {
        // Remove distress marker
        if (distressMarker) {
            map.removeLayer(distressMarker);
            distressMarker = null;
        }
        
        // Remove ambulance markers
        ambulanceMarkers.forEach(marker => map.removeLayer(marker));
        ambulanceMarkers = [];
        
        // Remove ambulance route
        if (ambulanceRoute) {
            map.removeLayer(ambulanceRoute);
            ambulanceRoute = null;
        }
        
        // Remove overlay
        if (distressOverlay) {
            document.body.removeChild(distressOverlay);
            distressOverlay = null;
        }
        
        // Reset variables
        dispatchedAmbulance = null;
    }
    
    // Helper function to calculate distance between two points
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c; // Distance in km
        return distance;
    }
    
    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }
    
    // Helper function to update status
    function updateStatus(message, type = 'info', duration = 0) {
        const statusElement = document.getElementById('status');
        if (!statusElement) return;
        
        statusElement.textContent = message;
        statusElement.className = `status ${type}`;
        statusElement.style.display = 'block';
        
        if (duration > 0) {
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, duration);
        }
    }
    
    console.log("Enhanced distress signal functionality applied successfully");
})();

// ===================================================================================
// Function to add accident-prone areas to the map
function addAccidentProneAreas(map, areas) {
    // Define colors for different severity levels
    const severityColors = {
        'high': '#A31D1D',    // Dark red from your palette
        'medium': '#D84040',  // Bright red from your palette
        'low': '#ECDCBF'      // Light beige from your palette
    };
    
    // Create a layer group for accident-prone areas
    const accidentAreasGroup = L.layerGroup().addTo(map);
    
    // Add each accident-prone area to the map
    areas.forEach(area => {
        // Create circle with radius based on accident count
        const radius = Math.min(100, Math.max(50, area.accidents_count * 2));
        
        // Create circle marker
        const circle = L.circle([area.lat, area.lon], {
            color: severityColors[area.severity],
            fillColor: severityColors[area.severity],
            fillOpacity: 0.4,
            weight: 10,
            radius: radius
        }).addTo(accidentAreasGroup);
        
        // Add popup with information
        circle.bindPopup(`
            <div class="popup-content">
                <h3>${area.name}</h3>
                <p><strong>Accident Severity:</strong> ${area.severity.toUpperCase()}</p>
                <p><strong>Reported Accidents:</strong> ${area.accidents_count}</p>
                <p class="accident-warning">Drive carefully in this area!</p>
            </div>
        `);
    });
    
    // Add to layer control if it exists
    if (typeof layerControl !== 'undefined') {
        layerControl.addOverlay(accidentAreasGroup, "Accident-Prone Areas");
    }
    
    return accidentAreasGroup;
}

// When the map is initialized, add this to load accident-prone areas
document.addEventListener('DOMContentLoaded', function() {
    // Assuming your map is already initialized as 'map'
    // and accident areas are passed from Flask as 'accidentAreas'
    
    // Check if accident areas data is available
    if (typeof accidentAreas !== 'undefined') {
        addAccidentProneAreas(map, accidentAreas);
    } else {
        // Fetch accident areas from API if not provided directly
        fetch('/accident_prone_areas')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    addAccidentProneAreas(map, data.data);
                }
            })
            .catch(error => console.error('Error loading accident-prone areas:', error));
    }
});

// FIX FLOATING DISTRESS MARKER ISSUE
// Add this code at the end of your JavaScript file

(function fixFloatingDistressMarker() {
    console.log("Fixing floating distress marker issue...");
    
    // Track all markers created during distress signal
    let allDistressMarkers = [];
    let distressActive = false;
    
    // Override the enhancedDistressSignal function completely
    window.enhancedDistressSignal = function() {
        console.log("Enhanced distress signal triggered");
        
        // First, make sure we have the most up-to-date user location
        if (!userLocation) {
            updateStatus('Please allow location access first', 'error');
            getUserLocation();
            return;
        }
        
        // If distress is already active, cancel it first
        if (distressActive) {
            cancelDistressSignal();
        }
        
        distressActive = true;
        
        // Clear any existing markers from previous distress signals
        clearAllDistressMarkers();
        
        // Create distress overlay
        createDistressOverlay();
        
        // Add distress marker to map at the exact current location
        addFixedDistressMarker();
        
        // Find nearby ambulances
        findNearbyAmbulances();
    };
    
    // Create a new function to add a fixed distress marker
    function addFixedDistressMarker() {
        console.log("Adding fixed distress marker at:", userLocation);
        
        // Create custom distress marker
        const distressIcon = L.divIcon({
            className: 'fixed-distress-marker-container',
            html: '<div class="fixed-distress-marker"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
        
        // Add marker to map at the exact user location
        const marker = L.marker([userLocation.lat, userLocation.lng], {
            icon: distressIcon,
            zIndexOffset: 1000
        }).addTo(map);
        
        // Add popup to marker
        marker.bindPopup(`
            <div style="text-align: center;">
                <h3 style="margin: 5px 0;">Emergency Distress Signal</h3>
                <p style="margin: 5px 0;">Your current location</p>
                <p style="margin: 5px 0; font-size: 0.9em;">Lat: ${userLocation.lat.toFixed(6)}, Lng: ${userLocation.lng.toFixed(6)}</p>
            </div>
        `);
        
        // Track this marker
        allDistressMarkers.push(marker);
        
        // Center map on distress location
        map.setView([userLocation.lat, userLocation.lng], 14);
    }
    
    // Override the findNearbyAmbulances function
    window.findNearbyAmbulances = function() {
        console.log("Finding nearby ambulances");
        
        // Sample ambulance data (use your existing data)
        const ambulances = [
            { id: 'AMB-1001', name: 'City Hospital Ambulance 1', lat: userLocation.lat + 0.01, lng: userLocation.lng + 0.01, status: 'available', type: 'Advanced Life Support' },
            { id: 'AMB-1002', name: 'City Hospital Ambulance 2', lat: userLocation.lat - 0.01, lng: userLocation.lng + 0.02, status: 'available', type: 'Basic Life Support' },
            { id: 'AMB-1003', name: 'Medical Center Ambulance', lat: userLocation.lat + 0.02, lng: userLocation.lng - 0.01, status: 'available', type: 'Advanced Life Support' }
        ];
        
        // Calculate distance to each ambulance and sort by proximity
        const ambulancesWithDistance = ambulances.map(ambulance => {
            const distance = calculateDistance(
                userLocation.lat, userLocation.lng,
                ambulance.lat, ambulance.lng
            );
            
            return {
                ...ambulance,
                distance: distance
            };
        }).sort((a, b) => a.distance - b.distance);
        
        // Display the 3 closest ambulances on the map
        const nearbyAmbulances = ambulancesWithDistance.slice(0, 3);
        
        // Create ambulance markers
        nearbyAmbulances.forEach(ambulance => {
            // Create custom ambulance icon
            const ambulanceIcon = L.divIcon({
                className: 'ambulance-marker',
                html: '<i class="fas fa-ambulance"></i>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            
            // Add marker to map
            const marker = L.marker([ambulance.lat, ambulance.lng], {
                icon: ambulanceIcon
            }).addTo(map);
            
            // Add popup with ambulance info
            marker.bindPopup(`
                <div class="ambulance-info">
                    <h3>${ambulance.name}</h3>
                    <p><strong>ID:</strong> ${ambulance.id}</p>
                    <p><strong>Type:</strong> ${ambulance.type}</p>
                    <p><strong>Distance:</strong> ${ambulance.distance.toFixed(2)} km away</p>
                    <p><strong>Status:</strong> ${ambulance.status}</p>
                </div>
            `);
            
            // Track this marker
            allDistressMarkers.push(marker);
            
            // Store the closest ambulance for dispatch
            if (ambulance === nearbyAmbulances[0]) {
                window.dispatchedAmbulance = ambulance;
                
                // Simulate ambulance movement after a delay
                setTimeout(() => {
                    simulateAmbulanceMovement(marker, ambulance);
                }, 2000);
            }
        });
    };
    
    // Simulate ambulance movement
    function simulateAmbulanceMovement(ambulanceMarker, ambulance) {
        if (!ambulanceMarker || !ambulance) return;
        
        // Create a line between ambulance and user
        let ambulanceRoute = L.polyline([
            [ambulance.lat, ambulance.lng],
            [userLocation.lat, userLocation.lng]
        ], {
            color: '#e74c3c',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10',
            lineJoin: 'round'
        }).addTo(map);
        
        // Track this route
        allDistressMarkers.push(ambulanceRoute);
        
        // Animate ambulance movement
        const startLat = ambulance.lat;
        const startLng = ambulance.lng;
        const endLat = userLocation.lat;
        const endLng = userLocation.lng;
        
        // Calculate number of steps based on distance
        const steps = Math.ceil(ambulance.distance * 10);
        let currentStep = 0;
        
        const movementInterval = setInterval(() => {
            if (!distressActive) {
                clearInterval(movementInterval);
                return;
            }
            
            if (currentStep >= steps) {
                clearInterval(movementInterval);
                
                // Ambulance has arrived
                const distressStatus = document.getElementById('distress-status');
                if (distressStatus) {
                    distressStatus.innerHTML = `
                        <h3><i class="fas fa-check-circle"></i> Ambulance Has Arrived</h3>
                        <p><strong>${ambulance.name}</strong> has reached your location.</p>
                    `;
                }
                
                // Remove route line
                if (ambulanceRoute) {
                    map.removeLayer(ambulanceRoute);
                    const index = allDistressMarkers.indexOf(ambulanceRoute);
                    if (index > -1) {
                        allDistressMarkers.splice(index, 1);
                    }
                    ambulanceRoute = null;
                }
                
                return;
            }
            
            // Calculate new position
            const progress = currentStep / steps;
            const newLat = startLat + (endLat - startLat) * progress;
            const newLng = startLng + (endLng - startLng) * progress;
            
            // Update ambulance position
            ambulanceMarker.setLatLng([newLat, newLng]);
            
            // Update route
            if (ambulanceRoute) {
                map.removeLayer(ambulanceRoute);
                const index = allDistressMarkers.indexOf(ambulanceRoute);
                if (index > -1) {
                    allDistressMarkers.splice(index, 1);
                }
            }
            
            ambulanceRoute = L.polyline([
                [newLat, newLng],
                [userLocation.lat, userLocation.lng]
            ], {
                color: '#e74c3c',
                weight: 4,
                opacity: 0.7,
                dashArray: '10, 10',
                lineJoin: 'round'
            }).addTo(map);
            
            // Track this route
            allDistressMarkers.push(ambulanceRoute);
            
            // Update ETA in status
            const remainingSteps = steps - currentStep;
            const etaMinutes = Math.ceil((remainingSteps / steps) * ambulance.distance * 2);
            
            const distressStatus = document.getElementById('distress-status');
            if (distressStatus) {
                const etaElement = distressStatus.querySelector('.eta');
                if (etaElement) {
                    etaElement.textContent = `Estimated arrival time: ${etaMinutes} minutes`;
                }
            }
            
            currentStep++;
        }, 500);
    }
    
    // Override the cancelDistressSignal function
    window.cancelDistressSignal = function() {
        console.log("Canceling distress signal");
        
        // Clear all markers
        clearAllDistressMarkers();
        
        // Remove overlay
        const distressOverlay = document.querySelector('.distress-overlay');
        if (distressOverlay) {
            document.body.removeChild(distressOverlay);
        }
        
        // Reset variables
        window.dispatchedAmbulance = null;
        distressActive = false;
    };
    
    // Function to clear all distress-related markers
    function clearAllDistressMarkers() {
        console.log("Clearing all distress markers:", allDistressMarkers.length);
        
        // Remove all tracked markers
        allDistressMarkers.forEach(marker => {
            if (marker && map) {
                map.removeLayer(marker);
            }
        });
        
        // Clear the array
        allDistressMarkers = [];
        
        // Also look for any markers with classes that might be related to distress
        document.querySelectorAll('.leaflet-marker-icon').forEach(element => {
            if (element.className.includes('distress') || element.className.includes('ambulance')) {
                const parent = element.parentElement;
                if (parent) {
                    parent.remove();
                }
            }
        });
    }
    
    // Add CSS to ensure the distress marker is clearly visible
    const style = document.createElement('style');
    style.textContent = `
        /* Fixed Distress Marker */
        .fixed-distress-marker-container {
            z-index: 1000 !important;
        }
        
        .fixed-distress-marker {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: rgba(231, 76, 60, 0.6);
            position: relative;
            z-index: 1000;
        }
        
        .fixed-distress-marker:before {
            content: '';
            position: absolute;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: rgba(231, 76, 60, 0.6);
            z-index: 999;
            animation: pulse-ring 2s infinite;
        }
        
        .fixed-distress-marker:after {
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #e74c3c;
            z-index: 1001;
        }
        
        /* Ambulance Marker */
        .ambulance-marker {
            color: #e74c3c;
            font-size: 24px;
            filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.3));
            z-index: 900;
        }
        
        .ambulance-marker i {
            animation: bounce 1s infinite alternate;
        }
        
        @keyframes bounce {
            from { transform: translateY(0); }
            to { transform: translateY(-5px); }
        }
    `;
    document.head.appendChild(style);
    
    console.log("Floating distress marker issue fixed");
})();
// ADD POLICE AND FIRE BRIGADE EMERGENCY SERVICES
// Add this code at the end of your JavaScript file

(function addEmergencyServices() {
    console.log("Adding police and fire brigade emergency services...");
    
    // Dummy data for police stations
    window.policeStations = [
        { id: 'POL-1001', name: 'Central Police Station', lat: userLocation ? userLocation.lat + 0.015 : 19.0760, lng: userLocation ? userLocation.lng - 0.012 : 72.8777, status: 'available', type: 'Police Headquarters', phone: '100' },
        { id: 'POL-1002', name: 'North District Police Station', lat: userLocation ? userLocation.lat - 0.018 : 19.1330, lng: userLocation ? userLocation.lng + 0.014 : 72.9153, status: 'available', type: 'District Station', phone: '100' },
        { id: 'POL-1003', name: 'East Police Outpost', lat: userLocation ? userLocation.lat + 0.022 : 19.0636, lng: userLocation ? userLocation.lng + 0.025 : 72.9005, status: 'available', type: 'Police Outpost', phone: '100' },
        { id: 'POL-1004', name: 'South Police Station', lat: userLocation ? userLocation.lat - 0.025 : 18.9542, lng: userLocation ? userLocation.lng - 0.018 : 72.8226, status: 'available', type: 'District Station', phone: '100' },
        { id: 'POL-1005', name: 'West Police Station', lat: userLocation ? userLocation.lat + 0.008 : 19.0596, lng: userLocation ? userLocation.lng - 0.027 : 72.8295, status: 'available', type: 'District Station', phone: '100' }
    ];
    
    // Dummy data for fire brigades
    window.fireBrigades = [
        { id: 'FIRE-1001', name: 'Central Fire Station', lat: userLocation ? userLocation.lat - 0.012 : 19.0560, lng: userLocation ? userLocation.lng + 0.018 : 72.8377, status: 'available', type: 'Main Fire Station', phone: '101' },
        { id: 'FIRE-1002', name: 'North Fire Brigade', lat: userLocation ? userLocation.lat + 0.027 : 19.1230, lng: userLocation ? userLocation.lng - 0.015 : 72.8953, status: 'available', type: 'Fire Brigade', phone: '101' },
        { id: 'FIRE-1003', name: 'East Fire Services', lat: userLocation ? userLocation.lat - 0.022 : 19.0436, lng: userLocation ? userLocation.lng + 0.019 : 72.9205, status: 'available', type: 'Fire Brigade', phone: '101' },
        { id: 'FIRE-1004', name: 'South Fire Station', lat: userLocation ? userLocation.lat + 0.019 : 18.9742, lng: userLocation ? userLocation.lng + 0.022 : 72.8126, status: 'available', type: 'Fire Station', phone: '101' }
    ];
    
    // Enhance the distress overlay to include police and fire brigade options
    const originalCreateDistressOverlay = window.createDistressOverlay;
    window.createDistressOverlay = function() {
        // If the original function exists, call it first
        if (typeof originalCreateDistressOverlay === 'function') {
            originalCreateDistressOverlay();
        } else {
            // Create a basic overlay if the original function doesn't exist
            const distressOverlay = document.createElement('div');
            distressOverlay.className = 'distress-overlay';
            document.body.appendChild(distressOverlay);
        }
        
        // Get the overlay
        const overlay = document.querySelector('.distress-overlay');
        if (!overlay) return;
        
        // Replace or create the panel
        const existingPanel = overlay.querySelector('.distress-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        const panel = document.createElement('div');
        panel.className = 'distress-panel';
        
        panel.innerHTML = `
            <div class="distress-header">
                <h2><i class="fas fa-exclamation-triangle"></i> Emergency Distress Signal</h2>
            </div>
            <div class="distress-content">
                <div class="distress-location">
                    <h3><i class="fas fa-map-marker-alt"></i> Your Current Location</h3>
                    <div class="coordinates">
                        Latitude: ${userLocation ? userLocation.lat.toFixed(6) : 'Unknown'}, 
                        Longitude: ${userLocation ? userLocation.lng.toFixed(6) : 'Unknown'}
                    </div>
                </div>
                
                <div class="emergency-services-selection">
                    <h3>Select Emergency Services Needed:</h3>
                    <div class="service-options">
                        <div class="service-option" data-service="ambulance">
                            <i class="fas fa-ambulance"></i>
                            <span>Medical</span>
                        </div>
                        <div class="service-option" data-service="police">
                            <i class="fas fa-shield-alt"></i>
                            <span>Police</span>
                        </div>
                        <div class="service-option" data-service="fire">
                            <i class="fas fa-fire-extinguisher"></i>
                            <span>Fire</span>
                        </div>
                        <div class="service-option" data-service="all">
                            <i class="fas fa-exclamation-circle"></i>
                            <span>All Services</span>
                        </div>
                    </div>
                </div>
                
                <div class="distress-progress">
                    <div class="progress-label">
                        <span>Sending distress signal...</span>
                        <span id="progress-percentage">0%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                </div>
                
                <div class="distress-status" id="distress-status">
                    <h3>Initializing Emergency Protocol</h3>
                    <p>Please select the emergency services you need and wait while we locate the nearest available units.</p>
                </div>
                
                <div class="emergency-contacts">
                    <h3>Emergency Contact Numbers:</h3>
                    <div class="contact-buttons">
                        <a href="tel:102" class="contact-btn ambulance">
                            <i class="fas fa-ambulance"></i> 102
                        </a>
                        <a href="tel:100" class="contact-btn police">
                            <i class="fas fa-shield-alt"></i> 100
                        </a>
                        <a href="tel:101" class="contact-btn fire">
                            <i class="fas fa-fire-extinguisher"></i> 101
                        </a>
                    </div>
                </div>
                
                <div class="distress-actions">
                    <button class="distress-btn primary" id="send-distress-btn">
                        <i class="fas fa-paper-plane"></i> Send Distress Signal
                    </button>
                    <button class="distress-btn secondary" id="cancel-distress-btn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        `;
        
        overlay.appendChild(panel);
        
        // Add CSS for the enhanced distress overlay
        const style = document.createElement('style');
        style.textContent = `
            .emergency-services-selection {
                margin: 20px 0;
            }
            
            .emergency-services-selection h3 {
                margin-top: 0;
                margin-bottom: 10px;
                color: #343a40;
                font-size: 1rem;
            }
            
            .service-options {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .service-option {
                flex: 1;
                min-width: 80px;
                background-color: #f8f9fa;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                padding: 12px 8px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .service-option:hover {
                background-color: #e9ecef;
            }
            
            .service-option.selected {
                background-color: #e74c3c;
                border-color: #c0392b;
                color: white;
            }
            
            .service-option i {
                display: block;
                font-size: 24px;
                margin-bottom: 8px;
            }
            
            .service-option span {
                display: block;
                font-size: 14px;
                font-weight: 500;
            }
            
            .emergency-contacts {
                margin: 20px 0;
            }
            
            .emergency-contacts h3 {
                margin-top: 0;
                margin-bottom: 10px;
                color: #343a40;
                font-size: 1rem;
            }
            
            .contact-buttons {
                display: flex;
                justify-content: space-between;
                gap: 10px;
            }
            
            .contact-btn {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px;
                border-radius: 8px;
                text-decoration: none;
                color: white;
                font-weight: 600;
                transition: all 0.2s;
            }
            
            .contact-btn:hover {
                transform: translateY(-3px);
            }
            
            .contact-btn i {
                font-size: 20px;
                margin-bottom: 5px;
            }
            
            .contact-btn.ambulance {
                background-color: #e74c3c;
            }
            
            .contact-btn.police {
                background-color: #3498db;
            }
            
            .contact-btn.fire {
                background-color: #e67e22;
            }
            
            /* Police Marker */
            .police-marker {
                color: #3498db;
                font-size: 24px;
                filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.3));
                z-index: 900;
            }
            
            .police-marker i {
                animation: bounce 1s infinite alternate;
            }
            
            /* Fire Brigade Marker */
            .fire-marker {
                color: #e67e22;
                font-size: 24px;
                filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.3));
                z-index: 900;
            }
            
            .fire-marker i {
                animation: bounce 1s infinite alternate;
            }
        `;
        document.head.appendChild(style);
        
        // Add event listeners for service selection
        const serviceOptions = document.querySelectorAll('.service-option');
        serviceOptions.forEach(option => {
            option.addEventListener('click', function() {
                const service = this.getAttribute('data-service');
                
                if (service === 'all') {
                    // Select all services
                    serviceOptions.forEach(opt => {
                        opt.classList.add('selected');
                    });
                } else {
                    // Toggle this service
                    this.classList.toggle('selected');
                    
                    // If this was selected, deselect "All Services" option
                    const allOption = document.querySelector('.service-option[data-service="all"]');
                    if (this.classList.contains('selected') && allOption) {
                        allOption.classList.remove('selected');
                    }
                }
            });
        });
        
        // Add event listener for send distress button
        document.getElementById('send-distress-btn').addEventListener('click', function() {
            // Get selected services
            const selectedServices = [];
            document.querySelectorAll('.service-option.selected').forEach(option => {
                const service = option.getAttribute('data-service');
                if (service !== 'all') {
                    selectedServices.push(service);
                }
            });
            
            // If "all" is selected or no specific service is selected, include all services
            if (document.querySelector('.service-option[data-service="all"].selected') || selectedServices.length === 0) {
                selectedServices.push('ambulance', 'police', 'fire');
            }
            
            // Start the distress signal process
            startDistressSignalProcess(selectedServices);
        });
        
        // Add event listener for cancel button
        document.getElementById('cancel-distress-btn').addEventListener('click', function() {
            if (window.cancelDistressSignal) {
                window.cancelDistressSignal();
            } else {
                const overlay = document.querySelector('.distress-overlay');
                if (overlay) {
                    document.body.removeChild(overlay);
                }
            }
        });
    };
    
    // Function to start the distress signal process
    function startDistressSignalProcess(selectedServices) {
        console.log("Starting distress signal process for services:", selectedServices);
        
        // Show progress animation
        animateProgress(selectedServices);
        
        // Add distress marker
        if (window.addFixedDistressMarker) {
            window.addFixedDistressMarker();
        }
        
        // Dispatch selected emergency services
        setTimeout(() => {
            dispatchEmergencyServices(selectedServices);
        }, 2000);
    }
    
    // Animate the progress bar
    function animateProgress(selectedServices) {
        const progressFill = document.getElementById('progress-fill');
        const progressPercentage = document.getElementById('progress-percentage');
        const distressStatus = document.getElementById('distress-status');
        
        if (!progressFill || !progressPercentage || !distressStatus) return;
        
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                
                // Update status to success
                progressPercentage.textContent = '100%';
                distressStatus.className = 'distress-status success';
                distressStatus.innerHTML = `
                    <h3><i class="fas fa-check-circle"></i> Distress Signal Sent Successfully</h3>
                    <p>Your location has been shared with nearby emergency services.</p>
                `;
                
            } else {
                width += 1;
                progressFill.style.width = width + '%';
                progressPercentage.textContent = width + '%';
                
                // Update status messages at different stages
                if (width === 30) {
                    distressStatus.innerHTML = `
                                                <h3>Locating Nearby Emergency Services</h3>
                        <p>Scanning for available units in your area...</p>
                    `;
                } else if (width === 60) {
                    distressStatus.innerHTML = `
                        <h3>Transmitting Location Data</h3>
                        <p>Sending your precise coordinates to emergency dispatch...</p>
                    `;
                } else if (width === 85) {
                    distressStatus.innerHTML = `
                        <h3>Establishing Connection</h3>
                        <p>Connecting to the nearest available emergency services...</p>
                    `;
                }
            }
        }, 30);
    }
    
    // Dispatch emergency services based on selection
    function dispatchEmergencyServices(selectedServices) {
        console.log("Dispatching emergency services:", selectedServices);
        
        // Clear existing emergency markers
        clearEmergencyMarkers();
        
        // Track all emergency markers
        window.emergencyMarkers = window.emergencyMarkers || [];
        
        // Dispatch each selected service
        selectedServices.forEach(service => {
            switch(service) {
                case 'ambulance':
                    dispatchAmbulances();
                    break;
                case 'police':
                    dispatchPolice();
                    break;
                case 'fire':
                    dispatchFireBrigade();
                    break;
            }
        });
        
        // Update status with dispatched services
        updateDispatchStatus(selectedServices);
    }
    
    // Clear all emergency markers
    function clearEmergencyMarkers() {
        if (window.emergencyMarkers && window.emergencyMarkers.length > 0) {
            window.emergencyMarkers.forEach(marker => {
                if (marker && map) {
                    map.removeLayer(marker);
                }
            });
        }
        window.emergencyMarkers = [];
    }
    
    // Dispatch ambulances
    function dispatchAmbulances() {
        // Use existing ambulance data or create new if needed
        const ambulances = window.ambulances || [
            { id: 'AMB-1001', name: 'City Hospital Ambulance 1', lat: userLocation.lat + 0.01, lng: userLocation.lng + 0.01, status: 'available', type: 'Advanced Life Support' },
            { id: 'AMB-1002', name: 'City Hospital Ambulance 2', lat: userLocation.lat - 0.01, lng: userLocation.lng + 0.02, status: 'available', type: 'Basic Life Support' }
        ];
        
        // Calculate distance to each ambulance and sort by proximity
        const ambulancesWithDistance = ambulances.map(ambulance => {
            const distance = calculateDistance(
                userLocation.lat, userLocation.lng,
                ambulance.lat, ambulance.lng
            );
            
            return {
                ...ambulance,
                distance: distance
            };
        }).sort((a, b) => a.distance - b.distance);
        
        // Display the closest ambulance on the map
        const closestAmbulance = ambulancesWithDistance[0];
        
        // Create custom ambulance icon
        const ambulanceIcon = L.divIcon({
            className: 'ambulance-marker',
            html: '<i class="fas fa-ambulance"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        // Add marker to map
        const marker = L.marker([closestAmbulance.lat, closestAmbulance.lng], {
            icon: ambulanceIcon
        }).addTo(map);
        
        // Add popup with ambulance info
        marker.bindPopup(`
            <div class="ambulance-info">
                <h3>${closestAmbulance.name}</h3>
                <p><strong>ID:</strong> ${closestAmbulance.id}</p>
                <p><strong>Type:</strong> ${closestAmbulance.type}</p>
                <p><strong>Distance:</strong> ${closestAmbulance.distance.toFixed(2)} km away</p>
                <p><strong>ETA:</strong> ${Math.ceil(closestAmbulance.distance * 2)} minutes</p>
            </div>
        `);
        
        // Track this marker
        window.emergencyMarkers.push(marker);
        
        // Create route from ambulance to user
        const route = L.polyline([
            [closestAmbulance.lat, closestAmbulance.lng],
            [userLocation.lat, userLocation.lng]
        ], {
            color: '#e74c3c',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10',
            lineJoin: 'round'
        }).addTo(map);
        
        // Track this route
        window.emergencyMarkers.push(route);
        
        // Simulate ambulance movement
        simulateEmergencyVehicleMovement(marker, closestAmbulance, '#e74c3c');
    }
    
    // Dispatch police
    function dispatchPolice() {
        // Calculate distance to each police station and sort by proximity
        const policeWithDistance = window.policeStations.map(station => {
            const distance = calculateDistance(
                userLocation.lat, userLocation.lng,
                station.lat, station.lng
            );
            
            return {
                ...station,
                distance: distance
            };
        }).sort((a, b) => a.distance - b.distance);
        
        // Display the closest police station on the map
        const closestPolice = policeWithDistance[0];
        
        // Create custom police icon
        const policeIcon = L.divIcon({
            className: 'police-marker',
            html: '<i class="fas fa-shield-alt"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        // Add marker to map
        const marker = L.marker([closestPolice.lat, closestPolice.lng], {
            icon: policeIcon
        }).addTo(map);
        
        // Add popup with police info
        marker.bindPopup(`
            <div class="police-info">
                <h3>${closestPolice.name}</h3>
                <p><strong>ID:</strong> ${closestPolice.id}</p>
                <p><strong>Type:</strong> ${closestPolice.type}</p>
                <p><strong>Distance:</strong> ${closestPolice.distance.toFixed(2)} km away</p>
                <p><strong>ETA:</strong> ${Math.ceil(closestPolice.distance * 2)} minutes</p>
            </div>
        `);
        
        // Track this marker
        window.emergencyMarkers.push(marker);
        
        // Create route from police to user
        const route = L.polyline([
            [closestPolice.lat, closestPolice.lng],
            [userLocation.lat, userLocation.lng]
        ], {
            color: '#3498db',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10',
            lineJoin: 'round'
        }).addTo(map);
        
        // Track this route
        window.emergencyMarkers.push(route);
        
        // Simulate police movement
        simulateEmergencyVehicleMovement(marker, closestPolice, '#3498db');
    }
    
    // Dispatch fire brigade
    function dispatchFireBrigade() {
        // Calculate distance to each fire brigade and sort by proximity
        const fireWithDistance = window.fireBrigades.map(brigade => {
            const distance = calculateDistance(
                userLocation.lat, userLocation.lng,
                brigade.lat, brigade.lng
            );
            
            return {
                ...brigade,
                distance: distance
            };
        }).sort((a, b) => a.distance - b.distance);
        
        // Display the closest fire brigade on the map
        const closestFire = fireWithDistance[0];
        
        // Create custom fire brigade icon
        const fireIcon = L.divIcon({
            className: 'fire-marker',
            html: '<i class="fas fa-fire-extinguisher"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        // Add marker to map
        const marker = L.marker([closestFire.lat, closestFire.lng], {
            icon: fireIcon
        }).addTo(map);
        
        // Add popup with fire brigade info
        marker.bindPopup(`
            <div class="fire-info">
                <h3>${closestFire.name}</h3>
                <p><strong>ID:</strong> ${closestFire.id}</p>
                <p><strong>Type:</strong> ${closestFire.type}</p>
                <p><strong>Distance:</strong> ${closestFire.distance.toFixed(2)} km away</p>
                <p><strong>ETA:</strong> ${Math.ceil(closestFire.distance * 2)} minutes</p>
            </div>
        `);
        
        // Track this marker
        window.emergencyMarkers.push(marker);
        
        // Create route from fire brigade to user
        const route = L.polyline([
            [closestFire.lat, closestFire.lng],
            [userLocation.lat, userLocation.lng]
        ], {
            color: '#e67e22',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10',
            lineJoin: 'round'
        }).addTo(map);
        
        // Track this route
        window.emergencyMarkers.push(route);
        
        // Simulate fire brigade movement
        simulateEmergencyVehicleMovement(marker, closestFire, '#e67e22');
    }
    
    // Simulate emergency vehicle movement
    function simulateEmergencyVehicleMovement(marker, vehicle, routeColor) {
        if (!marker || !vehicle) return;
        
        // Animate vehicle movement
        const startLat = vehicle.lat;
        const startLng = vehicle.lng;
        const endLat = userLocation.lat;
        const endLng = userLocation.lng;
        
        // Calculate number of steps based on distance
        const steps = Math.ceil(vehicle.distance * 10);
        let currentStep = 0;
        
        const movementInterval = setInterval(() => {
            // Check if distress signal is still active
            const distressOverlay = document.querySelector('.distress-overlay');
            if (!distressOverlay) {
                clearInterval(movementInterval);
                return;
            }
            
            if (currentStep >= steps) {
                clearInterval(movementInterval);
                
                // Vehicle has arrived
                const vehicleType = routeColor === '#e74c3c' ? 'Ambulance' : 
                                   routeColor === '#3498db' ? 'Police' : 'Fire Brigade';
                
                // Update status if this is the first vehicle to arrive
                const distressStatus = document.getElementById('distress-status');
                if (distressStatus && !distressStatus.dataset.arrived) {
                    distressStatus.dataset.arrived = 'true';
                    distressStatus.innerHTML = `
                        <h3><i class="fas fa-check-circle"></i> ${vehicleType} Has Arrived</h3>
                        <p><strong>${vehicle.name}</strong> has reached your location.</p>
                        <p>Other emergency services are on their way.</p>
                    `;
                }
                
                return;
            }
            
            // Calculate new position
            const progress = currentStep / steps;
            const newLat = startLat + (endLat - startLat) * progress;
            const newLng = startLng + (endLng - startLng) * progress;
            
            // Update vehicle position
            marker.setLatLng([newLat, newLng]);
            
            // Update route
            const existingRoutes = window.emergencyMarkers.filter(m => m instanceof L.Polyline);
            existingRoutes.forEach(route => {
                if (route.options.color === routeColor) {
                    map.removeLayer(route);
                    const index = window.emergencyMarkers.indexOf(route);
                    if (index > -1) {
                        window.emergencyMarkers.splice(index, 1);
                    }
                }
            });
            
            const newRoute = L.polyline([
                [newLat, newLng],
                [userLocation.lat, userLocation.lng]
            ], {
                color: routeColor,
                weight: 4,
                opacity: 0.7,
                dashArray: '10, 10',
                lineJoin: 'round'
            }).addTo(map);
            
            // Track this route
            window.emergencyMarkers.push(newRoute);
            
            // Update ETA
            const remainingSteps = steps - currentStep;
            const etaMinutes = Math.ceil((remainingSteps / steps) * vehicle.distance * 2);
            
            // Update popup content
            const vehicleType = routeColor === '#e74c3c' ? 'ambulance' : 
                               routeColor === '#3498db' ? 'police' : 'fire';
            
            const popupContent = `
                <div class="${vehicleType}-info">
                    <h3>${vehicle.name}</h3>
                    <p><strong>ID:</strong> ${vehicle.id}</p>
                    <p><strong>Type:</strong> ${vehicle.type}</p>
                    <p><strong>Distance:</strong> ${((steps - currentStep) / steps * vehicle.distance).toFixed(2)} km away</p>
                    <p><strong>ETA:</strong> ${etaMinutes} minutes</p>
                </div>
            `;
            
            marker.getPopup().setContent(popupContent);
            if (marker.getPopup().isOpen()) {
                marker.getPopup().update();
            }
            
            currentStep++;
        }, 500);
    }
    
    // Update dispatch status in the UI
    function updateDispatchStatus(selectedServices) {
        const distressStatus = document.getElementById('distress-status');
        if (!distressStatus) return;
        
        let serviceNames = [];
        if (selectedServices.includes('ambulance')) serviceNames.push('Medical Services');
        if (selectedServices.includes('police')) serviceNames.push('Police');
        if (selectedServices.includes('fire')) serviceNames.push('Fire Brigade');
        
        const servicesText = serviceNames.join(', ');
        
        distressStatus.innerHTML = `
            <h3><i class="fas fa-check-circle"></i> Emergency Services Dispatched</h3>
            <p>${servicesText} have been notified and are on their way to your location.</p>
            <p class="eta">Please stay at your current location if it's safe to do so.</p>
        `;
        
        // Update the cancel button to close
        const cancelBtn = document.getElementById('cancel-distress-btn');
        if (cancelBtn) {
            cancelBtn.innerHTML = '<i class="fas fa-times"></i> Close';
        }
        
        // Update the send button to call emergency
        const sendBtn = document.getElementById('send-distress-btn');
        if (sendBtn) {
            sendBtn.innerHTML = '<i class="fas fa-phone-alt"></i> Call Emergency Services';
            sendBtn.addEventListener('click', function() {
                // Determine which number to call based on selected services
                                // Determine which number to call based on selected services
                                let phoneNumber = '112'; // General emergency number
                
                                if (selectedServices.length === 1) {
                                    // If only one service is selected, call that specific number
                                    if (selectedServices[0] === 'ambulance') phoneNumber = '102';
                                    else if (selectedServices[0] === 'police') phoneNumber = '100';
                                    else if (selectedServices[0] === 'fire') phoneNumber = '101';
                                }
                                
                                // Open phone dialer
                                window.location.href = `tel:${phoneNumber}`;
                            });
                        }
                    }
                    
                    // Override the cancelDistressSignal function to clear all emergency markers
                    const originalCancelDistressSignal = window.cancelDistressSignal;
                    window.cancelDistressSignal = function() {
                        console.log("Canceling distress signal with emergency services");
                        
                        // Call the original function if it exists
                        if (typeof originalCancelDistressSignal === 'function') {
                            originalCancelDistressSignal();
                        }
                        
                        // Clear all emergency markers
                        clearEmergencyMarkers();
                        
                        // Remove overlay
                        const distressOverlay = document.querySelector('.distress-overlay');
                        if (distressOverlay) {
                            document.body.removeChild(distressOverlay);
                        }
                    };
                    
                    // Helper function to calculate distance between two points (if not already defined)
                    if (typeof window.calculateDistance !== 'function') {
                        window.calculateDistance = function(lat1, lon1, lat2, lon2) {
                            const R = 6371; // Radius of the earth in km
                            const dLat = deg2rad(lat2 - lat1);
                            const dLon = deg2rad(lon2 - lon1);
                            const a = 
                                Math.sin(dLat/2) * Math.sin(dLat/2) +
                                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
                                Math.sin(dLon/2) * Math.sin(dLon/2); 
                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                            const distance = R * c; // Distance in km
                            return distance;
                        };
                        
                        function deg2rad(deg) {
                            return deg * (Math.PI/180);
                        }
                    }

                    // Common function to populate any service list
function populateServiceList(serviceType, data) {
    const listContainers = {
        'hospital': document.getElementById('hospital-list-container'),
        'police': document.getElementById('police-list-container'),
        'fire': document.getElementById('fire-list-container'),
        'ambulance': document.getElementById('ambulance-list-container')
    };
    
    const lists = {
        'hospital': document.getElementById('hospital-list'),
        'police': document.getElementById('police-list'),
        'fire': document.getElementById('fire-list'),
        'ambulance': document.getElementById('ambulance-list')
    };
    
    const icons = {
        'hospital': 'fas fa-hospital',
        'police': 'fas fa-shield-alt',
        'fire': 'fas fa-fire-extinguisher',
        'ambulance': 'fas fa-ambulance'
    };
    
    const listContainer = listContainers[serviceType];
    const list = lists[serviceType];
    const icon = icons[serviceType];
    
    // Clear existing list
    list.innerHTML = '';
    
    // Show the list container
    listContainer.style.display = 'block';
    
    // Add each service to the list
    data.forEach(service => {
        const listItem = document.createElement('li');
        listItem.className = 'service-item';
        
        // Calculate distance (example - you may have your own distance calculation)
        const distance = service.distance ? service.distance.toFixed(1) : '?';
        
        listItem.innerHTML = `
            <div class="service-info">
                <h4><i class="${icon}"></i> ${service.name}</h4>
                <p class="service-address">${service.address || 'Address not available'}</p>
                <p class="service-distance">${distance} km away</p>
                <p class="service-phone">${service.phone || 'Phone not available'}</p>
            </div>
            <div class="service-actions">
                <button class="btn direction-btn" data-lat="${service.lat}" data-lng="${service.lng}">
                    <i class="fas fa-directions"></i> Directions
                </button>
                <button class="btn call-btn" data-phone="${service.phone}">
                    <i class="fas fa-phone"></i> Call
                </button>
            </div>
        `;
        
        list.appendChild(listItem);
    });
    
    // Add event listeners to the buttons
    const directionButtons = list.querySelectorAll('.direction-btn');
    directionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lat = parseFloat(this.getAttribute('data-lat'));
            const lng = parseFloat(this.getAttribute('data-lng'));
            showDirections(lat, lng);
        });
    });
    
    const callButtons = list.querySelectorAll('.call-btn');
    callButtons.forEach(button => {
        button.addEventListener('click', function() {
            const phone = this.getAttribute('data-phone');
            if (phone && phone !== 'Phone not available') {
                window.location.href = `tel:${phone}`;
            } else {
                alert('Phone number not available');
            }
        });
    });
}

// Function to show directions
function showDirections(destLat, destLng) {
    // Clear any existing routing control
    if (window.routingControl) {
        map.removeControl(window.routingControl);
    }
    
    // Get user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            // Create routing control
            window.routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(userLat, userLng),
                    L.latLng(destLat, destLng)
                ],
                routeWhileDragging: true,
                showAlternatives: true,
                altLineOptions: {
                    styles: [
                        {color: 'black', opacity: 0.15, weight: 9},
                        {color: 'white', opacity: 0.8, weight: 6},
                        {color: 'blue', opacity: 0.5, weight: 2}
                    ]
                }
            }).addTo(map);
            
            // Update status message
            document.getElementById('status-message').textContent = 'Directions loaded. Follow the route to reach your destination.';
        }, error => {
            console.error('Error getting location:', error);
            alert('Could not get your current location. Please enable location services.');
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

// Event listeners for service buttons
document.getElementById('find-hospital-btn').addEventListener('click', function() {
    // Example data - replace with your actual API call
    const hospitalData = [
        {
            name: 'City General Hospital',
            address: '123 Healthcare Ave, Mumbai',
            lat: 19.076,
            lng: 72.877,
            distance: 2.3,
            phone: '+91 9876543210'
        },
        {
            name: 'Medical Center',
            address: '456 Wellness Blvd, Mumbai',
            lat: 19.082,
            lng: 72.882,
            distance: 3.1,
            phone: '+91 9876543211'
        }
        // Add more hospitals as needed
    ];
    
    populateServiceList('hospital', hospitalData);
});

document.getElementById('find-police-btn').addEventListener('click', function() {
    // Example data - replace with your actual API call
    const policeData = [
        {
            name: 'Central Police Station',
            address: '789 Law Enforcement Rd, Mumbai',
            lat: 19.071,
            lng: 72.871,
            distance: 1.8,
            phone: '+91 9876543212'
        },
        {
            name: 'North District Police',
            address: '101 Security St, Mumbai',
            lat: 19.088,
            lng: 72.889,
            distance: 4.2,
            phone: '+91 9876543213'
        }
        // Add more police stations as needed
    ];
    
    populateServiceList('police', policeData);
});

document.getElementById('find-fire-btn').addEventListener('click', function() {
    // Example data - replace with your actual API call
    const fireData = [
        {
            name: 'Main Fire Station',
            address: '202 Emergency Blvd, Mumbai',
            lat: 19.065,
            lng: 72.865,
            distance: 2.5,
            phone: '+91 9876543214'
        },
        {
            name: 'East Mumbai Fire Dept',
            address: '303 Rescue Ave, Mumbai',
            lat: 19.079,
            lng: 72.892,
            distance: 3.7,
            phone: '+91 9876543215'
        }
        // Add more fire stations as needed
    ];
    
    populateServiceList('fire', fireData);
});

document.getElementById('find-ambulance-btn').addEventListener('click', function() {
    // Example data - replace with your actual API call
    const ambulanceData = [
        {
            name: 'Emergency Response Unit 1',
            address: 'Mobile Unit - Currently near City Center',
            lat: 19.073,
            lng: 72.875,
            distance: 1.2,
            phone: '+91 9876543216'
        },
        {
            name: 'Medical Transport Service',
            address: 'Mobile Unit - Currently near Railway Station',
            lat: 19.081,
            lng: 72.878,
            distance: 2.9,
            phone: '+91 9876543217'
        }
        // Add more ambulances as needed
    ];
    
    populateServiceList('ambulance', ambulanceData);
});

// Close buttons for each service list
document.getElementById('close-hospital-list').addEventListener('click', function() {
    document.getElementById('hospital-list-container').style.display = 'none';
});

document.getElementById('close-police-list').addEventListener('click', function() {
    document.getElementById('police-list-container').style.display = 'none';
});

document.getElementById('close-fire-list').addEventListener('click', function() {
    document.getElementById('fire-list-container').style.display = 'none';
});

document.getElementById('close-ambulance-list').addEventListener('click', function() {
    document.getElementById('ambulance-list-container').style.display = 'none';
});
                    
                    // Add emergency service icons to the map legend
                    function addEmergencyServicesToLegend() {
                        const legend = document.querySelector('.map-legend');
                        if (!legend) return;
                        
                        // Add emergency services section to legend
                        const emergencySection = document.createElement('div');
                        emergencySection.className = 'legend-section emergency-services';
                        emergencySection.innerHTML = `
                            <h3>Emergency Services</h3>
                            <div class="legend-item">
                                <div class="legend-icon ambulance-icon"><i class="fas fa-ambulance"></i></div>
                                <div class="legend-label">Ambulance</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-icon police-icon"><i class="fas fa-shield-alt"></i></div>
                                <div class="legend-label">Police</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-icon fire-icon"><i class="fas fa-fire-extinguisher"></i></div>
                                <div class="legend-label">Fire Brigade</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-icon distress-icon"></div>
                                <div class="legend-label">Distress Signal</div>
                            </div>
                        `;
                        
                        legend.appendChild(emergencySection);
                        
                        // Add CSS for the legend icons
                        const style = document.createElement('style');
                        style.textContent = `
                            .emergency-services .legend-icon {
                                width: 24px;
                                height: 24px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 16px;
                            }
                            
                            .emergency-services .ambulance-icon {
                                color: #e74c3c;
                            }
                            
                            .emergency-services .police-icon {
                                color: #3498db;
                            }
                            
                            .emergency-services .fire-icon {
                                color: #e67e22;
                            }
                            
                            .emergency-services .distress-icon {
                                background-color: rgba(231, 76, 60, 0.6);
                                border-radius: 50%;
                                position: relative;
                            }
                            
                            .emergency-services .distress-icon:after {
                                content: '';
                                position: absolute;
                                left: 50%;
                                top: 50%;
                                transform: translate(-50%, -50%);
                                width: 12px;
                                height: 12px;
                                border-radius: 50%;
                                background-color: #e74c3c;
                            }
                        `;
                        document.head.appendChild(style);
                    }
                    
                    // Try to add emergency services to legend if it exists
                    setTimeout(addEmergencyServicesToLegend, 1000);
                    
                    console.log("Police and Fire Brigade emergency services added successfully");
                })();
                

