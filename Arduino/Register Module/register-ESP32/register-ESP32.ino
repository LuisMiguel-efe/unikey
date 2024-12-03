#include <WiFi.h>            // Para ESP32, usa <ESP8266WiFi.h> si es ESP8266
#include <HTTPClient.h>      // Para hacer solicitudes HTTP
#include <WebServer.h>       // Para ejecutar el servidor web en el ESP
#include <Adafruit_Fingerprint.h>

// Configura tu red Wi-Fi
const char* ssid = "X3 pro";      // Reemplaza con el nombre de tu red Wi-Fi
const char* password = "a1234567"; // Reemplaza con la contraseña de tu red Wi-Fi
//WT32 ETH01
/*
const int RX_sensor=5;
const int TX_sensor=17;
*/
//ESP32
const int RX_sensor=16;
const int TX_sensor=17;


// Dirección del servidor backend Java (donde reenviarás los datos)
const char* backendServerURL = "http://192.168.224.219:8000/verificar_credenciales"; 
//const char* backendServerURL = "http://192.168.224.85:8081/huella"; 
//***************SENSOR**************

// Configuramos Serial2 para el sensor dactilar y Serial0 para la comunicación con la PC
HardwareSerial mySerial(2); // Serial2 en ESP32 (pines IO17 para TX y IO16 para RX)

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
uint8_t id=1;
uint8_t fingerTemplate[512]; // El template real
//************************************************


// Crear un servidor web en el puerto 80
WebServer server(80);

void setup() {
  // Inicia el monitor serial
  Serial.begin(9600);
  while (!Serial);  
  delay(100);

  // Conectar a la red Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("Conectado a la red WiFi");
  Serial.print("Dirección IP: ");
  Serial.println(WiFi.localIP());

  // Define la ruta y el manejo del POST en "/receive"
  server.on("/receive", HTTP_POST, handlePostRequest);

  // Iniciar el servidor
  server.begin();
  Serial.println("Servidor iniciado, esperando POST en /receive");


  // Configuración del puerto serial para el sensor dactilar
  mySerial.begin(57600, SERIAL_8N1, RX_sensor, TX_sensor); // RX = IO16, TX = IO17
  //Aseguramos la conexion del sensor  
  while (!finger.verifyPassword()) { 
    Serial.println("Did not find fingerprint sensor :("); 
    delay(500); 
  }
}

void loop() {
  // Procesar las solicitudes entrantes
  server.handleClient();
}




bool downloadFingerprintTemplate(uint16_t id)
{
  Serial.println("------------------------------------");
  Serial.print("Attempting to load #"); Serial.println(id);
  uint8_t p = finger.loadModel(id);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.print("Template "); Serial.print(id); Serial.println(" loaded");
      break;
    default:
      Serial.print("Unknown error "); Serial.println(p);
      finger.LEDcontrol(FINGERPRINT_LED_FLASHING, 25, FINGERPRINT_LED_RED, 10);
      delay(2000);
      return false;
  }

  Serial.print("Attempting to get #"); Serial.println(id);
  p = finger.getModel();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.print("Template "); Serial.print(id); Serial.println(" transferring:");
      break;
    default:
      Serial.print("Unknown error "); Serial.println(p);
      finger.LEDcontrol(FINGERPRINT_LED_FLASHING, 25, FINGERPRINT_LED_RED, 10);
      delay(2000);
      return false;
  }

  uint8_t bytesReceived[534]; // 2 paquetes de datos
  memset(bytesReceived, 0xff, 534);

  uint32_t starttime = millis();
  int i = 0;
  while (i < 534 && (millis() - starttime) < 20000) {
    if (mySerial.available()) {
      bytesReceived[i++] = mySerial.read();
    }
  }
  Serial.print(i); Serial.println(" bytes read.");
  Serial.println("Decoding packet...");

  
  memset(fingerTemplate, 0xff, 512);

  // Filtrando solo los paquetes de datos
  int uindx = 9, index = 0;
  memcpy(fingerTemplate + index, bytesReceived + uindx, 256);   // Primeros 256 bytes
  uindx += 256;
  uindx += 2;    // Saltar el checksum
  uindx += 9;    // Saltar el siguiente header
  index += 256;
  memcpy(fingerTemplate + index, bytesReceived + uindx, 256);   // Siguientes 256 bytes





  Serial.println("\ndone.");

  return true;
}

uint8_t getFingerprintEnroll() {
  int p = -1;
  Serial.print("Waiting for valid finger to enroll as #"); Serial.println(id);
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      //finger.LEDcontrol(FINGERPRINT_LED_ON, 0, FINGERPRINT_LED_PURPLE);
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.print(".");
      break;
    default:
      //finger.LEDcontrol(FINGERPRINT_LED_FLASHING, 25, FINGERPRINT_LED_RED, 10);
      //delay(2000);
      //Serial.println("Unknown error");
      break;
    }
  }

  p = finger.image2Tz(1);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    default:
      Serial.println("Unknown error");
      finger.LEDcontrol(FINGERPRINT_LED_FLASHING, 25, FINGERPRINT_LED_RED, 10);
      delay(2000);
      return p;
  }

  Serial.println("Remove finger");
  delay(10);
  
  
  
  Serial.print("ID "); Serial.println(id);
  p = -1;
  Serial.println("Place same finger again");
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      //finger.LEDcontrol(FINGERPRINT_LED_OFF, 0, FINGERPRINT_LED_PURPLE);
      break;
    default:
      Serial.println("Unknown error");
      finger.LEDcontrol(FINGERPRINT_LED_FLASHING, 25, FINGERPRINT_LED_RED, 10);
      delay(2000);
      break;
    }
  }

  p = finger.image2Tz(2);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    default:
      Serial.println("Unknown error");
      finger.LEDcontrol(FINGERPRINT_LED_FLASHING, 25, FINGERPRINT_LED_RED, 10);
      delay(2000);
      return p;
  }

  Serial.print("Creating model for #");  Serial.println(id);

  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println("Prints matched!");
  } else {
    Serial.println("Unknown error");
    finger.LEDcontrol(FINGERPRINT_LED_FLASHING, 25, FINGERPRINT_LED_RED, 10);
    delay(2000);
    return p;
  }

  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println("Stored!");
  }else {
    Serial.println("Unknown error");
    finger.LEDcontrol(FINGERPRINT_LED_FLASHING, 25, FINGERPRINT_LED_RED, 10);
    delay(2000);
    return p;
  }

  return true;
}




String fingerprintToHexString(uint8_t *data, size_t length) {
  String hexString = "";
  for (size_t i = 0; i < length; i++) {
    if (data[i] < 16) hexString += "0";
    hexString += String(data[i], HEX);
  }
  return hexString;
}


// Manejar la solicitud POST que llega a "/receive"
void handlePostRequest() {
  if (server.hasArg("plain")) {
    
    String cedula = server.arg("plain");  // Obtener el cuerpo de la solicitud POST como cédula
    Serial.println("Cédula recibida:");
    Serial.println(cedula); // Imprimir la cédula recibida


    String jsonToSend = "{\"templates\":{";
    jsonToSend += "\"cedula\":\"" + cedula + "\",";  // Incluir la cédula como un template

    int n_temp= 1;
    for(int i=0; i<3; i++){
      finger.LEDcontrol(FINGERPRINT_LED_ON, 0, FINGERPRINT_LED_PURPLE);
      for(int j=0;j<3;j++){
        while (! getFingerprintEnroll() );
        if(downloadFingerprintTemplate(id)){
          //send fingerprint
          String fingerprintHex = fingerprintToHexString(fingerTemplate, 512);
          if(n_temp==9){
            jsonToSend += "\"template"+String(n_temp)+"\":\""+ fingerprintHex +"\"}}";
          }else{
            jsonToSend += "\"template"+String(n_temp)+"\":\""+ fingerprintHex +"\",";
          }
          
        }
        n_temp++;
      }

      
      
      delay(100);
      int p = 0;
      while (p != FINGERPRINT_NOFINGER) {
        finger.LEDcontrol(FINGERPRINT_LED_OFF, 0, FINGERPRINT_LED_PURPLE);
        p = finger.getImage();
        delay(10);
      }
       
    }
    n_temp=1;

    Serial.print("JSON a enviar: ");
    Serial.println(jsonToSend);

    // Reenviar el JSON al backend Java
    if(forwardPostToBackend(jsonToSend)){
      server.send(200, "application/json", "{\"message\":\"POST recibido y reenviado\"}");
      // Responder al cliente que el POST fue recibido
    }else{
      server.send(400, "application/json", "{\"error\":\"Error de comunicación con el servidor de registro\"}");
    }

  } else {
    // Enviar un error si no hay payload
    server.send(400, "application/json", "{\"error\":\"No se encontró el cuerpo de la solicitud\"}");
  }
}

// Función para reenviar el POST al servidor backend Java
bool forwardPostToBackend(String payload) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Inicia una nueva solicitud POST al servidor backend
    http.begin(backendServerURL);
    http.addHeader("Content-Type", "application/json");

    // Enviar la solicitud POST con el JSON recibido
    int httpResponseCode = http.POST(payload);

    // Verificar la respuesta del servidor
    if (httpResponseCode == 200) {
      String response = http.getString();
      Serial.println("Código de respuesta del backend: " + String(httpResponseCode));
      Serial.println("Respuesta del backend: " + response);
      http.end();
      return true;


    } else {
      Serial.println("Error al hacer POST al backend");
      http.end();
      return false;
    }

    // Finalizar la solicitud
    
  } else {
    Serial.println("Error: No hay conexión WiFi");
    return false;
  }
}
