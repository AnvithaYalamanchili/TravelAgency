from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request
from fastapi.responses import RedirectResponse
from fastapi import Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import date, time
import mysql.connector
from database import get_db_connection  # Ensure this function is correctly implemented
import bcrypt
import uvicorn
import face_recognition
import numpy as np
import io
import logging, json
import sqlite3
from typing import List, Optional
from fastapi import HTTPException
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from fastapi import status,Header
from database import get_db_connection
from jose import JWTError,jwt
from datetime import datetime, timedelta
from typing import Union
from fastapi.responses import JSONResponse
from decimal import Decimal



SECRET_KEY = "your-super-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hour

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


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
    user_id:Optional[int] = None
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
    location_id: int
    image: str
    place_overview: str
    features: str
    vacation_type: str
    trip_duration: str
    budget: str
    accommodation: str
    activities: str
    time_to_visit: str
    explore_images: Optional[List[str]] = None
    description: Optional[str] = None
    duration: str
    transportation: Optional[str] = None
    meals: Optional[str] = None


# Pydantic Model for Spot
class Spot(BaseModel):
    place_id: int
    spot_name: str
    image: str
    description: str
    duration: str
    transportation: str
    price: float
    activities: str
    accommodation: str
    packing_list: list  # This will be stored as JSON in the database


# Pydantic model for interaction input
class InteractionInput(BaseModel):
    user_id: int
    place_id: int
    interaction_type: str  # 'like', 'book', or 'rate'
    interaction_value: float = None  # Optional (only for ratings)


class Booking(BaseModel):
    booking_id: int
    user_id: int
    guide_id: int
    date: date
    time: time
    status: str


# Add these to your existing models
class ChatMessage(BaseModel):
    sender_id: int
    receiver_id: int
    message: str
    timestamp: str = None  # Will be set server-side

class ChatRoom(BaseModel):
    user1_id: int
    user2_id: int

# Add these endpoints to your FastAPI app
# Add these models
class InterestRequest(BaseModel):
    sender_id: int
    receiver_id: int
    status: str

class Passenger(BaseModel):
    full_name: str

class BookingData(BaseModel):
    place_id: int
    travel_date: date
    travelers: int
    insurance_selected: bool
    final_total: float
    processing_fee: Optional[float] = 0.0
    insurance_fee: Optional[float] = 0.0
    currency: str
    country: str
    full_name: str
    email: str
    phone: str
    user_id: int
    passengers: List[Passenger]
    spot_ids: List[int]

class SpotSelection(BaseModel):
    spot_ids: List[int]

class BookingSpot(BaseModel):
    booking_id: int
    spot_id: int

class UserUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]

# Add these endpoints
@app.post("/interest-requests")
async def send_interest_request(request: InterestRequest):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        # Check if request already exists
        cursor.execute("""
            SELECT 1 FROM interest_requests 
            WHERE sender_id = %s AND receiver_id = %s
        """, (request.sender_id, request.receiver_id))
        
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Request already sent")
            
        # Insert new request
        cursor.execute("""
            INSERT INTO interest_requests (sender_id, receiver_id, status)
            VALUES (%s, %s, %s)
        """, (request.sender_id, request.receiver_id, request.status))
        
        connection.commit()
        return {"status": "success", "message": "Interest request sent"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        connection.close()

def get_current_user_id(token: str = Depends(oauth2_scheme)) -> int:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception
    
def get_current_user_info(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        email: str = payload.get("sub")

        if user_id is None or email is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")

        return {"user_id": user_id, "email": email}

    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")


def get_current_user_email(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token: no email found")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@app.get("/profile")
async def get_profile(user_info: dict = Depends(get_current_user_info)):
    user_id = user_info["user_id"]
    email = user_info["email"]
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed.")
    
    cursor = connection.cursor()

    try:
        cursor.execute(
            "SELECT first_name, last_name, email, dob, username FROM users WHERE email = %s", (email,)
        )
        user_data = cursor.fetchone()

        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")

        first_name, last_name, email, dob, username = user_data

        return {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "dob": dob,
            "username": username
        }

    except Exception as e:
        logging.error(f"Error retrieving profile: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    finally:
        cursor.close()
        connection.close()



from enum import Enum
from fastapi import Body

class StatusEnum(str, Enum):
    accepted = "accepted"
    declined = "declined"

@app.put("/interest-requests/{request_id}")
async def update_interest_request(
    request_id: int, 
    status: StatusEnum = Body(..., embed=True)  # Expects {"status": "accepted/declined"}
):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        # Get the original request details with FOR UPDATE lock
        cursor.execute("""
            SELECT sender_id, receiver_id, status 
            FROM interest_requests 
            WHERE request_id = %s
            FOR UPDATE
        """, (request_id,))
        request = cursor.fetchone()
        
        if not request:
            raise HTTPException(status_code=404, detail="Request not found")
            
        sender_id, receiver_id, current_status = request
        
        # Only proceed if current status is pending
        if current_status != 'pending':
            raise HTTPException(
                status_code=400, 
                detail=f"Cannot modify already {current_status} request"
            )
        
        # Update the original request
        cursor.execute("""
            UPDATE interest_requests 
            SET status = %s 
            WHERE request_id = %s
        """, (status, request_id))
        
        # ONLY create reverse record if status is accepted
        if status == "accepted":
            try:
                cursor.execute("""
                    INSERT INTO interest_requests 
                    (sender_id, receiver_id, status)
                    VALUES (%s, %s, 'accepted')
                """, (receiver_id, sender_id))
            except Exception as e:
                if "Duplicate entry" in str(e):
                    cursor.execute("""
                        UPDATE interest_requests
                        SET status = 'accepted'
                        WHERE sender_id = %s AND receiver_id = %s
                    """, (receiver_id, sender_id))
                else:
                    raise
        
        connection.commit()
        return {"status": "success", "message": f"Request {status}"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        connection.close()

@app.get("/interest-requests/received/{user_id}")
async def get_received_requests(user_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT r.*, u.first_name, u.last_name 
            FROM interest_requests r
            JOIN users u ON r.sender_id = u.user_id
            WHERE r.receiver_id = %s AND r.status = 'pending'
        """, (user_id,))
        
        requests = cursor.fetchall()
        return {"requests": requests}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        connection.close()

@app.get("/interest-requests/status/{user1_id}/{user2_id}")
async def get_request_status(user1_id: int, user2_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Check for any accepted connection between these users
        cursor.execute("""
            SELECT * FROM interest_requests 
            WHERE ((sender_id = %s AND receiver_id = %s)
            OR (sender_id = %s AND receiver_id = %s))
            AND status = 'accepted'
        """, (user1_id, user2_id, user2_id, user1_id))
        
        accepted_request = cursor.fetchone()  # This consumes the result
        
        if accepted_request:
            # Make sure to consume any remaining results
            while cursor.fetchone() is not None:
                pass
            return {
                "request": {
                    "status": "accepted",
                    "isReceiver": accepted_request['receiver_id'] == user1_id
                }
            }
        
        # If no accepted connection, check for pending requests
        cursor.execute("""
            SELECT * FROM interest_requests 
            WHERE (sender_id = %s AND receiver_id = %s)
            OR (sender_id = %s AND receiver_id = %s)
        """, (user1_id, user2_id, user2_id, user1_id))
        
        request = cursor.fetchone()  # Consume the result
        # Consume any remaining results
        while cursor.fetchone() is not None:
            pass
            
        return {"request": request}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        connection.close()

@app.post("/chat/messages")
async def send_message(message: ChatMessage):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        # Set current timestamp
        from datetime import datetime
        message.timestamp = datetime.now().isoformat()
        
        cursor.execute("""
            INSERT INTO chat_messages (sender_id, receiver_id, message, timestamp)
            VALUES (%s, %s, %s, %s)
        """, (message.sender_id, message.receiver_id, message.message, message.timestamp))
        
        connection.commit()
        return {"status": "success", "message": "Message sent successfully"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        connection.close()

@app.get("/chat/messages/{user1_id}/{user2_id}")
async def get_messages(user1_id: int, user2_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT * FROM chat_messages
            WHERE (sender_id = %s AND receiver_id = %s)
            OR (sender_id = %s AND receiver_id = %s)
            ORDER BY timestamp ASC
        """, (user1_id, user2_id, user2_id, user1_id))
        
        messages = cursor.fetchall()
        return {"messages": messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        connection.close()

@app.get("/chat/conversations/{user_id}")
async def get_conversations(user_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Get distinct users the current user has chatted with
        cursor.execute("""
            SELECT DISTINCT 
                CASE 
                    WHEN sender_id = %s THEN receiver_id 
                    ELSE sender_id 
                END as other_user_id,
                u.first_name,
                u.last_name
            FROM chat_messages cm
            JOIN users u ON 
                (cm.sender_id = u.user_id AND cm.sender_id != %s) OR 
                (cm.receiver_id = u.user_id AND cm.receiver_id != %s)
            WHERE sender_id = %s OR receiver_id = %s
        """, (user_id, user_id, user_id, user_id, user_id))
        
        conversations = cursor.fetchall()
        return {"conversations": conversations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        connection.close()

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT user_id, first_name, last_name, email 
            FROM users 
            WHERE user_id = %s
        """, (user_id,))
        
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        return user
    finally:
        cursor.close()
        connection.close()

# Add this new endpoint for efficient message checking
from datetime import datetime

@app.get("/chat/has-new-messages/{user1_id}/{user2_id}/{last_message_id}")
async def has_new_messages(user1_id: int, user2_id: int, last_message_id: int):
    print(f"Request received at {datetime.now()} for user1: {user1_id}, user2: {user2_id}, last_message_id: {last_message_id}")
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        cursor.execute("""
            SELECT EXISTS(
                SELECT 1 FROM chat_messages
                WHERE ((sender_id = %s AND receiver_id = %s)
                OR (sender_id = %s AND receiver_id = %s))
                AND message_id > %s
            ) AS has_new
        """, (user1_id, user2_id, user2_id, user1_id, last_message_id))
        
        return cursor.fetchone()[0]
    finally:
        cursor.close()
        connection.close()


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
    print("Received login request for:", user.email)  # Debugging

    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed.")

    cursor = connection.cursor()

    try:
        cursor.execute("SELECT user_id, first_name, password FROM users WHERE email = %s", (user.email,))
        existing_user = cursor.fetchone()

        print("Query executed")  # Debugging

        if not existing_user:
            print("User not found")  # Debugging
            raise HTTPException(status_code=401, detail="Invalid credentials.")

        user_id, first_name, stored_password = existing_user
        print(f"User found: {user_id}, {first_name}")  # Debugging

        if not bcrypt.checkpw(user.password.encode('utf-8'), stored_password.encode('utf-8')):
            print("Password incorrect")  # Debugging
            raise HTTPException(status_code=401, detail="Invalid credentials.")

        print("Login successful!")  # Debugging
        access_token = create_access_token(data={"user_id": user_id, "sub": user.email})


        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user_id,
            "first_name": first_name
        }
    

    except Exception as e:
        logging.error(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    finally:
        cursor.close()
        connection.close()
        print("Database connection closed")  # Debugging


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

        top_matches = matched_users[:10]

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
        cursor.execute("SELECT * FROM placess")
        places = cursor.fetchall()
        return {"places": places}
    finally:
        cursor.close()
        connection.close()

# Fetch a single place by ID
@app.get("/place/{place_id}")
async def get_place_details(place_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM placess WHERE place_id = %s", (place_id,))
        place = cursor.fetchone()
        if not place:
            raise HTTPException(status_code=404, detail="Place not found")
        
        # Fetch associated spots
        cursor.execute("SELECT * FROM spots WHERE place_id = %s", (place_id,))
        spots = cursor.fetchall()

        place['spots'] = spots  # Append spots data to the place data
        return place
    finally:
        cursor.close()
        connection.close()

# Fetch all places based on location_id
@app.get("/places/location/{location_id}")
async def get_places_by_location(location_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM placess WHERE location_id = %s", (location_id,))
        places = cursor.fetchall()
        if not places:
            raise HTTPException(status_code=404, detail="No places found for this location")
        return {"places": places}
    finally:
        cursor.close()
        connection.close()



# Add a new place (or update if exists)
from typing import List


@app.post("/places/bulk")
async def add_or_update_multiple_places(places: List[Place]):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        for place in places:
            # Check if the place already exists
            cursor.execute("SELECT place_id FROM placess WHERE place_name = %s", (place.place_name,))
            existing_place = cursor.fetchone()

            if existing_place:
                place_id = existing_place["place_id"]
                cursor.execute(
                    """UPDATE placess SET 
                        location_id = %s, image = %s, place_overview = %s, features = %s, vacation_type = %s, 
                        trip_duration = %s, budget = %s, accommodation = %s, activities = %s, duration = %s,
                        time_to_visit = %s, explore_images = %s, 
                        description = %s, transportation = %s, meals = %s 
                        WHERE place_id = %s""",
                    (place.location_id, place.image, place.place_overview, place.features, place.vacation_type, 
                     place.trip_duration, place.budget, place.accommodation, place.activities, place.duration,
                     place.time_to_visit, ",".join(place.explore_images) if place.explore_images else None, 
                     place.description, place.transportation, place.meals, place_id)
                )
            else:
                # Insert new place
                cursor.execute(
                    """INSERT INTO placess 
                       (place_name, location_id, image, place_overview, features, vacation_type, 
                        trip_duration, budget, accommodation, activities, time_to_visit, 
                        explore_images, duration, description, transportation, meals) 
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                    (place.place_name, place.location_id, place.image, place.place_overview, place.features, 
                     place.vacation_type, place.trip_duration, place.budget, place.accommodation, 
                     place.activities, place.time_to_visit, 
                     ",".join(place.explore_images) if place.explore_images else None, place.duration,
                     place.description, place.transportation, place.meals)
                )

        connection.commit()
        return {"message": f"{len(places)} place(s) processed successfully."}

    finally:
        cursor.close()
        connection.close()

# Update an existing place
@app.put("/places/{place_id}")
async def update_place(place_id: int, place: Place):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT place_id FROM placess WHERE place_id = %s", (place_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Place not found")

        cursor.execute(
            """UPDATE places SET 
                place_name = %s, location_id = %s, image = %s, place_overview = %s, 
                features = %s, vacation_type = %s, trip_duration = %s, budget = %s, 
                accommodation = %s, activities = %s, 
                time_to_visit = %s, explore_images = %s, duration = %s, description = %s, 
                transportation = %s, meals = %s 
                WHERE place_id = %s""",
            (place.place_name, place.location_id, place.image, place.place_overview, place.features, 
             place.vacation_type, place.trip_duration, place.budget, place.accommodation, 
             place.activities, place.time_to_visit, 
             ",".join(place.explore_images) if place.explore_images else None, place.duration,
             place.description, place.transportation, place.meals, place_id)
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
        cursor.execute("SELECT place_id FROM placess WHERE place_id = %s", (place_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="place not found")

        cursor.execute("DELETE FROM places WHERE place_id = %s", (place_id,))
        connection.commit()
        return {"message": "Place deleted successfully!"}
    
    finally:
        cursor.close()
        connection.close()

# Fetch all spots
@app.get("/spots")
async def get_spots():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM spotss")
        spots = cursor.fetchall()

        # Convert packing_list JSON string to Python list
        for spot in spots:
            if spot["packing_list"]:
                spot["packing_list"] = json.loads(spot["packing_list"])

        return {"spots": spots}
    finally:
        cursor.close()
        connection.close()

# Fetch spots by Place ID
@app.get("/spots/place/{place_id}")
def get_spots_by_place(place_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Fetch all spots where place_id matches
    try:
        cursor.execute("SELECT * FROM spotss WHERE place_id = %s", (place_id,))
        spots = cursor.fetchall()
        if not spots:
            raise HTTPException(status_code=404, detail="No spots found for this place_id")
        return {"spots": spots}
    finally:
        cursor.close()
        connection.close()


# Add a new spot
@app.post("/spots")
async def add_spot(spot: Spot):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Convert packing_list from Python list to JSON string
        packing_list_json = json.dumps(spot.packing_list)

        cursor.execute(
            """INSERT INTO spotss 
               (place_id, spot_name, image, description, duration, 
                transportation, price, activities, accommodation, packing_list) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (spot.place_id, spot.spot_name, spot.image, 
             spot.description, spot.duration, spot.transportation, spot.price, spot.activities, 
             spot.accommodation, packing_list_json)
        )

        connection.commit()
        return {"message": "Spot added successfully!"}
    finally:
        cursor.close()
        connection.close()

# Update an existing spot
@app.put("/spots/{spot_id}")
async def update_spot(spot_id: int, spot: Spot):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT spot_id FROM spotss WHERE spot_id = %s", (spot_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Spot not found")

        # Convert packing_list from Python list to JSON string
        packing_list_json = json.dumps(spot.packing_list)

        cursor.execute(
            """UPDATE spots 
               SET place_id = %s, spot_name = %s, image = %s, description = %s, 
                   duration = %s, transportation = %s, price = %s, activities = %s, 
                   accommodation = %s, packing_list = %s 
               WHERE spot_id = %s""",
            (spot.place_id, spot.spot_name, spot.image, spot.description, 
             spot.duration, spot.transportation, spot.price, spot.activities, 
             spot.accommodation, packing_list_json, spot_id)
        )

        connection.commit()
        return {"message": "Spot updated successfully!"}
    finally:
        cursor.close()
        connection.close()

# Delete a spot
@app.delete("/spots/{spot_id}")
async def delete_spot(spot_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT spot_id FROM spotss WHERE spot_id = %s", (spot_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Spot not found")

        cursor.execute("DELETE FROM spots WHERE spot_id = %s", (spot_id,))
        connection.commit()
        return {"message": "Spot deleted successfully!"}
    finally:
        cursor.close()
        connection.close()

# Fetch trip details for a specific place by place_id
# Fetch trip details based on place_id
@app.get("/trip/{place_id}")
async def get_trip_details(place_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Fetch place details
        cursor.execute("SELECT * FROM placess WHERE place_id = %s", (place_id,))
        place = cursor.fetchone()
        if not place:
            raise HTTPException(status_code=404, detail="Place not found")

        # Fetch associated spots for the place
        cursor.execute("SELECT * FROM spotss WHERE place_id = %s", (place_id,))
        spots = cursor.fetchall()

        # Attach spots to the place
        place['spots'] = spots
        
        # Now you can add any additional information about the trip, such as pricing, activities, etc.
        return place

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
        # Fetch user preferences
        cursor.execute("SELECT * FROM travel_preferences WHERE user_id = %s", (user_id,))
        user_prefs = cursor.fetchone()
        if not user_prefs:
            raise HTTPException(status_code=404, detail="User preferences not found")

        user_vacation_type = user_prefs["vacation_type"].lower()

        user_pref_text = (
            (user_prefs["activities"] + " ") * 3 +
            (user_prefs["budget"] + " ") * 2 +
            user_prefs["accommodation"]
        )

        # Fetch places and filter vacation_type dynamically
        cursor.execute("SELECT * FROM places WHERE location_id = %s", (location_id,))
        places = cursor.fetchall()

        if not places:
            return {"recommended_places": []}

        places_df = pd.DataFrame(places)

        # Convert vacation_type to lowercase lists for comparison
        places_df["vacation_type_list"] = places_df["vacation_type"].str.lower().str.split(", ")

        # Filter places where the user's vacation type exists in the list
        places_df = places_df[places_df["vacation_type_list"].apply(lambda x: user_vacation_type in x)]

        if places_df.empty:
            return {"recommended_places": []}

        # Combine features for similarity comparison
        places_df["combined_features"] = places_df.apply(
            lambda x: (
                (x['activities'] + " ") * 3 +
                (x['budget'] + " ") * 2 +
                x['accommodation']
            ),
            axis=1
        )

        # Calculate similarity scores
        similarity_scores = calculate_similarity(user_pref_text, list(places_df["combined_features"]))
        places_df["similarity_score"] = similarity_scores

        # Fetch interactions from matched users
        matched_user_interactions = get_matched_user_interactions(user_id, cursor)

        # Compute final score with interaction weight
        places_df["final_score"] = places_df.apply(
            lambda x: x["similarity_score"] * 0.8 + interaction_weight(matched_user_interactions, x["place_id"]) * 0.2,
            axis=1
        )

        # Sort and return top recommendations
        recommendations = places_df.sort_values(by="final_score", ascending=False).head(5).to_dict(orient="records")
        return {"recommended_places": recommendations}

    except Exception as e:
        logging.error(f"Error fetching recommendations: {e}")
        raise HTTPException(status_code=500, detail="Error fetching recommendations")
    finally:
        cursor.close()
        connection.close()

@app.post("/bookings/")
def create_booking(data: BookingData, user_info: dict = Depends(get_current_user_info)):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        user_id = user_info["user_id"]

        booking_query = """
            INSERT INTO bookings (
                place_id, travel_date, travelers, insurance_selected,
                final_total, processing_fee, insurance_fee, currency,
                country, full_name, email, phone, user_id
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        booking_values = (
            data.place_id, data.travel_date, data.travelers,
            data.insurance_selected, data.final_total, data.processing_fee,
            data.insurance_fee, data.currency, data.country,
            data.full_name, data.email, data.phone, user_id
        )

        cursor.execute(booking_query, booking_values)
        booking_id = cursor.lastrowid

        # Insert passengers
        passenger_query = """
            INSERT INTO passengers (booking_id, full_name) VALUES (%s, %s)
        """
        for passenger in data.passengers:
            cursor.execute(passenger_query, (booking_id, passenger.full_name))

        # ✅ Insert selected spot IDs into booking_spots
        spot_query = "INSERT INTO booking_spots (booking_id, spot_id) VALUES (%s, %s)"
        for spot_id in data.spot_ids:
            cursor.execute(spot_query, (booking_id, spot_id))

        conn.commit()
        return {"message": "Booking successful", "booking_id": booking_id}

    except Exception as e:
        print(str(e))
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()



@app.get("/bookings/{user_id}")
def get_user_bookings(user_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Query to fetch bookings for a specific user
        query = """
            SELECT b.id, b.place_id, b.travel_date, b.travelers, b.insurance_selected, 
                   b.final_total, b.processing_fee, b.insurance_fee, b.currency, 
                   b.country, b.full_name, b.email, b.phone, b.created_at
            FROM bookings b
            WHERE b.user_id = %s  -- assuming bookings table has a user_id column
        """
        cursor.execute(query, (user_id,))
        bookings = cursor.fetchall()

        # If no bookings found
        if not bookings:
            return {"message": "No bookings found for this user"}

        # Prepare the booking data in a more readable format
        bookings_data = []
        for booking in bookings:
            bookings_data.append({
                "id": booking[0],
                "place_id": booking[1],
                "travel_date": booking[2],
                "travelers": booking[3],
                "insurance_selected": booking[4],
                "final_total": booking[5],
                "processing_fee": booking[6],
                "insurance_fee": booking[7],
                "currency": booking[8],
                "country": booking[9],
                "full_name": booking[10],
                "email": booking[11],
                "phone": booking[12],
                "created_at": booking[13]
            })

        return {"bookings": bookings_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.get("/bookings/{booking_id}/spots")
def get_booking_spots(booking_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
        SELECT s.*
        FROM spotss s
        JOIN booking_spots bs ON s.spot_id = bs.spot_id
        WHERE bs.booking_id = %s;
        """
        cursor.execute(query, (booking_id,))
        spots = cursor.fetchall()
        return {"spots": spots}
    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")





@app.post("/bookings/{booking_id}/spots")
def add_selected_spots_to_booking(booking_id: int, selection: SpotSelection):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        for spot_id in selection.spot_ids:
            cursor.execute(
                "INSERT INTO booking_spots (booking_id, spot_id) VALUES (%s, %s)",
                (booking_id, spot_id)
            )
        conn.commit()
        return {"message": "Spots added to booking"}
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}
    finally:
        cursor.close()
        conn.close()

@app.delete("/bookings/{booking_id}")
def cancel_booking(booking_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM booking_spots WHERE booking_id = %s", (booking_id,))

        cursor.execute("DELETE FROM bookings WHERE id = %s", (booking_id,))

        conn.commit()

        return {"message": "Booking cancelled successfully"}
    
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail="Error cancelling booking: " + str(e))
    
    finally:
        cursor.close()
        conn.close()

import logging

# Set up basic logging
logging.basicConfig(level=logging.DEBUG)

@app.get("/admin/bookings")
def get_all_bookings():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Fetch bookings
        cursor.execute("SELECT * FROM bookings")
        bookings = cursor.fetchall()

        for booking in bookings:
            booking_id = booking["id"]

            # Fetch passengers for this booking
            cursor.execute("SELECT full_name FROM passengers WHERE booking_id = %s", (booking_id,))
            passengers = cursor.fetchall()
            booking["passengers"] = [p["full_name"] for p in passengers]

            # Fetch spots for this booking
            cursor.execute("""
                SELECT s.spot_name FROM booking_spots bs
                JOIN spotss s ON bs.spot_id = s.spot_id
                WHERE bs.booking_id = %s
            """, (booking_id,))
            spots = cursor.fetchall()
            booking["spots"] = [s["spot_name"] for s in spots]

        return {"status": "success", "bookings": bookings}

    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while fetching bookings.")

    finally:
        cursor.close()
        conn.close()

@app.get("/admin/users", response_model=List[User])
def get_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT user_id, first_name, last_name, dob, passport_number, email, username, password FROM users"
        )
        users = cursor.fetchall()
        conn.close()

        user_list = [
            User(
                user_id=user[0],
                first_name=user[1],
                last_name=user[2],
                dob=str(user[3]),
                passport_number=user[4],
                email=user[5],
                username=user[6],
                password=user[7],
            )
            for user in users
        ]
        return user_list

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching users from database")
    
@app.delete("/admin/users/{user_id}")
def delete_user(user_id: int = Path(..., description="ID of the user to delete")):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
        user = cursor.fetchone()
        if not user:
            conn.close()
            raise HTTPException(status_code=404, detail="User not found")

        cursor.execute("DELETE FROM users WHERE user_id = ?", (user_id,))
        conn.commit()
        conn.close()
        return {"detail": f"User with ID {user_id} has been deleted."}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error deleting user")
    

@app.put("/admin/users/{user_id}")
def update_user(user_id: int, updated_data: UserUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Correct placeholder for MySQL
    cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
    existing_user = cursor.fetchone()
    
    if not existing_user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    update_fields = {k: v for k, v in updated_data.dict().items() if v is not None}
    if not update_fields:
        conn.close()
        raise HTTPException(status_code=400, detail="No fields provided to update")

    set_clause = ", ".join([f"{field} = %s" for field in update_fields])
    values = list(update_fields.values())
    values.append(user_id)

    # Correct query
    query = f"UPDATE users SET {set_clause} WHERE user_id = %s"

    try:
        cursor.execute(query, values)
        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
    
    conn.close()
    return {"message": "User updated successfully"}




if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="debug", reload=True)