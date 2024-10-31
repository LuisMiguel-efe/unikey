"""
Preprocesamiento de los datos, en este caso convertir cadena hexadecimal a un vector numérico normalizado
"""
import numpy as np

def hex_to_vector(hex_string):
    # Convierte la cadena hexadecimal a bytes
    bytes_data = bytes.fromhex(hex_string)
    # Convierte los bytes a un vector normalizado (0-1)
    vector = np.frombuffer(bytes_data, dtype=np.uint8) / 255.0
    return vector