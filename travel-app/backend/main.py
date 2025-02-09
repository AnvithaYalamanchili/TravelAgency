from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from database import get_db_connection  # Assuming this function is defined in 'database.py'
import bcrypt

app = FastAPI()

# Add CORS middleware to allow requests from specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (you can specify specific origins here if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define the user model (registration/login)
class User(BaseModel):
    first_name: str = None
    last_name: str = None
    email: str
    username: str
    password: str

class LoginUser(BaseModel):
    email: str
    password: str



@app.post("/register")
async def register(user: User):
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
            "INSERT INTO users (first_name, last_name, email, username, password) VALUES (%s, %s, %s, %s, %s)",
            (user.first_name, user.last_name, user.email, user.username, hashed_password)
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
