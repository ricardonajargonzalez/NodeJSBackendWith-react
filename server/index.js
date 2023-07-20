
import express from 'express'
import http from "http";
import 'dotenv/config'
import { Server as SocketsServer } from "socket.io";
import axios, {isCancel, AxiosError} from 'axios';
import { instance } from './apiPrueba/config.js';
import { resolve } from "path";
import { PORT } from "./puertoConfig.js";
import morgan from "morgan";


const app = express()
const server = http.createServer(app)

/*
   EL CORS SOLO ES NECESARIO CUANDO SON PROYECTOS POR SEPARADOS / DIFERENTES SERVIDOS, PARA DECIR QUE SON DEL MISMO PROYECTO SE CONFIGURA EN FRONTEND VITE.CONFIG.JS
*/
// const io = new SocketsServer(server, {
//     cors : {
//         origin: "http://localhost:5173"
//     }
// })

const io = new SocketsServer(server)
app.use(morgan('dev'))
app.use(express.static(resolve('frontend/dist')))

io.on('connection', socket => {
    console.log('client connected');


    socket.on('message', ( data ) => {
        console.log(`mensaje recibido ${data}`)

        instance.get('/empleado/1')
            .then((response) => {
                console.log(response.data);
                socket.broadcast.emit('bToF', response.data)
            })
            .catch((error) => {
                if (isCancel(error)) {
                   console.log('La petición ha sido cancelada.');
                } else if (error instanceof AxiosError) {
                   console.error('Error de Axios:', error.message);
                } else {
                   console.error('Error:', error.message);
                }
            });

        //socket.broadcast.emit('bToF', data)
    })
})


server.listen(PORT)
console.log("coserver on port", PORT)

