from flask import Flask, request, render_template, jsonify
import sqlite3
import os

app = Flask(__name__)

# Function to initialize the database
def initialize_database():
    # Check if database file exists
    db_exists = os.path.exists("emergency_locator.db")
    
    with sqlite3.connect("emergency_locator.db") as conn:
        cursor = conn.cursor()
        
        # Create the emergency_services table if it doesn't exist
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS emergency_services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            amenity_type TEXT NOT NULL,
            lat REAL NOT NULL,
            lon REAL NOT NULL
        )
        ''')
        
        # If this is a new database, populate it with sample data
        if not db_exists:
            sample_services = [
                ('Mumbai General Hospital', 'hospital', 19.0760, 72.8777),
                ('Pune Medical Center', 'hospital', 18.5204, 73.8567),
                ('Mumbai Fire Station', 'fire_station', 19.0330, 72.8656),
                ('Nagpur Police HQ', 'police', 21.1458, 79.0882),
                ('Nashik Emergency Center', 'hospital', 19.9975, 73.7898),
                ('Thane Ambulance Service', 'ambulance', 19.2183, 72.9781),
                ('Aurangabad Medical Center', 'hospital', 19.8762, 75.3433)
            ]
            
            cursor.executemany(
                "INSERT INTO emergency_services (name, amenity_type, lat, lon) VALUES (?, ?, ?, ?)",
                sample_services
            )
            
            conn.commit()

# Function to fetch emergency services from SQLite database
def get_emergency_services():
    with sqlite3.connect("emergency_locator.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name, amenity_type, lat, lon FROM emergency_services")
        services = cursor.fetchall()

    # Convert to JSON format
    return [
        {"name": row[0], "type": row[1], "lat": float(row[2]), "lon": float(row[3])}
        for row in services
    ]

# Function to fetch accident-prone areas from database
def get_accident_prone_areas():
    # In a real implementation, this would fetch from a database
    # For now, using sample data for Maharashtra
    accident_prone_areas = [
        {"id": 1, "lat": 19.0760, "lon": 72.8777, "severity": "high", "name": "Dadar Junction", "accidents_count": 45},
        {"id": 2, "lat": 19.0330, "lon": 72.8656, "severity": "high", "name": "Haji Ali Junction", "accidents_count": 38},
        {"id": 3, "lat": 19.1176, "lon": 72.9060, "severity": "medium", "name": "Eastern Express Highway", "accidents_count": 29},
        {"id": 4, "lat": 18.5204, "lon": 73.8567, "severity": "high", "name": "Pune University Circle", "accidents_count": 42},
        {"id": 5, "lat": 18.9220, "lon": 72.8347, "severity": "medium", "name": "Mumbai-Pune Expressway", "accidents_count": 31},
        {"id": 6, "lat": 21.1458, "lon": 79.0882, "severity": "medium", "name": "Nagpur Ring Road", "accidents_count": 25},
        {"id": 7, "lat": 19.9975, "lon": 73.7898, "severity": "low", "name": "Nashik Highway", "accidents_count": 18}
    ]
    return accident_prone_areas

# Sample emergency units data (this would normally come from a database)
emergency_units = [
    {"id": 1, "lat": 19.076, "lon": 72.877, "type": "ambulance", "name": "Mumbai Ambulance Unit 101", "contact": "+911234567890", "eta": 5},
    {"id": 2, "lat": 19.042, "lon": 72.853, "type": "police", "name": "Mumbai Police Unit Alpha", "contact": "+911002003004", "eta": 3},
    {"id": 3, "lat": 18.520, "lon": 73.856, "type": "fire", "name": "Pune Fire Brigade Unit 3", "contact": "+911122334455", "eta": 7},
    {"id": 4, "lat": 18.510, "lon": 73.872, "type": "hospital", "name": "Pune City Hospital", "contact": "+919988776655", "eta": 0},
    {"id": 5, "lat": 21.146, "lon": 79.088, "type": "ambulance", "name": "Nagpur Ambulance Service", "contact": "+917766554433", "eta": 6},
    {"id": 6, "lat": 19.997, "lon": 73.789, "type": "police", "name": "Nashik Police Unit", "contact": "+916677889900", "eta": 4},
    {"id": 7, "lat": 19.877, "lon": 75.343, "type": "hospital", "name": "Aurangabad Medical Center", "contact": "+912233445566", "eta": 0}
]

# Route to serve the main HTML page
@app.route('/')
def index():
    return render_template('index.html')

# Route to display emergency services on the map
@app.route('/map')
def map():
    emergency_services = get_emergency_services()
    accident_areas = get_accident_prone_areas()
    return render_template('map.html', services=emergency_services, accident_areas=accident_areas)

# Route to get accident-prone areas as JSON
@app.route('/accident_prone_areas')
def accident_prone_areas():
    areas = get_accident_prone_areas()
    return jsonify({
        "status": "success",
        "data": areas
    })

# Route to handle "Report Emergency"
@app.route('/report_emergency', methods=['POST'])
def report_emergency():
    data = request.get_json()
    lat = data.get('lat')
    lon = data.get('lon')
    
    # Find nearest emergency units (simple implementation)
    nearest_units = sorted(emergency_units, key=lambda unit: (
        (unit['lat'] - lat) ** 2 + (unit['lon'] - lon) ** 2
    ))[:3]  # Get top 3 nearest units
    
    return jsonify({
        "status": "success",
        "message": "Emergency reported successfully!",
        "nearest_units": nearest_units
    })

# Route to handle "Send Distress Message"
@app.route('/send_distress', methods=['POST'])
def send_distress():
    data = request.get_json()
    lat = data.get('lat')
    lon = data.get('lon')
    
    return jsonify({
        "status": "success", 
        "message": "Distress message prepared",
        "distress_text": f"EMERGENCY! I need help! My location: https://www.google.com/maps?q={lat},{lon}"
    })

# Route to handle location search
@app.route('/search_location', methods=['GET'])
def search_location():
    query = request.args.get('query')
    return jsonify({
        "status": "success",
        "message": f"Search complete for: {query}"
    })

# Route for the about page - Fix the endpoint conflict by using a different function name
@app.route('/about')
def about():  # Changed function name to match what templates are expecting
    return render_template('about.html')

# Add any other routes that might be causing conflicts
# Make sure each route function has a unique name

if __name__ == '__main__':
    # Initialize the database before running the app
    initialize_database()
    app.run(debug=True)