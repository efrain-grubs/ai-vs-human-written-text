import tensorflow as tf
import re
import pandas as pd
from keras.layers import TextVectorization
from sklearn.model_selection import train_test_split
from tensorflow import keras
from keras import layers,models

df = pd.read_csv('data.csv')

missing_values = df.isnull().sum()
#print(df.head())
print(missing_values)

def clean_text(text): 
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]',"",text)
    text = re.sub(r'\s+'," ",text)
    return text

X = df['text'].apply(clean_text).values #convert panda series to numpy array
Y = df['label']
#print(X)
#print(Y) # 0 or 1 



X_train,X_test,Y_train,Y_test = train_test_split(X,Y,test_size=0.1,random_state=42)


print(Y_train)

vectorize = TextVectorization(output_mode='int',output_sequence_length= 200, max_tokens= 10000)

vectorize.adapt(X_train)

vocab = vectorize.get_vocabulary() #save vocab

with open ("vocab.txt", "w") as f:
    for word in vocab: 
        f.write(word +'\n')



model = keras.Sequential()
model.add(vectorize)
model.add(layers.Embedding(input_dim= 10000,output_dim = 16,input_length = 200)) #size of vocab, how many features to learn, length of each input
model.add(layers.Dropout(0.3))
model.add(layers.GlobalAveragePooling1D())
model.add(layers.Dense(16,activation='relu'))
model.add(layers.Dense(1,activation= 'sigmoid'))




model.compile(
    optimizer = 'adam',
    loss = 'binary_crossentropy',
    metrics = ['accuracy']
)

model_training = model.fit(
    X_train,Y_train,
    validation_split = 0.2,
    batch_size = 32,
    epochs = 10
)

import matplotlib.pyplot as plt

plt.plot(model_training.history['accuracy'])
plt.plot(model_training.history['val_accuracy'])
plt.title("accuracy per epoch")
plt.show()

model_accuracy = model.evaluate(X_test,Y_test)

print('accuracy',model_accuracy[1])

def custom_prediction(text): 
    clean = clean_text(text)
    clean = tf.constant([clean]) #expects a batch
    predict = model.predict(clean)
    return predict

print("prediction",custom_prediction("the world is kinda red but not really and i dont know what to do like what the fuck iggger"))

model.save('ai_text.h5')