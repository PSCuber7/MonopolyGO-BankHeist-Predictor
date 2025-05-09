from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import cv2 import uvicorn


app = Flask(__name__)

@app.route('/detect', methods=['POST'])
def detect_tiles():
    image_file = request.files['image']
    image = Image.open(image_file.stream).convert("RGB")
    img_array = np.array(image)
    
    resized = cv2.resize(img_array, (400, 300))  # Assume 4x3 grid
    tile_h, tile_w = 100, 100
    opened_tiles = []

    for row in range(3):
        for col in range(4):
            tile = resized[row * tile_h:(row + 1) * tile_h, col * tile_w:(col + 1) * tile_w]
            avg_color = tile.mean()
            if avg_color > 180:  # Rough threshold
                opened_tiles.append(row * 4 + col)

    prediction = predict_rings(opened_tiles)
    return jsonify({"opened": opened_tiles, "predicted": prediction})

def predict_rings(opened_tiles):
    patterns = {
        frozenset([0, 5]): [1, 6, 11],
        frozenset([3, 4]): [2, 7, 10],
        frozenset([1, 2, 7]): [0, 4, 8]
    }
    key = frozenset(opened_tiles)
    return patterns.get(key, [i for i in range(12) if i not in opened_tiles][:3])

import uvicorn

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=10000)
