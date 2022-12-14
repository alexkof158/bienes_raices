import { exit } from 'node:process'
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import categorias from "./categorias.js";
import db from "../config/db.js";
import {Categoria,Precio, Usuario} from '../models/index.js'

const importarDatos = async () => {
    try {
        //Autenticar
        await db.authenticate();
        //Generar las columnas
        await db.sync();

        //Insertar datos
        await Promise.all([
            Precio.bulkCreate(precios),
            Categoria.bulkCreate(categorias),
            Usuario.bulkCreate(usuarios)
        ])
        console.log('Datos importados Correctamente');
        exit(0);
        
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

const eliminarDatos = async () => {
    try {
        await db.sync({force: true})
        console.log('Datos eliminados Correctamente');
        exit(0);

        
    } catch (error) {
        console.log(error);
        exit(1)
    }
}

if(process.argv[2] === '-i'){
    importarDatos();
}

if(process.argv[2] === '-e'){
    eliminarDatos();
}