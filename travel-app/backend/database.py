# import mysql.connector

# def get_db_connection():
#     try:
#         connection = mysql.connector.connect(
#             host='localhost',
#             user='root',
#             password='Root@123',
#             database='travel_db'
#         )
#         print("Database connection successful!")
#         return connection
#     except mysql.connector.Error as err:
#         print(f"Error: {err}")
#         return None





import mysql.connector

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Root@123",
            database="travel_db"
        )
        print("✅ Database connection successful!")
        return connection
    except mysql.connector.Error as err:
        print(f"❌ Error: {err}")
        return None

def create_tables():
    connection = get_db_connection()
    if not connection:
        print("❌ Failed to connect to the database. Exiting...")
        return
    
    cursor = connection.cursor()

    try:
        # Users Table
        create_users_table = """
        CREATE TABLE IF NOT EXISTS users (
            user_id INT NOT NULL AUTO_INCREMENT,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            username VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            dob DATE NOT NULL,
            passport_number VARCHAR(100) UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            PRIMARY KEY (user_id)
        );
        """

        create_admins_table = """
        CREATE TABLE IF NOT EXISTS admins (
            admin_id INT NOT NULL AUTO_INCREMENT,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            username VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            dob DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            PRIMARY KEY (admin_id)
        );
        """

        create_travel_preferences_table = """
        CREATE TABLE IF NOT EXISTS travel_preferences (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            vacation_type VARCHAR(255),
            trip_duration VARCHAR(255),
            budget VARCHAR(255),
            accommodation VARCHAR(255),
            travel_style VARCHAR(255),
            activities TEXT,
            social_interaction VARCHAR(255),
            sleep_schedule VARCHAR(255),
            sustainability VARCHAR(255),
            companion VARCHAR(255),
            shared_accommodation VARCHAR(255),
            trip_planning VARCHAR(255),
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );
        """

        create_locations_table = """
        CREATE TABLE locations (
            location_id INT AUTO_INCREMENT,
            location_name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL, -- Stores the image file path or URL
            description TEXT NOT NULL,
            PRIMARY KEY (location_id)
        );
        """

        create_places_table = """
        CREATE TABLE IF NOT EXISTS places (
            place_id INT AUTO_INCREMENT PRIMARY KEY,
            location_id INT NOT NULL,
            place_name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL, -- Stores the image file path or URL
            place_overview TEXT NOT NULL,
            features TEXT NOT NULL,
            vacation_type VARCHAR(255),
            trip_duration VARCHAR(255),
            budget VARCHAR(255),
            accommodation VARCHAR(255),
            activities TEXT,
            social_interaction VARCHAR(255),
            time_to_visit VARCHAR(255),
            FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE
        );
        """

        create_user_interactions_table = """
        CREATE TABLE user_interactions (
            interaction_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            place_id INT NOT NULL,
            interaction_type ENUM('like', 'book', 'rate') NOT NULL,
            interaction_value FLOAT DEFAULT NULL,  -- For ratings (e.g., 4.5 stars)
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE
        );    
        """

        create_user_interactions_table = """
        CREATE TABLE matched_users (
            match_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            matched_user_id INT NOT NULL,
            similarity_score FLOAT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (matched_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            UNIQUE(user_id, matched_user_id)  -- Ensures one unique match per user pair
        );
        """

        # Execute table creation queries
        cursor.execute(create_users_table)
        print("✅ Users table created or already exists.")

        cursor.execute(create_admins_table)
        print("✅ Admins table created or already exists.")

        cursor.execute(create_travel_preferences_table)
        print("✅ Travelpreferences table created or already exists.")

        cursor.execute(create_locations_table)
        print("✅ Locations table created or already exists.")

        cursor.execute(create_places_table)
        print("✅ Places table created or already exists.")

        cursor.execute(create_user_interactions_table)
        print("✅ User Interactions table created or already exists.")


        # Commit changes
        connection.commit()

    except mysql.connector.Error as err:
        print(f"❌ SQL Error: {err}")

    finally:
        cursor.close()
        connection.close()
        print("✅ Database connection closed.")

if __name__ == "__main__":
    create_tables()
