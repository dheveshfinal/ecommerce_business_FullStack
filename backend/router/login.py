from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
import bcrypt
from db import get_db

router= APIRouter()

@router.post("/login_user")
async def login(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")

    result = db.execute(
        text("SELECT user_id, email, full_name, role, password_hash FROM users WHERE email = :email"),
        {"email": email}
    )
    details = result.fetchone()

    if not details:
        return {"message": "Wrong email"}

 
    stored_hash = details.password_hash.encode("utf-8")
    entered_password = password.encode("utf-8")


    if not bcrypt.checkpw(entered_password, stored_hash):
        return {"message": "Wrong password"}

    return {
        "message": "Login successful",
        "user_id": details.user_id,
        "email": details.email,
        "full_name": details.full_name,
        "role": details.role
    }
