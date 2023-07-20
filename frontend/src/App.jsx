
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { backEndApi } from './api/BackEndApi';

//const socket = io("http://localhost:4000")  esto se configuro en el proxy de vite.config.js
const socket = io("/")

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



 function App() {

  const [message, setmessage] = useState('');
  const [messages, setmessages] = useState([]);
  const [respApi, setrespApi] = useState(null)


 


  useEffect(() => {
     
    socket.on('bToF', message =>{
      console.log(message);
      receiveMessage(message)
      setrespApi(message)
     // console.log(respApi)
    })

    return () => {
       socket.off('message')
    }
    
  }, [])


  useEffect(() => {

      backEndApi.get('/empleado/1')
      .then((response) => {
        // Guardar los datos en el estado
        console.log("useefect 1 axios");
        console.log(response.data);
        setrespApi(response.data);
      })
      .catch((error) => {
        console.error('Error:', error.message);
        console.log("useefect 1 axios error");
      });

  }, [])


  const receiveMessage = (message) => setmessages(state => [...state, message] ) //conservar estado anterior y agregar el nuevo

  

  const handleSubmit = ( e ) => {
    e.preventDefault()
   
    socket.emit('message', message)
  }

  const showNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {


      toast.success('¡Notificación de ejemplo!', {
        position: toast.POSITION.TOP_RIGHT, // Ubicación de la notificación
        autoClose: 3000, // Duración en milisegundos (3 segundos en este caso)
      });

    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        
        if (permission === 'granted') {
          showNotification();
        }else{
          console.log("No se tiene permiso");
        }
      }
      );
    }else{
         console.log(Notification.permission);
    }
  };

  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
      });
    }
  };



  const handleEnableNotifications = () => {
    if (notificationPermission === 'default') {
      checkNotificationPermission();
    }
  };



  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={ (e) => setmessage(e.target.value) } placeholder="Escribe ensaje"/>
        </form>
      <button onClick={showNotification}>Mostrar notificación</button>
        <ToastContainer />

        <div>
      {notificationPermission === 'default' && (
        <p>
          Para recibir notificaciones, necesitas habilitar los permisos de notificación del navegador.
          <button onClick={handleEnableNotifications}>Habilitar notificaciones</button>
        </p>
      )}

      {notificationPermission === 'denied' && (
        <p>
          Los permisos de notificación están bloqueados en tu navegador. Para recibir notificaciones,
          puedes habilitarlos desde la configuración del navegador.
        </p>
      )}

    </div>


      <ul>
       
          {/* {

          messages.map( (message, index ) => (
            <li key={index}>{message}</li>
          ) )
          } */}

          {/* Renderizar el JSON */}
          {respApi ? (
            <pre>{JSON.stringify(respApi, null, 2)}</pre>
          ) : (
            <p>Sin datos.</p>
          )}

        
      </ul>
    </div>
  )
}

export default App

