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

        return {"message": "Registration successful!"}

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
        cursor.execute("SELECT user_id, password FROM users WHERE email = %s", (user.email,))
        existing_user = cursor.fetchone()

        if not existing_user:
            raise HTTPException(status_code=401, detail="Invalid credentials.")

        user_id, stored_password = existing_user

        if not bcrypt.checkpw(user.password.encode('utf-8'), stored_password.encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid credentials.")

        return {"message": "Login successful!", "user_id": user_id}

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
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed.")

    cursor = connection.cursor()

    try:
        # Check if preferences already exist
        cursor.execute("SELECT id FROM travel_preferences WHERE user_id = %s", (preferences.user_id,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Preferences already saved for this user.")

        # Insert preferences
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
        raise HTTPException(status_code=500, detail="Error saving preferences")

    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="debug", reload=True)

