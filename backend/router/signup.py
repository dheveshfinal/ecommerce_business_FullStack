from fastapi import APIRouter, Request, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db
from sqlalchemy import text
import bcrypt

router = APIRouter()

@router.post("/signup_user")
async def signup(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        full_name = data.get("full_name")
        email = data.get("email")
        password = data.get("password_hash") 
        phone = data.get("phone")
        role = data.get("role")

        if not all([full_name, email, password, phone, role]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="All fields are required"
            )

        # Check for existing userW
        existing_user = db.execute(
            text("SELECT * FROM users WHERE email = :email"),
            {"email": email}
        ).fetchone()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists"
            )

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        # Insert new user
        db.execute(
    text(
        "INSERT INTO users (full_name, email, password_hash, phone, role) "
        "VALUES (:full_name, :email, :password_hash, :phone, :role)"
    ),
    {
        "full_name": full_name,
        "email": email,
        "password_hash": hashed_password,
        "phone": phone,
        "role": role
    }
)

        db.commit()

        return {"message": "User registered successfully"}

    except Exception as e:
        print("Signup error:", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )
