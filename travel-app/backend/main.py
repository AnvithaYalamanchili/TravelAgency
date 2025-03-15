# from fastapi import FastAPI, HTTPException, UploadFile, File, Form
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import mysql.connector
# from database import get_db_connection  # Assuming this function is defined in 'database.py'
# import bcrypt
# import face_recognition
# import numpy as np
# import io
# import logging

# app = FastAPI()
# logging.basicConfig(level=logging.INFO)
# # Add CORS middleware to allow requests from specific origins
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # Only allow your frontend to communicate
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )



# class TravelPreferences(BaseModel):
#     user_id: int
#     vacation_type: str
#     trip_duration: str
#     budget: str
#     accommodation: str
#     travel_style: str
#     activities: str
#     social_interaction: str
#     sleep_schedule: str
#     sustainability: str
#     companion: str
#     shared_accommodation: str
#     trip_planning: str


# # Define the user model (registration)
# class User(BaseModel):
#     first_name: str
#     last_name: str
#     dob: str  # Date of Birth (YYYY-MM-DD)
#     passport_number: str
#     email: str
#     username: str
#     password: str

# class LoginUser(BaseModel):
#     email: str
#     password: str

# @app.get("/")
# def read_root():
#     return {"message": "Welcome to the Travel App Backend"}

# @app.post("/register")
# async def register(user: User):
#     connection = get_db_connection()
#     cursor = connection.cursor()

#     try:
#         # Check if user already exists
#         cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
#         existing_user = cursor.fetchone()
#         if existing_user:
#             raise HTTPException(status_code=400, detail="User already exists.")
        
#         # Hash password
#         hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

#         # Insert user into database **only after successful face verification**
#         cursor.execute(
#             """INSERT INTO users 
#                (first_name, last_name, dob, passport_number, email, username, password) 
#                VALUES (%s, %s, %s, %s, %s, %s, %s)""",
#             (user.first_name, user.last_name, user.dob, user.passport_number, user.email, user.username, hashed_password)
#         )
#         connection.commit()

#         return {"message": "Registration successful!"}
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error during registration: {e}")
    
#     finally:
#         cursor.close()
#         connection.close()



# @app.post("/login")
# async def login(user: LoginUser):
#     connection = get_db_connection()  # Get DB connection from 'database.py'
#     cursor = connection.cursor()

#     try:
#         cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
#         existing_user = cursor.fetchone()

#         if not existing_user:
#             raise HTTPException(status_code=401, detail="Invalid credentials.")

#         # Extract user_id and password
#         user_id = existing_user[0]  # Assuming user_id is the first column in your 'users' table
#         stored_password = existing_user[7].encode('utf-8')  # Now password is at index 7 (based on your schema)

#         if not bcrypt.checkpw(user.password.encode('utf-8'), stored_password):
#             raise HTTPException(status_code=401, detail="Invalid credentials.")

#         # Log the user ID
#         logging.info(f"User ID: {user_id}")

#         # Return user_id as part of the response
#         return {"message": "Login successful!", "user_id": user_id}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error during login: {e}")

#     finally:
#         cursor.close()
#         connection.close()




# @app.post("/verify-face")
# async def verify_face(passport_image: UploadFile = File(...), selfie_image: UploadFile = File(...)):
#     try:
#         # Read images as bytes
#         passport_bytes = await passport_image.read()
#         selfie_bytes = await selfie_image.read()

#         # Load images into face_recognition
#         passport_img = face_recognition.load_image_file(io.BytesIO(passport_bytes))
#         selfie_img = face_recognition.load_image_file(io.BytesIO(selfie_bytes))

#         # Get face encodings
#         passport_encoding = face_recognition.face_encodings(passport_img)
#         selfie_encoding = face_recognition.face_encodings(selfie_img)

#         # Ensure faces were detected
#         if len(passport_encoding) == 0 or len(selfie_encoding) == 0:
#             raise HTTPException(status_code=400, detail="No face detected in one or both images.")

#         # Compare faces
#         match = face_recognition.compare_faces([passport_encoding[0]], selfie_encoding[0])[0]

#         # Explicitly convert numpy.bool_ to Python boolean
#         match = bool(match)

#         return {"message": "Face verification successful!" if match else "Face verification failed!", "verified": match}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing images: {e}")


# @app.post("/travel-preferences")
# async def save_travel_preferences(preferences: TravelPreferences):
#     connection = get_db_connection()
#     cursor = connection.cursor()

#     try:
#         # Log the user_id for debugging
#         logging.info(f"Saving preferences for User ID: {preferences.user_id}")

#         # Check if preferences already exist for this user
#         cursor.execute("SELECT * FROM travel_preferences WHERE user_id = %s", (preferences.user_id,))
#         existing_preferences = cursor.fetchone()

#         if existing_preferences:
#             raise HTTPException(status_code=400, detail="Preferences already saved for this user.")

#         # Insert the preferences along with the user ID
#         cursor.execute(
#          """INSERT INTO travel_preferences 
#             (user_id, vacation_type, trip_duration, budget, accommodation, travel_style, activities,
#             social_interaction, sleep_schedule, sustainability, companion, shared_accommodation, trip_planning) 
#             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
#         (preferences.user_id, preferences.vacation_type, preferences.trip_duration, preferences.budget,
#         preferences.accommodation, preferences.travel_style, preferences.activities,
#         preferences.social_interaction, preferences.sleep_schedule, preferences.sustainability,
#         preferences.companion, preferences.shared_accommodation, preferences.trip_planning)
#         )

#         connection.commit()
#         return {"message": "Travel preferences saved successfully!"}

#     except Exception as e:
#         logging.error(f"Error saving preferences: {e}")  # Log error for debugging
#         raise HTTPException(status_code=500, detail=f"Error saving preferences: {e}")
    
#     finally:
#         cursor.close()
#         connection.close()








from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from database import get_db_connection  # Ensure this function is correctly implemented
import bcrypt
import uvicorn
import face_recognition
import numpy as np
import io
import logging
from fastapi import HTTPException
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics.pairwise import cosine_similarity


app = FastAPI(title="Voyagers")
logging.basicConfig(level=logging.INFO)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# User Registration Model
class User(BaseModel):
    first_name: str
    last_name: str
    dob: str
    passport_number: str
    email: str
    username: str
    password: str

class LoginUser(BaseModel):
    email: str
    password: str

class TravelPreferences(BaseModel):
    user_id: int
    vacation_type: str
    trip_duration: str
    budget: str
    accommodation: str
    travel_style: str
    activities: str
    social_interaction: str
    sleep_schedule: str
    sustainability: str
    companion: str
    shared_accommodation: str
    trip_planning: str


class Admin(BaseModel):
    first_name: str
    last_name:str
    dob:str
    email:str
    username:str
    password:str


class AdninLogin(BaseModel):
    username: str
    password: str


# Location model
class Location(BaseModel):
    location_name: str
    image: str
    description: str

# Place model
class Place(BaseModel):
    place_name: str
    location_id: str
    image: str
    place_overview: str
    features: str
    vacation_type: str
    trip_duration: str
    budget: str
    accommodation: str
    activities: str
    social_interaction: str
    time_to_visit: str

# Pydantic model for interaction input
class InteractionInput(BaseModel):
    user_id: int
    place_id: int
    interaction_type: str  # 'like', 'book', or 'rate'
    interaction_value: float = None  # Optional (only for ratings)


@app.get("/")
async def docs_redirect():
    """Redirect to API documentation."""
    return RedirectResponse(url="/docs")

@app.post("/register")
async def register(user: User):
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed.")

    cursor = connection.cursor()

    try:
        # Check if user already exists
        cursor.execute("SELECT user_id FROM users WHERE email = %s OR username = %s", (user.email, user.username))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="User already exists.")

        # Hash password
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Insert user
        cursor.execute(
            """INSERT INTO users (first_name, last_name, dob, passport_number, email, username, password) 
               VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (user.first_name, user.last_name, user.dob, user.passport_number, user.email, user.username, hashed_password)
        )
        connection.commit()

        # Get the user_id of the newly inserted user
        cursor.execute("SELECT LAST_INSERT_ID()")
        user_id = cursor.fetchone()[0]

        return {"message": "Registration successful!", "user_id": user_id}

    except Exception as e:
        logging.error(f"Error during registration: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    finally:
        cursor.close()
        connection.close()

@app.post("/login")
async def login(user: LoginUser):
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed.")

    cursor = connection.cursor()

    try:
        cursor.execute("SELECT user_id, first_name, password FROM users WHERE email = %s", (user.email,))
        existing_user = cursor.fetchone()

        if not existing_user:
            raise HTTPException(status_code=401, detail="Invalid credentials.")

        user_id, first_name, stored_password = existing_user

        if not bcrypt.checkpw(user.password.encode('utf-8'), stored_password.encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid credentials.")

        # Send the user's first name and user_id along with the login response
        return {"message": "Login successful!", "user_id": user_id, "first_name": first_name}

    except Exception as e:
        logging.error(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    finally:
        cursor.close()
        connection.close()


@app.post("/verify-face")
async def verify_face(passport_image: UploadFile = File(...), selfie_image: UploadFile = File(...)):
    try:
        # Read images
        passport_bytes = await passport_image.read()
        selfie_bytes = await selfie_image.read()

        # Load images
        passport_img = face_recognition.load_image_file(io.BytesIO(passport_bytes))
        selfie_img = face_recognition.load_image_file(io.BytesIO(selfie_bytes))

        # Get face encodings
        passport_encoding = face_recognition.face_encodings(passport_img)
        selfie_encoding = face_recognition.face_encodings(selfie_img)

        if not passport_encoding or not selfie_encoding:
            raise HTTPException(status_code=400, detail="No face detected in one or both images.")

        # Compare faces
        match = bool(face_recognition.compare_faces([passport_encoding[0]], selfie_encoding[0])[0])

        return {"message": "Face verification successful!" if match else "Face verification failed!", "verified": match}

    except Exception as e:
        logging.error(f"Error processing images: {e}")
        raise HTTPException(status_code=500, detail="Error processing images")


@app.post("/travel-preferences")
async def save_travel_preferences(preferences: TravelPreferences):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        logging.info(f"Saving preferences for User ID: {preferences.user_id}")

        # Check if the user exists in the 'users' table
        cursor.execute("SELECT * FROM users WHERE user_id = %s", (preferences.user_id,))
        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="User not found.")

        # Check if preferences already exist for this user
        cursor.execute("SELECT * FROM travel_preferences WHERE user_id = %s", (preferences.user_id,))
        existing_preferences = cursor.fetchone()

        if existing_preferences:
            raise HTTPException(status_code=400, detail="Preferences already saved for this user.")

        # Insert preferences into database
        cursor.execute(
            """INSERT INTO travel_preferences 
               (user_id, vacation_type, trip_duration, budget, accommodation, travel_style, activities,
               social_interaction, sleep_schedule, sustainability, companion, shared_accommodation, trip_planning) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (preferences.user_id, preferences.vacation_type, preferences.trip_duration, preferences.budget,
             preferences.accommodation, preferences.travel_style, preferences.activities,
             preferences.social_interaction, preferences.sleep_schedule, preferences.sustainability,
             preferences.companion, preferences.shared_accommodation, preferences.trip_planning)
        )

        connection.commit()
        return {"message": "Travel preferences saved successfully!"}

    except Exception as e:
        logging.error(f"Error saving preferences: {e}")
        raise HTTPException(status_code=500, detail=f"Error saving preferences: {e}")

    finally:
        cursor.close()
        connection.close()


@app.get("/matched-users/{user_id}")
async def get_matched_users(user_id: int):
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed.")

    cursor = connection.cursor()

    try:
        # Fetch the logged-in user's details along with their travel preferences
        cursor.execute("""
            SELECT u.user_id, u.first_name, u.last_name, tp.vacation_type, tp.trip_duration, tp.budget,
                   tp.accommodation, tp.travel_style, tp.activities, tp.social_interaction, tp.sleep_schedule,
                   tp.sustainability, tp.companion, tp.shared_accommodation, tp.trip_planning
            FROM users u
            JOIN travel_preferences tp ON u.user_id = tp.user_id
            WHERE u.user_id = %s
        """, (user_id,))
        logged_in_user = cursor.fetchone()

        if not logged_in_user:
            raise HTTPException(status_code=404, detail="User preferences not found.")

        # Map the logged-in user data to a dictionary
        logged_in_user_dict = {
            "user_id": logged_in_user[0],  # user_id
            "first_name": logged_in_user[1],  # first_name
            "last_name": logged_in_user[2],  # last_name
            "vacation_type": logged_in_user[3],  # vacation_type
            "trip_duration": logged_in_user[4],  # trip_duration
            "budget": logged_in_user[5],  # budget
            "accommodation": logged_in_user[6],  # accommodation
            "travel_style": logged_in_user[7],  # travel_style
            "activities": logged_in_user[8],  # activities
            "social_interaction": logged_in_user[9],  # social_interaction
            "sleep_schedule": logged_in_user[10],  # sleep_schedule
            "sustainability": logged_in_user[11],  # sustainability
            "companion": logged_in_user[12],  # companion
            "shared_accommodation": logged_in_user[13],  # shared_accommodation
            "trip_planning": logged_in_user[14],  # trip_planning
        }

        # Preprocess the logged-in user's preferences
        logged_in_user_processed = preprocess_preferences(logged_in_user_dict)

        # Prepare data for similarity calculation
        logged_in_preferences = np.array(list(logged_in_user_processed.values())[3:])  # Exclude user_id, first_name, last_name

        # Fetch other users' details along with their preferences
        cursor.execute("""
            SELECT u.user_id, u.first_name, u.last_name, tp.vacation_type, tp.trip_duration, tp.budget,
                   tp.accommodation, tp.travel_style, tp.activities, tp.social_interaction, tp.sleep_schedule,
                   tp.sustainability, tp.companion, tp.shared_accommodation, tp.trip_planning
            FROM users u
            JOIN travel_preferences tp ON u.user_id = tp.user_id
            WHERE u.user_id != %s
        """, (user_id,))
        other_users = cursor.fetchall()

        matched_users = []

        # Loop through other users and calculate similarity
        for user in other_users:
            user_dict = {
                "user_id": user[0],  # user_id
                "first_name": user[1],  # first_name
                "last_name": user[2],  # last_name
                "vacation_type": user[3],
                "trip_duration": user[4],
                "budget": user[5],
                "accommodation": user[6],
                "travel_style": user[7],
                "activities": user[8],
                "social_interaction": user[9],
                "sleep_schedule": user[10],
                "sustainability": user[11],
                "companion": user[12],
                "shared_accommodation": user[13],
                "trip_planning": user[14],
            }

            # Preprocess the other user's preferences
            user_processed = preprocess_preferences(user_dict)

            # Prepare user preferences for similarity calculation
            user_preferences = np.array(list(user_processed.values())[3:])  # Exclude user_id, first_name, last_name
            similarity = cosine_similarity([logged_in_preferences], [user_preferences])[0][0]

            matched_users.append({
                "user_id": user[0],
                "first_name": user[1],
                "last_name": user[2],
                "similarity_score": similarity
            })

        # Sort matched users based on similarity score
        matched_users.sort(key=lambda x: x["similarity_score"], reverse=True)

        top_matches = matched_users[:5]

        # Save matches in the database
        for match in top_matches:
            cursor.execute("""
            SELECT 1 FROM matched_users WHERE user_id = %s AND matched_user_id = %s
            """, (user_id, match["user_id"]))
            
            exists = cursor.fetchone()

            if not exists:  # Insert only if the pair doesn't exist
                cursor.execute("""
                INSERT INTO matched_users (user_id, matched_user_id, similarity_score)
                VALUES (%s, %s, %s)
                """, (user_id, match["user_id"], match["similarity_score"]))

        connection.commit()
        # Return the top 5 matched users
        return top_matches

    except Exception as e:
        logging.error(f"Error fetching matched users: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")



le = LabelEncoder()

def preprocess_preferences(preferences):
    categorical_columns = [
        'vacation_type', 'accommodation', 'travel_style', 'activities', 'social_interaction',
        'sleep_schedule', 'sustainability', 'companion', 'shared_accommodation', 'trip_planning', 'trip_duration', 'budget'
    ]

    for col in categorical_columns:
        if preferences.get(col) is not None:  
            all_values = get_all_possible_values_from_db(col) 
            le.fit(all_values)  
            preferences[col] = le.transform([preferences[col]])[0]  

    return preferences

def get_all_possible_values_from_db(column):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(f"SELECT DISTINCT {column} FROM travel_preferences")
    values = [row[0] for row in cursor.fetchall()]
    cursor.close()
    connection.close()
    return values


@app.post("/admin-register")
async def register_admin(admin: Admin):
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed.")

    cursor = connection.cursor()

    try:
        # Check if admin already exists
        cursor.execute("SELECT admin_id FROM admins WHERE email = %s OR username = %s", (admin.email, admin.username))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Admin already exists.")

        # Hash password
        hashed_password = bcrypt.hashpw(admin.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Insert admin (admin_id is auto-incremented)
        cursor.execute(
            """INSERT INTO admins (first_name, last_name, email, username, password, dob) 
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (admin.first_name, admin.last_name, admin.email, admin.username, hashed_password, admin.dob)
        )
        connection.commit()

        # Retrieve the newly inserted admin ID
        cursor.execute("SELECT admin_id, created_at FROM admins WHERE email = %s", (admin.email,))
        new_admin = cursor.fetchone()

        return {
            "message": "Admin registration successful!",
            "admin_id": new_admin[0],
            "created_at": new_admin[1],
        } 

    except Exception as e:
        logging.error(f"Error during admin registration: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    finally:
        cursor.close()
        connection.close()


@app.post("/admin-login")
async def admin_login(admin: AdninLogin):
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed.")
    
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT admin_id, first_name, password FROM admins WHERE username = %s", (admin.username,))
        existing_user = cursor.fetchone()

        if not existing_user:
            raise HTTPException(status_code=401, detail="Invalid credentials.")

        admin_id, first_name, stored_password = existing_user

        if not bcrypt.checkpw(admin.password.encode('utf-8'), stored_password.encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid credentials.")

        # Send the admin's first name and admin_id along with the login response
        return {"message": "Login successful!", "admin_id": admin_id, "first_name": first_name}

    except Exception as e:
        logging.error(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    finally:
        cursor.close()
        connection.close()


# Fetch all locations
@app.get("/locations")
async def get_locations():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM locations")
        locations = cursor.fetchall()
        return {"locations": locations}
    finally:
        cursor.close()
        connection.close()

# Fetch a single location by ID
@app.get("/locations/{location_id}")
async def get_location(location_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM locations WHERE location_id = %s", (location_id,))
        location = cursor.fetchone()
        if not location:
            raise HTTPException(status_code=404, detail="Location not found")
        return location
    finally:
        cursor.close()
        connection.close()

# Add a new location (or update if exists)
@app.post("/locations")
async def add_location(location: Location):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Check if location already exists
        cursor.execute("SELECT location_id FROM locations WHERE location_name = %s", (location.location_name,))
        existing_location = cursor.fetchone()

        if existing_location:
            raise HTTPException(
                status_code=400,
                detail="Location already exists. Do you want to update it?"
            )

        # Insert new location
        cursor.execute(
            "INSERT INTO locations (location_name, image, description) VALUES (%s, %s, %s)",
            (location.location_name, location.image, location.description)
        )
        connection.commit()
        return {"message": "Location added successfully!"}

    finally:
        cursor.close()
        connection.close()

# Update an existing location
@app.put("/locations/{location_id}")
async def update_location(location_id: int, location: Location):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT location_id FROM locations WHERE location_id = %s", (location_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Location not found")

        cursor.execute(
            "UPDATE locations SET location_name = %s, image = %s, description = %s WHERE location_id = %s",
            (location.location_name, location.image, location.description, location_id)
        )
        connection.commit()
        return {"message": "Location updated successfully!"}
    
    finally:
        cursor.close()
        connection.close()

# Delete a location
@app.delete("/locations/{location_id}")
async def delete_location(location_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT location_id FROM locations WHERE location_id = %s", (location_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Location not found")

        cursor.execute("DELETE FROM locations WHERE location_id = %s", (location_id,))
        connection.commit()
        return {"message": "Location deleted successfully!"}
    
    finally:
        cursor.close()
        connection.close()


# Fetch all places
@app.get("/places")
async def get_places():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM places")
        places = cursor.fetchall()
        return {"places": places}
    finally:
        cursor.close()
        connection.close()

# Fetch a single place by ID
@app.get("/places/{place_id}")
async def get_place(place_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM places WHERE place_id = %s", (place_id,))
        place = cursor.fetchone()
        if not place:
            raise HTTPException(status_code=404, detail="Place not found")
        return place
    finally:
        cursor.close()
        connection.close()

# Add a new place (or update if exists)
@app.post("/places")
async def add_place(place: Place):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Check if location already exists
        cursor.execute("SELECT place_id FROM places WHERE place_name = %s", (place.place_name,))
        existing_place = cursor.fetchone()

        if existing_place:
            raise HTTPException(
                status_code=400,
                detail="Place already exists. Do you want to update it?"
            )

        # Insert new place
        cursor.execute(
            """INSERT INTO places 
               (place_name, location_id, image, place_overview, features, vacation_type, 
                trip_duration, budget, accommodation, activities, social_interaction, time_to_visit) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (place.place_name, place.location_id, place.image, place.place_overview, place.features, 
             place.vacation_type, place.trip_duration, place.budget, place.accommodation, 
             place.activities, place.social_interaction, place.time_to_visit)
        )

        connection.commit()
        return {"message": "Place added successfully!"}

    finally:
        cursor.close()
        connection.close()

# Update an existing place
@app.put("/places/{place_id}")
async def update_place(place_id: int, place: Place):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT place_id FROM places WHERE place_id = %s", (place_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Place not found")

        cursor.execute(
            "UPDATE places SET place_name = %s, location_id = %s, image = %s, place_overview = %s, features = %s, vacation_type = %s, trip_duration = %s, budget = %s, accommodation = %s, activities = %s, social_interaction = %s, time_to_visit = %s WHERE place_id = %s",
            (place.place_name, place.location_id, place.image, place.place_overview, place.features, place.vacation_type, place.trip_duration, place.budget, place.accommodation, place.activities, place.social_interaction, place.time_to_visit, place_id)
        )
        connection.commit()
        return {"message": "Place updated successfully!"}
    
    finally:
        cursor.close()
        connection.close()

# Delete a place
@app.delete("/places/{place_id}")
async def delete_place(place_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT place_id FROM places WHERE place_id = %s", (place_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="place not found")

        cursor.execute("DELETE FROM places WHERE place_id = %s", (place_id,))
        connection.commit()
        return {"message": "Place deleted successfully!"}
    
    finally:
        cursor.close()
        connection.close()


@app.post("/interactions/")
async def log_interaction(interaction: InteractionInput):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Insert interaction into database
        cursor.execute("""
            INSERT INTO user_interactions (user_id, place_id, interaction_type, interaction_value)
            VALUES (%s, %s, %s, %s)
        """, (interaction.user_id, interaction.place_id, interaction.interaction_type, interaction.interaction_value))

        connection.commit()
        return {"message": "Interaction logged successfully"}
    
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error logging interaction: {e}")

    finally:
        cursor.close()
        connection.close()

@app.get("/interactions/{user_id}")
async def get_interactions(user_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM user_interactions WHERE user_id = %s", (user_id,))
        interactions = cursor.fetchall()

        if not interactions:
            raise HTTPException(status_code=404, detail="No interactions found")

        return {"user_interactions": interactions}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching interactions: {e}")

    finally:
        cursor.close()
        connection.close()


def calculate_similarity(user_prefs, place_features):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([user_prefs] + place_features)
    similarity_scores = cosine_similarity(vectors[0], vectors[1:]).flatten()
    return similarity_scores

def interaction_weight(interactions, place_id):
    data = interactions.get(place_id, {"like": 0, "book": 0, "rate": 0})
    like_weight = 0.1
    book_weight = 0.2
    rate_weight = 0.2
    return (data["like"] * like_weight) + (data["book"] * book_weight) + (data["rate"] * rate_weight / 5)

def get_matched_user_interactions(user_id, cursor):
    cursor.execute("SELECT matched_user_id FROM matched_users WHERE user_id = %s", (user_id,))
    matched_user_ids = [row["matched_user_id"] for row in cursor.fetchall()]
    if not matched_user_ids:
        return {}
    query = "SELECT * FROM user_interactions WHERE user_id IN (%s)" % ','.join(['%s'] * len(matched_user_ids))
    cursor.execute(query, tuple(matched_user_ids))
    interactions = {}
    for row in cursor.fetchall():
        place_id = row["place_id"]
        interaction_type = row["interaction_type"]
        interaction_value = row.get("interaction_value", 0)
        if place_id not in interactions:
            interactions[place_id] = {"like": 0, "book": 0, "rate": 0}
        if interaction_type == "like":
            interactions[place_id]["like"] += 1
        elif interaction_type == "book":
            interactions[place_id]["book"] += 1
        elif interaction_type == "rate" and interaction_value:
            interactions[place_id]["rate"] = interaction_value
    return interactions

@app.get("/recommendations/{user_id}/{location_id}")
async def get_recommendations(user_id: int, location_id: int):
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM travel_preferences WHERE user_id = %s", (user_id,))
        user_prefs = cursor.fetchone()
        if not user_prefs:
            raise HTTPException(status_code=404, detail="User preferences not found")
        user_pref_text = (
            (user_prefs["vacation_type"] + " ") * 3 +
            (user_prefs["activities"] + " ") * 2 +
            (user_prefs["budget"] + " ") * 1 +
            user_prefs["accommodation"]
        )
        cursor.execute("SELECT * FROM places WHERE location_id = %s", (location_id,))
        places = cursor.fetchall()
        if not places:
            return {"recommended_places": []}
        places_df = pd.DataFrame(places)
        places_df["vacation_type"] = places_df["vacation_type"].str.lower()
        places_df["activities"] = places_df["activities"].str.lower()
        places_df = places_df[
            (places_df["vacation_type"].str.contains(user_prefs["vacation_type"].lower())) |
            (places_df["activities"].str.contains(user_prefs["activities"].lower()))
        ]
        if places_df.empty:
            return {"recommended_places": []}
        places_df["combined_features"] = places_df.apply(
            lambda x: (
                (x['vacation_type'] + " ") * 3 +
                (x['activities'] + " ") * 2 +
                (x['budget'] + " ") * 1 +
                x['accommodation']
            ),
            axis=1
        )
        similarity_scores = calculate_similarity(user_pref_text, list(places_df["combined_features"]))
        places_df["similarity_score"] = similarity_scores
        matched_user_interactions = get_matched_user_interactions(user_id, cursor)
        places_df["final_score"] = places_df.apply(
            lambda x: x["similarity_score"] * 0.8 + interaction_weight(matched_user_interactions, x["place_id"]) * 0.2,
            axis=1
        )
        recommendations = places_df.sort_values(by="final_score", ascending=False).head(5).to_dict(orient="records")
        return {"recommended_places": recommendations}
    except Exception as e:
        logging.error(f"Error fetching recommendations: {e}")
        raise HTTPException(status_code=500, detail="Error fetching recommendations")
    finally:
        cursor.close()
        connection.close()



if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="debug", reload=True)

