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
            password="Venu@66691",
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
        ) ENGINE=InnoDB;
        """

        # Admins Table
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
        ) ENGINE=InnoDB;
        """

        # Travel Preferences Table
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
        # Locations Table
        create_locations_table = """
        CREATE TABLE IF NOT EXISTS locations (
            location_id INT AUTO_INCREMENT,
            location_name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            PRIMARY KEY (location_id)
        ) ENGINE=InnoDB;
        """

        # Places Table
        create_places_table = """
        CREATE TABLE IF NOT EXISTS places (
            place_id INT AUTO_INCREMENT PRIMARY KEY,
            location_id INT NOT NULL,
            place_name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
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
        ) ENGINE=InnoDB;
        """

        # User Interactions Table
        create_user_interactions_table = """
        CREATE TABLE IF NOT EXISTS user_interactions (
            interaction_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            place_id INT NOT NULL,
            interaction_type ENUM('like', 'book', 'rate') NOT NULL,
            interaction_value FLOAT DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
        """

        # Matched Users Table
        create_matched_users_table = """
        CREATE TABLE IF NOT EXISTS matched_users (
            match_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            matched_user_id INT NOT NULL,
            similarity_score FLOAT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (matched_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            UNIQUE(user_id, matched_user_id)
        ) ENGINE=InnoDB;
        """

        create_chat_messages= """
        CREATE TABLE IF NOT EXISTS chat_messages (
            message_id INT AUTO_INCREMENT PRIMARY KEY,
            sender_id INT NOT NULL,
            receiver_id INT NOT NULL,
            message TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users(user_id),
            FOREIGN KEY (receiver_id) REFERENCES users(user_id),
            INDEX idx_sender_receiver (sender_id, receiver_id),
            INDEX idx_timestamp (timestamp)
        );
        """

        create_interest_requests="""
        CREATE TABLE IF NOT EXISTS interest_requests (
            request_id INT AUTO_INCREMENT PRIMARY KEY,
            sender_id INT NOT NULL,
            receiver_id INT NOT NULL,
            status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users(user_id),
            FOREIGN KEY (receiver_id) REFERENCES users(user_id),
            UNIQUE KEY uk_sender_receiver (sender_id, receiver_id),
            INDEX idx_receiver_status (receiver_id, status),
            INDEX idx_sender_status (sender_id, status)
        );
        """
        #Travel History Table
        create_travel_history_table = """
        CREATE TABLE IF NOT EXISTS travel_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            destination VARCHAR(255) NOT NULL,
            country VARCHAR(255) NOT NULL,
            nights INT NOT NULL,
            departure DATE NOT NULL,
            return_date DATE NOT NULL,
            people VARCHAR(50) NOT NULL,
            cost DECIMAL(10,2) NOT NULL
        ) ENGINE=InnoDB;
        """

        # Ongoing Trips Table
        create_ongoing_trips_table = """
        CREATE TABLE IF NOT EXISTS ongoing_trips (
            id INT AUTO_INCREMENT PRIMARY KEY,
            destination VARCHAR(255) NOT NULL,
            country VARCHAR(255) NOT NULL,
            nights INT NOT NULL,
            departure DATE NOT NULL,
            return_date DATE NOT NULL,
            people VARCHAR(50) NOT NULL,
            cost DECIMAL(10,2) NOT NULL
        ) ENGINE=InnoDB;
        """

        # Analytics Table
        create_analytics_table = """
        CREATE TABLE IF NOT EXISTS analytics (
            id INT AUTO_INCREMENT PRIMARY KEY,
            total INT NOT NULL,
            confirmed INT NOT NULL,
            pending INT NOT NULL,
            canceled INT NOT NULL
        ) ENGINE=InnoDB;
        """

        # Financial Data Table
        create_financial_data_table = """
        CREATE TABLE IF NOT EXISTS financial_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            total_profit DECIMAL(15,2) NOT NULL,
            total_revenue DECIMAL(15,2) NOT NULL,
            total_visitors INT NOT NULL,
            expense DECIMAL(15,2) NOT NULL
        ) ENGINE=InnoDB;
        """

        # Archived Trips Table
        create_archived_trips_table = """
        CREATE TABLE IF NOT EXISTS archived_trips (
            id INT AUTO_INCREMENT PRIMARY KEY,
            destination VARCHAR(255) NOT NULL,
            country VARCHAR(255) NOT NULL,
            nights INT NOT NULL,
            departure DATE NOT NULL,
            return_date DATE NOT NULL,
            people VARCHAR(50) NOT NULL,
            cost DECIMAL(10,2) NOT NULL
        ) ENGINE=InnoDB;
        """

        create_countries_table="""
        CREATE TABLE IF NOT EXISTS countries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        detailedDescription TEXT,
        transportation TEXT,
        duration TEXT,
        accommodation TEXT,
        meals TEXT,
        totalCost INTEGER
        );
        """

        create_states_table="""
        CREATE TABLE IF NOT EXISTS states (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        image TEXT,
        );
        """

        create_places_table="""
        CREATE TABLE places (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country_id INTEGER,
        state_id INTEGER,
        name TEXT,
        price INTEGER,
        image TEXT,
        lat REAL,
        lon REAL,
        FOREIGN KEY (country_id) REFERENCES countries(id),
        FOREIGN KEY (state_id) REFERENCES states(id)
        );
        """

        # Execute table creation queries
        cursor.execute(create_users_table)
        print("✅ Users table created or already exists.")

        cursor.execute(create_admins_table)
        print("✅ Admins table created or already exists.")

        cursor.execute(create_travel_preferences_table)
        print("✅ Travel Preferences table created or already exists.")

        cursor.execute(create_locations_table)
        print("✅ Locations table created or already exists.")

        cursor.execute(create_places_table)
        print("✅ Places table created or already exists.")

        cursor.execute(create_spots_table)
        print("✅ Spots table created or already exists.")

        cursor.execute(create_user_interactions_table)
        print("✅ User Interactions table created or already exists.")

        cursor.execute(create_matched_users_table)
        print("✅ Matched Users table created or already exists.")

        cursor.execute(create_chat_messages)
        print("✅ Chat messages table created or already exists.")

        cursor.execute(create_interest_requests)
        print("✅ interest requests table created or already exists.")

        cursor.execute(create_travel_history_table)
        print("✅ Travel History table created or already exists.")

        cursor.execute(create_ongoing_trips_table)
        print("✅ Ongoing Trips table created or already exists.")

        cursor.execute(create_analytics_table)
        print("✅ Analytics table created or already exists.")

        cursor.execute(create_financial_data_table)
        print("✅ Financial Data table created or already exists.")

        cursor.execute(create_archived_trips_table)
        print("✅ Archived Trips table created or already exists.")




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
