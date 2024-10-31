from fastapi import BackgroundTasks, FastAPI, Form 
from pydantic import BaseModel
import numpy as np
from pymongo import MongoClient
from model import compile_siamese_network
from convert_template import hex_to_vector
from datetime import datetime

# Crear una instancia de FastAPI
app = FastAPI()

# Conexión a MongoDB
client = MongoClient('mongodb+srv://luortiz:321@cluster0.n3xcu.mongodb.net/')
db = client['bioaccess']
collection_huellas = db['huellas']
collection_accesos = db["accesos"]

# Definir el path de los pesos guardados (modelo ML)
model_path = 'siamese_model.keras'
# Definir la forma de entrada (Tamaño fijo de los templates)
input_shape = (512,)
# Compilar y cargar el modelo
model = compile_siamese_network(input_shape)
model.load_weights(model_path)

# Modelo de datos esperado por el servidor para el registro
class TemplateData(BaseModel):
    cedula: str
    template1: str
    template2: str
    template3: str
    template4: str
    template5: str

class FingerprintRequest(BaseModel):
    templates: TemplateData

# Ruta para registrar un nuevo usuario
@app.post("/registrar_usuario")
async def registrar_usuario(data: FingerprintRequest):
    cedula = data.templates.cedula
    fingerprints_hex = [
        data.templates.template1,
        data.templates.template2,
        data.templates.template3,
        data.templates.template4,
        data.templates.template5
    ]

    # Convertir las cadenas hexadecimales en vectores numéricos
    fingerprints_vectors = [hex_to_vector(fingerprint) for fingerprint in fingerprints_hex]

    # Almacenar los vectores numéricos en lugar de las cadenas hexadecimales
    fingerprints_matrix = np.array(fingerprints_vectors) 
    # Guardar los vectores en la base de datos junto con la cédula
    registro = {
        "_id": cedula,
        "templates": fingerprints_matrix.tolist(),  # Guardamos los vectores directamente
    }
    collection_huellas.insert_one(registro)

    return {"status": "200 OK", "mensaje": "Usuario registrado exitosamente"}

# Ruta de autenticación para comparar huellas con el modelo Siamese
@app.post("/autenticar_huella")
async def autenticar_huella(
    background_tasks: BackgroundTasks,  # Añadimos BackgroundTasks para ejecutar tareas en segundo plano
    template: str = Form(...), 
    porteria: str = Form(...),  # Número de la portería recibido en la solicitud
):
    # Convertir la huella en un vector numérico
    vector_huella = hex_to_vector(template).reshape(1, -1)
    # Obtener todas las huellas almacenadas 
    registros = list(collection_huellas.find({}))
    if not registros:
        # Si no hay registros, registrar el acceso fallido
        background_tasks.add_task(registrar_acceso, None, porteria, False)
        print("Fingerprint database Empty")
        return {"status": "No autenticado", "mensaje": "No se encontraron huellas en la base de datos."}

    # Variables para almacenar el mejor resultado
    mejor_similitud = float('inf')  # Queremos minimizar la distancia
    cedula_autenticada = None
    print(mejor_similitud)
    # Comparar la huella ingresada con todas las huellas almacenadas en ese cluster
    for registro in registros:
        stored_vectors = np.array(registro['templates'])  # Recuperar los vectores directamente
        # Repetimos el vector de huella ingresado para hacer comparaciones por lotes
        input_vectors = np.repeat(vector_huella, len(stored_vectors), axis=0)
        # Comparar todas las huellas en bloque con el modelo Siamese
        distancias = model.predict([input_vectors, stored_vectors])
        # Encontrar la distancia mínima
        min_distancia = distancias.min()
        if min_distancia < mejor_similitud:
            mejor_similitud = min_distancia
            cedula_autenticada = registro['_id']

    # Definir un umbral para considerar una coincidencia (ajustar según rendimiento)
    umbral_similitud = 0.1
    print(mejor_similitud)
    if mejor_similitud < umbral_similitud:
        # Si autenticado, registrar el acceso exitoso
        background_tasks.add_task(registrar_acceso, cedula_autenticada, porteria, True)
        print("*** cedula autenticada: " + cedula_autenticada)
        #return{"valid": True}
        return {"status": "Autenticado", "Cedula": cedula_autenticada}
    else:
        # Si no autenticado, registrar el acceso fallido
        background_tasks.add_task(registrar_acceso, None, porteria, False)
        print("NO AUTENTICADO")
        #return{"valid": False}
        return {"status": "No autenticado"}
    
# Función asíncrona para registrar el acceso
async def registrar_acceso(cedula, porteria, autenticado):
    # Fecha y hora actual
    fecha_acceso = datetime.now()
    # Si la autenticación falló, la cédula es None
    if not autenticado:
        cedula = None
    # Crear el registro de acceso
    registro_acceso = {
        "cedula": cedula,
        "porteria": porteria,
        "fecha_hora": fecha_acceso,
        "autenticado": autenticado
    }
    # Insertar el registro en la colección "accesos"
    collection_accesos.insert_one(registro_acceso)