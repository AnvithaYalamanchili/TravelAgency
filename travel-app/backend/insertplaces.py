import sqlite3

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Venu@66691",
            database="travel_db"
        )
        print("✅ Database connection successful!")
        return connection
    except mysql.connector.Error as err:
        print(f"❌ Error: {err}")
        return None


# Insert country data (India)
def insert_data():
    connection = get_db_connection()
    if not connection:
        print("❌ Failed to connect to the database. Exiting...")
        return

    cursor = connection.cursor()

    try:
        # Insert country data (India)
        country_data = {
            "name": "India",
            "description": "Experience India's rich culture, history, and breathtaking landscapes.",
            "detailedDescription": "India is a land of diverse landscapes, cultures, and traditions.",
            "transportation": "Flights from major cities. Private vehicle for local travel.",
            "duration": "7 Days / 6 Nights",
            "accommodation": "3-star & 5-star hotels with breakfast included.",
            "meals": "Indian & Continental cuisine. Breakfast, Lunch & Dinner included.",
            "totalCost": 1200
        }

        cursor.execute("""
        INSERT INTO countries (name, description, detailedDescription, transportation, duration, accommodation, meals, totalCost)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (country_data['name'], country_data['description'], country_data['detailedDescription'],
              country_data['transportation'], country_data['duration'], country_data['accommodation'],
              country_data['meals'], country_data['totalCost']))

        # Get the country_id (for India)
        country_id = cursor.lastrowid

        # Insert state data (Andhra Pradesh, Karnataka, etc.)
        states = ['AndhraPradesh', 'Karnataka', 'HimachalPradesh', 'Goa', 'Delhi', 'Mumbai', 'Varanasi']
        for state in states:
            cursor.execute("INSERT INTO states (name) VALUES (%s)", (state,))

        # Get state_ids
        cursor.execute("SELECT id, name FROM states")
        states_data = cursor.fetchall()
        state_dict = {state[1]: state[0] for state in states_data}

        # Insert place data for each state
        places_data = {
            "AndhraPradesh": [
                {"name": "Visakhapatnam", "price": 200, "image": "/vizag.jpg", "lat": 17.6868, "lon": 83.2185},
                {"name": "Tirupati", "price": 150, "image": "/tirupati.jpg", "lat": 13.6288, "lon": 79.4192},
            ],
            "Karnataka": [
                {"name": "Bangalore", "price": 200, "image": "/bangalore.jpg", "lat": 12.9716, "lon": 77.5946},
                {"name": "Mysore", "price": 160, "image": "/mysore.jpg", "lat": 12.2958, "lon": 76.6394},
            ]
        }

        for state_name, places in places_data.items():
            state_id = state_dict.get(state_name)
            for place in places:
                cursor.execute("""
                INSERT INTO places (country_id, state_id, name, price, image, lat, lon)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (country_id, state_id, place['name'], place['price'], place['image'], place['lat'], place['lon']))

        # Commit changes
        connection.commit()

    except mysql.connector.Error as err:
        print(f"❌ SQL Error: {err}")
    finally:
        cursor.close()
        connection.close()
        print("✅ Database connection closed.")

if __name__ == "__main__":
    insert_data()