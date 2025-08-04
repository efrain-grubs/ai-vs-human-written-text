from flask import Flask,request,jsonify
from flask_cors import CORS
import tensorflow as tf
from keras.models import load_model
import re

app = Flask(__name__)
CORS(app)

model = load_model("ai_text.h5")

for layer in model.layers:
    print(layer.name)


with open ("vocab.txt", "r") as f: #reads whole file from top to bottom
    vocab = f.read().splitlines()

vectorize_layer = model.get_layer("text_vectorization")
vectorize_layer.set_vocabulary(vocab)

def clean_text(text): 
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]',"",text)
    text = re.sub(r'\s+'," ",text)
    return text

def make_prediction(text): 
    text = tf.constant([text]) #convert to tensor
    prediction = model.predict(text)
    return float(prediction[0][0])







@app.route('/predict',methods = ['POST'])
def predict():
    data = request.get_json()

    if not data or not data['text']: 
        return jsonify({'error': "user response not received"}),400
    user_text = data['text']
    
    text = clean_text(user_text)

    try:
        prediction = make_prediction(text)

        

    
        return jsonify({'prediction': prediction})
    except Exception as e: 
        return jsonify({'error': f"something went wrong,{e}"})
    


if __name__ == '__main__':
    app.run(debug=True)

    








