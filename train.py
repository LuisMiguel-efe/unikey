import numpy as np
from tensorflow.keras.callbacks import ModelCheckpoint # type: ignore
from dataset_train import load_data
from model import compile_siamese_network
import os

# Función para generar pares de datos (pares positivos y negativos)
def create_pairs(data, labels):
    pairs = []
    labels_pairs = []
    num_classes = len(np.unique(labels))
    
    for i in range(len(data)):
        for j in range(i+1, len(data)):
            if labels[i] == labels[j]:
                # Par positivo (mismo usuario)
                pairs.append([data[i], data[j]])
                labels_pairs.append(1)
            else:
                # Par negativo (diferentes usuarios)
                pairs.append([data[i], data[j]])
                labels_pairs.append(0)
    
    return np.array(pairs), np.array(labels_pairs)

# Entrenar el modelo de forma incremental
def incremental_training():
    # Cargar datos
    data, labels = load_data()
    # Generar pares de datos
    pairs, labels_pairs = create_pairs(data, labels)
    # Definir la forma de la entrada
    input_shape = data.shape[1:]
    print(input_shape)
    # Cargar el modelo (si existe)
    model_path = 'siamese_model.keras'
    if os.path.exists(model_path):
        print("Cargando modelo preentrenado...")
        model = compile_siamese_network(input_shape)
        model.load_weights(model_path)
        print(input_shape)
    else:
        print("Entrenando nuevo modelo...")
        model = compile_siamese_network(input_shape)
    
    # Configurar ModelCheckpoint para guardar el mejor modelo
    checkpoint = ModelCheckpoint(model_path, monitor='val_loss', save_best_only=True, verbose=1)
    # Entrenar el modelo
    model.fit([pairs[:, 0], pairs[:, 1]], labels_pairs, validation_split=0.2, epochs=10, callbacks=[checkpoint])
    print(input_shape)
# Llamar a la función de entrenamiento incremental
incremental_training()