import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import joblib
import numpy as np
import random

app = Flask(__name__)
CORS(app)
#C:/Users/danie/Desktop/dev/python/rub/train/runs/segment/train2/weights/
model_path = 'last.pt'
model = YOLO(model_path)
regre_model = joblib.load('predict_model.pkl')



@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No se ha enviado ningún archivo'})

    file = request.files['file']

    image = cv2.imread(file)


    results = model(image)

    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    all_masks = []
    all_weight = []
    m = 0
    m1 = 0
    for result in results:
        for j, mask in enumerate(result.masks.data):
            color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
            mask = mask.numpy() * 255
            mask =mask.astype(np.uint8)
            mask = cv2.resize(mask, (image.shape[1], image.shape[0]))
            mask_colored = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
            mask_colored[mask > 0] = color

            all_masks.append(mask_colored)

            H, W = mask.shape
            contours, hierarchy = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

            polygons = []
            for cnt in contours:
                if cv2.contourArea(cnt) > 200:
                    polygon = []
                    for point in cnt:
                        x, y = point[0]
                        polygon.append(x / W)
                        polygon.append(y / H)
                    polygons.append(polygon)

            garea = 0
            gperimetro = 0
            gratio = 0

            for polygon in polygons:
                area, perimetro, aspect_ratio = caracteristicas(polygon)
                if area > garea:
                    garea = area
                if perimetro > gperimetro:
                    gperimetro = perimetro
                if aspect_ratio > gratio:
                    gratio = aspect_ratio

            print(garea, gperimetro, gratio, 3.10)
            datos = np.array([garea, gperimetro, gratio, 3.10])
            # Convertir el arreglo unidimensional a una matriz bidimensional
            datos_2d = datos.reshape(1, -1)
            predicciones_nuevas = regre_model.predict(datos_2d)
            print('PREDECIR', predicciones_nuevas)

            objeto = {"peso":predicciones_nuevas.tolist()[0] , "color": '#{0:02x}{1:02x}{2:02x}'.format(*color)}
            all_weight.append(objeto)


    combined_mask = sum(all_masks)
    retval, buffer = cv2.imencode('.png', combined_mask)
    m = base64.b64encode(buffer).decode('utf-8')
    print(all_weight)



    return jsonify({'mask_base64': m, 'peso':all_weight})  # Devolver la máscara en base64


def caracteristicas(polygon):
    points_pairs = [(polygon[i], polygon[i + 1]) for i in range(0, len(polygon), 2)]
    ply = np.array(points_pairs, dtype=np.float32)
    # Calcula el área
    area = cv2.contourArea(ply)

    # Calcula el perímetro
    perimetro = cv2.arcLength(ply, True)

    x, y, w, h = cv2.boundingRect(ply)

    aspect_ratio = h / w if w > 0 else 0

    return area, perimetro, aspect_ratio



if __name__ == '__main__':
    app.run(debug=True)