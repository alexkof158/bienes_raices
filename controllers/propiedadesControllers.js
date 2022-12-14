import {validationResult} from 'express-validator'
import {Precio,Categoria, Propiedad} from '../models/index.js'



const admin =(req,res)=>{
    res.render('propiedades/admin',{
        pagina: 'Administra tus propiedades',
        
        
    })
}

//formulario para crear una nueva propiedad
const crear = async (req,res)=>{
    //Consultar las categorias y los precios
    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])


    res.render('propiedades/crear',{
        pagina: 'Crea tu propiedad',
        csrfToken: req.csrfToken(),
        categorias: categorias,
        precios: precios,
        datos: {}
        
    })
}

const save = async (req,res)=>{
    //Validar los datos
    let resultado = validationResult(req);
    
    if(!resultado.isEmpty()){
        const [categorias,precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
    


    return res.render('propiedades/crear',{
        pagina: 'Crea tu propiedad',
        csrfToken: req.csrfToken(),
        categorias: categorias,
        precios: precios,
        errores: resultado.array(),
        datos: req.body
        
            
            
        })
    }

    //Crear un registro 
    const {titulo,descripcion,habitaciones,estacionamiento,wc,calle,lat,lng, precio: precioId, categoria: categoriaId} = req.body;
    
    const {id: usuarioId} = req.usuario

    try {
        const propiedad = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
            usuarioId,
            imagen: ''

            

            
        })
        const {id} = propiedad;
        res.redirect(`/propiedades/agregar-imagen/${id}`);
        
    } catch (error) {
        console.log(error);
    }

    console.log(req.body);

}

const agregarImagen = async (req,res)=>{
    res.render('propiedades/agregar-imagen',{
        pagina: 'Agregar Imagen',
    })
}

export {
    admin,
    crear,
    save,
    agregarImagen
}