from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router.signup import router as signup_router
from router.login import router as login_router
from router.product import router as product_router
from fastapi.staticfiles import StaticFiles
from router.payment import router as buynow_router
from router.admin_product import router as admin_product_router
from router.admin_details import router as admin_details
from router.adminimage import router as adminimage

app=FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/images", StaticFiles(directory="C:/Users/dheve/OneDrive/Desktop/ecommerce/backend/images"), name="images")

app.include_router(signup_router)
app.include_router(login_router)
app.include_router(product_router)
app.include_router(buynow_router)
app.include_router(admin_product_router)
app.include_router(admin_details)
app.include_router(adminimage)



