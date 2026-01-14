from fastapi import APIRouter, Depends, HTTPException,Request
from sqlalchemy.orm import Session
from sqlalchemy import text
from db import get_db

router = APIRouter()

# ✅ Add product to cart
@router.post("/addcart")
def add_to_cart(user_id: int, product_id: int, quantity: int = 1, db: Session = Depends(get_db)):
    try:
        # Check if product exists
        product_check = db.execute(
            text("SELECT * FROM products WHERE product_id = :pid"),
            {"pid": product_id}
        ).fetchone()

        if not product_check:
            raise HTTPException(status_code=404, detail="Product not found")

        # Check if already in cart → update quantity
        existing = db.execute(
            text("SELECT * FROM addcart WHERE user_id = :uid AND product_id = :pid"),
            {"uid": user_id, "pid": product_id}
        ).fetchone()

        if existing:
            db.execute(
                text("""
                    UPDATE addcart 
                    SET quantity = quantity + :qty 
                    WHERE user_id = :uid AND product_id = :pid
                """),
                {"uid": user_id, "pid": product_id, "qty": quantity}
            )
        else:
            db.execute(
                text("""
                    INSERT INTO addcart (user_id, product_id, quantity)
                    VALUES (:uid, :pid, :qty)
                """),
                {"uid": user_id, "pid": product_id, "qty": quantity}
            )

        db.commit()
        return {"message": "Product added to cart successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Get all products in a user’s cart
@router.get("/addcart/{user_id}")
def get_cart_items(user_id: int, db: Session = Depends(get_db)):
    try:
        query = text("""
            SELECT 
                c.cart_id,
                p.product_id,
                p.title,
                p.description,
                p.price,
                c.quantity,
                im.image_url
            FROM addcart AS c
            JOIN products AS p ON c.product_id = p.product_id
            LEFT JOIN product_images AS im 
                ON p.product_id = im.product_id AND im.is_primary = TRUE
            WHERE c.user_id = :uid
        """)

        result = db.execute(query, {"uid": user_id}).fetchall()

        if not result:
            return {"message": "Your cart is empty", "cart": []}

        cart_items = [
            {
                "cart_id": row.cart_id,
                "product_id": row.product_id,
                "title": row.title,
                "description": row.description,
                "price": float(row.price),
                "quantity": row.quantity,
                "image_url": f"/{row.image_url}" if row.image_url else None,
            }
            for row in result
        ]

        return {"cart": cart_items}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/addcart/{cart_id}")
def delete_cart_item(cart_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text("DELETE FROM addcart WHERE cart_id = :cart_id RETURNING cart_id"),
        {"cart_id": cart_id}
    )
    deleted = result.fetchone()
    db.commit()

    if not deleted:
        raise HTTPException(status_code=404, detail="Cart item not found")

    return {"message": "Item removed from cart successfully"}

@router.put("/addcart/{cart_id}")
def update_quantity(cart_id: int, quantity: int, db: Session = Depends(get_db)):
    result = db.execute(
        text("UPDATE addcart SET quantity = :quantity WHERE cart_id = :cart_id RETURNING cart_id"),
        {"quantity": quantity, "cart_id": cart_id},
    )
    updated = result.fetchone()
    db.commit()

    if not updated:
        raise HTTPException(status_code=404, detail="Cart item not found")

    return {"message": "Quantity updated successfully"}


@router.post("/address/{userId}")
async def add_address(request: Request, userId: int, db: Session = Depends(get_db)):
    data = await request.json()

    address1 = data.get("address_line1")
    address2 = data.get("address_line2")
    city = data.get("city")
    state = data.get("state")
    postal_code = data.get("postal_code")
    country = data.get("country")

    # Validate required fields
    if not all([address1, city, state, postal_code, country]):
        return {"detail": "Please fill all required address fields"}

    # Insert into database using parameter binding (safe from SQL injection)
    query = text("""
        INSERT INTO addresses (user_id, address_line1, address_line2, city, state, postal_code, country, is_default)
        VALUES (:user_id, :address_line1, :address_line2, :city, :state, :postal_code, :country, true)
    """)

    db.execute(query, {
        "user_id": userId,
        "address_line1": address1,
        "address_line2": address2,
        "city": city,
        "state": state,
        "postal_code": postal_code,
        "country": country
    })
    db.commit()

    return {"message": "Address added successfully"}





