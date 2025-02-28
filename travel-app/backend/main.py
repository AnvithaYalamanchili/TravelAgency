from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from database import get_db_connection  # Assuming this function is defined in 'database.py'
import bcrypt
import face_recognition
import numpy as np
import io

app = FastAPI()

# Add CORS middleware to allow requests from specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Only allow your frontend to communicate
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define the user model (registration)
class User(BaseModel):
    first_name: str
    last_name: str
    dob: str  # Date of Birth (YYYY-MM-DD)
    passport_number: str
    email: str
    username: str
    password: str

class LoginUser(BaseModel):
    email: str
    password: str




@app.post("/register")
async def register(user: User):
    print(user)
    connection = get_db_connection()  # Get DB connection from 'database.py'
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
        existing_user = cursor.fetchone()
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists.")
        
        # Hash the password before storing it
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

        cursor.execute(
            """INSERT INTO users 
               (first_name, last_name, dob, passport_number, email, username, password) 
               VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (user.first_name, user.last_name, user.dob, user.passport_number, user.email, user.username, hashed_password)
        )
        connection.commit()

        return {"message": "Registration successful!"}
    
    except Exception as e:
        print(f"Error during registration: {e}")  # Add detailed error logging
        raise HTTPException(status_code=500, detail=f"Error during registration: {e}")
    
    finally:
        cursor.close()
        connection.close()


@app.post("/login")
async def login(user: LoginUser):
    connection = get_db_connection()  # Get DB connection from 'database.py'
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
        existing_user = cursor.fetchone()
        
        stored_password = existing_user[5].encode('utf-8')  # Ensure stored hash is in bytes
        if not existing_user or not bcrypt.checkpw(user.password.encode('utf-8'), stored_password):
            raise HTTPException(status_code=401, detail="Invalid credentials.")
        
        return {"message": "Login successful!"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during login: {e}")
    
    finally:
        cursor.close()
        connection.close()


@app.post("/verify-face")
async def verify_face(passport_image: UploadFile = File(...), selfie_image: UploadFile = File(...)):
    try:
        # Read images as bytes
        passport_bytes = await passport_image.read()
        selfie_bytes = await selfie_image.read()

        # Load images into face_recognition
        passport_img = face_recognition.load_image_file(io.BytesIO(passport_bytes))
        selfie_img = face_recognition.load_image_file(io.BytesIO(selfie_bytes))

        # Get face encodings
        passport_encoding = face_recognition.face_encodings(passport_img)
        selfie_encoding = face_recognition.face_encodings(selfie_img)

        # Ensure faces were detected
        if len(passport_encoding) == 0 or len(selfie_encoding) == 0:
            raise HTTPException(status_code=400, detail="No face detected in one or both images.")

        # Compare faces
        match = face_recognition.compare_faces([passport_encoding[0]], selfie_encoding[0])[0]

        # Explicitly convert numpy.bool_ to Python boolean
        match = bool(match)

        return {"message": "Face verification successful!" if match else "Face verification failed!", "verified": match}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing images: {e}")
