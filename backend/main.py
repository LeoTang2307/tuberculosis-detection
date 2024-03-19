from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import uvicorn
import tensorflow as tf
from io import BytesIO
from PIL import Image

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = tf.keras.models.load_model("./models/1")
class_names = ["Normal", "Tuberculosis"]

def convert_image_to_np_array(bytes):
    # Read bytes as PIL image and convert it to np array
    np_array = np.array(Image.open(BytesIO(bytes)))
    return np_array

@app.post("/predict")
async def predict_tuberculosis(file: UploadFile):
    bytes = await file.read()
    np_array = convert_image_to_np_array(bytes)
    batch_image = np.expand_dims(np_array, axis=0)
    resized_batch_image = np.resize(batch_image, (1,256,256,3))
    prediction = model.predict(resized_batch_image)
    label = class_names[np.argmax(prediction)]
    accuracy = np.max(prediction)
    return {
        "label": label,
        "accuracy": round(float(accuracy),2)
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)