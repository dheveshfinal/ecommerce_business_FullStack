from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from db import get_db
import uuid
import os
from pathlib import Path

router = APIRouter()


BASE_DIR = Path(__file__).resolve().parent.parent
IMAGE_DIR = BASE_DIR / "images"


@router.post("/adding_images")
def upload_product_image(
    product_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
     
    IMAGE_DIR.mkdir(exist_ok=True)

    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

   
    ext = file.filename.split(".")[-1].lower()

  
    allowed_ext = ["jpg", "jpeg", "png", "webp", "avif"]
    if ext not in allowed_ext:
        raise HTTPException(status_code=400, detail="Invalid image format")

   
    filename = f"{product_id}_{uuid.uuid4()}.{ext}"

  
    file_path = IMAGE_DIR / filename


    try:
        with open(file_path, "wb") as f:
            f.write(file.file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File save error: {str(e)}")

    db_path = f"images/{filename}"


    try:
        db.execute(
            text("""
                INSERT INTO product_images (product_id, image_url, is_primary)
                VALUES (:product_id, :image_url, true)
            """),
            {"product_id": product_id, "image_url": db_path}
        )
        db.commit()
    except Exception as e:
        db.rollback()
  
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"DB insert error: {str(e)}")

   
    return {
        "message": "Image uploaded successfully!",
        "saved_as": filename,
        "db_path": db_path,
        "disk_path": str(file_path)
    }


@router.get("/product_images/{product_id}")
def get_product_images(product_id: int, db: Session = Depends(get_db)):
    try:
        result = db.execute(
            text("""
                SELECT image_id, product_id, image_url, is_primary
                FROM product_images
                WHERE product_id = :product_id
                ORDER BY is_primary DESC, image_id ASC
            """),
            {"product_id": product_id}
        )
        
        images = []
        for row in result:
            images.append({
                "image_id": row.image_id,
                "product_id": row.product_id,
                "image_url": row.image_url,
                "is_primary": row.is_primary
            })
        
        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching images: {str(e)}")


@router.delete("/delete_image/{image_id}")
def delete_product_image(image_id: int, db: Session = Depends(get_db)):
    try:
  
        result = db.execute(
            text("SELECT image_url FROM product_images WHERE image_id = :image_id"),
            {"image_id": image_id}
        )
        row = result.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Image not found")
        
        image_url = row.image_url
      
        db.execute(
            text("DELETE FROM product_images WHERE image_id = :image_id"),
            {"image_id": image_id}
        )
        db.commit()
        
        
        filename = image_url.split("/")[-1]
        file_path = IMAGE_DIR / filename
        if file_path.exists():
            file_path.unlink()
        
        return {"message": "Image deleted successfully", "image_id": image_id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting image: {str(e)}")