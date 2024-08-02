from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import routes

app = FastAPI()

origins = [
    "http://192.168.0.119:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
