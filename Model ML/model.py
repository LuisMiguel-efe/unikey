import tensorflow as tf
from tensorflow.keras.layers import Input, Conv1D, MaxPooling1D, Flatten, Dense, Lambda # type: ignore
from tensorflow.keras.models import Model # type: ignore
from tensorflow.keras import backend as K # type: ignore

# Definir la arquitectura base de la CNN
def create_base_network(input_shape):
    input = Input(shape=input_shape)
    
    # Expandir dimensiones para cumplir con la entrada de Conv1D
    x = Lambda(lambda x: K.expand_dims(x, axis=-1))(input)
    
    x = Conv1D(64, 5, activation='relu')(x)
    x = MaxPooling1D(pool_size=2)(x)
    x = Conv1D(128, 5, activation='relu')(x)
    x = MaxPooling1D(pool_size=2)(x)
    x = Conv1D(256, 5, activation='relu')(x)
    x = MaxPooling1D(pool_size=2)(x)
    x = Flatten()(x)
    x = Dense(256, activation='relu')(x)
    
    return Model(input, x)

# Definir la red siamese
def create_siamese_network(input_shape):
    # Dos entradas (huellas y etiquetas)
    input_a = Input(shape=input_shape)
    input_b = Input(shape=input_shape)
    
    # Red compartida
    base_network = create_base_network(input_shape)
    
    # Aplicar la red a las dos entradas
    processed_a = base_network(input_a)
    processed_b = base_network(input_b)
    
    # Definir la función lambda para calcular la distancia euclidiana
    def euclidean_distance(vectors):
        x, y = vectors
        return K.sqrt(K.sum(K.square(x - y), axis=1, keepdims=True))
    
    # Calcular la distancia entre los vectores procesados
    distance = Lambda(euclidean_distance)([processed_a, processed_b])
    
    # Definir el modelo
    model = Model(inputs=[input_a, input_b], outputs=distance)
    return model

# Compilar la red siamese
def compile_siamese_network(input_shape):
    siamese_network = create_siamese_network(input_shape)
    siamese_network.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return siamese_network
