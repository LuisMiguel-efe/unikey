export interface Option {
  text: string;
  next?: Step;
  response?: string;
}

export interface Step {
  message: string;
  options?: Option[];
}

export const conversationTree: Step = {
  message: '¡Hola! ¿En qué puedo ayudarte?',
  options: [
    {
      text: 'Problemas de software',
      next: {
        message: '¿Qué tipo de problema de software estás experimentando?',
        options: [
          {
            text: 'Problemas para iniciar sesión',
            next: {
              message: '¿Has olvidado tu contraseña?',
              options: [
                { text: 'Sí', response: 'Puedes restablecerla en la página de recuperación.' },
                { text: 'No', response: 'Verifica tu usuario y contraseña.' }
              ]
            }
          },
          {
            text: 'El sistema no reconoce las huellas dactilares',
            response: 'Asegúrate de que el sensor esté limpio y vuelve a intentarlo. Si el problema persiste, registra nuevamente la huella.'
          },
          {
            text: 'Problemas de conectividad en la plataforma web',
            response: 'Verifica tu conexión a Internet o intenta refrescar la página.'
          }
        ]
      }
    },
    {
      text: 'Problemas de hardware',
      next: {
        message: '¿Qué tipo de problema de hardware estás experimentando?',
        options: [
          {
            text: 'Problemas con el sensor de huellas',
            next: {
              message: '¿Cuál es el problema específico con el sensor de huellas?',
              options: [
                { text: 'El lector no responde', response: 'Revisa que el sensor esté correctamente conectado.' },
                { text: 'El lector no detecta la huella', response: 'Asegúrate de que el sensor esté limpio y funcional.' }
              ]
            }
          },
          {
            text: 'Problemas con la conexión de la ESP (Ethernet)',
            next: {
              message: '¿Cuál es el problema con la ESP y la conexión Ethernet?',
              options: [
                { text: 'No puede conectarse a la red', response: 'Verifica los cables y la configuración de red de la ESP.' },
                { text: 'La ESP no se comunica con el sistema', response: 'Asegúrate de que la ESP esté configurada correctamente y conectada a la red.' }
              ]
            }
          }
        ]
      }
    }
  ]
};
