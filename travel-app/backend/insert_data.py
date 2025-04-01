import mysql.connector

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Venu@66691",
            database="travel_db"
        )
        return connection
    except mysql.connector.Error as err:
        print(f"❌ Error: {err}")
        return None

def insert_admin_data():
    connection = get_db_connection()
    if not connection:
        print("❌ Failed to connect to the database.")
        return

    cursor = connection.cursor()

    try:
        # Insert Travel History Data
        travel_history = [
            ("Great Wall of China", "China", "5 Nights", "10 Jan, 2023", "16 Jan, 2023", "2 Adults", "$124"),
            ("Taj Mahal", "India", "4 Nights", "08 Dec, 2023", "21 Dec, 2023", "2 Adults", "$140"),
            ("Niagara Falls", "Canada", "12 Nights", "11 Dec, 2023", "11 Dec, 2023", "5 Adults", "$560"),
            ("Great Barrier Reef", "Australia", "3 Nights", "22 Dec, 2023", "25 Dec, 2023", "2 Adults", "$200"),
            ("Pyramids of Giza", "Egypt", "4 Nights", "24 Dec, 2023", "28 Dec, 2023", "3 Adults", "$90")
        ]
        cursor.executemany(
            "INSERT INTO travel_history (destination, country, nights, departure, return_date, people, cost) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            travel_history
        )

        # Insert Ongoing Trips Data
        ongoing_trips = [
            ("Eiffel Tower", "France", "6 Nights", "01 Mar, 2025", "06 Mar, 2025", "4 Adults", "$350"),
            ("Machu Picchu", "Peru", "7 Nights", "02 Mar, 2025", "09 Mar, 2025", "3 Adults", "$600"),
            ("Santorini", "Greece", "5 Nights", "05 Mar, 2025", "10 Mar, 2025", "2 Adults", "$500")
        ]
        cursor.executemany(
            "INSERT INTO ongoing_trips (destination, country, nights, departure, return_date, people, cost) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            ongoing_trips
        )

        # Insert Analytics Data
        analytics = (250, 70, 18, 12)
        cursor.execute(
            "INSERT INTO analytics (total, confirmed, pending, canceled) VALUES (%s, %s, %s, %s)",
            analytics
        )

        # Insert Financial Data
        financial = ("$52,329", "$78,200", "22,500", "$29.2k")
        cursor.execute(
            "INSERT INTO financial_data (total_profit, total_revenue, total_visitors, expense) VALUES (%s, %s, %s, %s)",
            financial
        )

        

        # Commit changes
        connection.commit()
        print("✅ Admin data inserted successfully!")

    except mysql.connector.Error as err:
        print(f"❌ SQL Error: {err}")

    finally:
        cursor.close()
        connection.close()
        print("✅ Database connection closed.")

if __name__ == "__main__":
    insert_admin_data()
