import express from "express";

import csurf from "csurf";

import cookieParser from "cookie-parser";

import usuarioRoutes from "./routes/usuarioRoutes.js";
import propiedadesRoutes from "./routes/propiedadesRoutes.js";

import db from "./config/db.js";



const app = express();

app.use(express.urlencoded({ extended: true }));

//Habilitar cookie parser

app.use(cookieParser());

//Habilitar CSRF

app.use(csurf({ cookie: true }));

// Conectar a la base de datos
try {
  await db.authenticate();
  db.sync()
  console.log('Conectado a la BD correctamente');
  
} catch (error) {
  console.log(error);
}




//Habilitar pug
app.set('view engine', 'pug');
app.set('views', './views');

//Carpetas publicas
app.use(express.static('public'));

//Routing
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes)

// Definir un puerto y arrancar el servidor
const port = process.env.PORT || 8080 ;
app.listen(port, () => {
  console.log(`Servidor iniciado en puerto: ${port}`);
});