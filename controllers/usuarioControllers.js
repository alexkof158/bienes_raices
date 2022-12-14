import Usuario from '../models/Usuario.js';

import { check, validationResult } from 'express-validator';
import {emailRegistro} from '../helpers/email.js';



import{generarId , generarJTW} from '../helpers/token.js';



const formularioLogin = (req, res) => {

    console.log(req.csrfToken());
    res.render('auth/login',{
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()

    })
}

const autenticar = async (req, res) => {
    await check('email', 'El email es obligatorio').isEmail().withMessage('Debe ir un email valido').run(req);
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req);

    let resultado =validationResult(req);

    
    
    if(!resultado.isEmpty()){
        return res.render('auth/login',{
            pagina: 'iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })

    }
    //Comprobar si el usuario existe
    const {email, password} = req.body;

    const usuario = await Usuario.findOne({where: {email: email}});
    if(!usuario){
        return res.render('auth/login',{
            pagina: 'iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}],
        })
    }
    // Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login',{
            pagina: 'iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu cuenta no esta confirmada'}],
        })
    }

    //Comprobar el password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login',{
            pagina: 'iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El password es incorrecto'}],
        })
    }

    //Autenticar el usuario
    const token = generarJTW(usuario.id);
    console.log(token);

    //Almacenar en un cookie

    return res.cookie('_token',token,{
        httpOnly: true,
        //secure: true,
        //sameSite: true
        
    }).redirect('/mis-propiedades')

}

const formularioRegistro = (req=request, res) => {

    res.render('auth/registro',{
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
        

    })
}

const registrar = async (req, res) => {
    ///Validar los datos
    await check('nombre', 'El nombre es obligatorio').not().isEmpty().withMessage('El nombre no puede ir vacio').run(req);
    await check('email', 'El email es obligatorio').isEmail().withMessage('Debe ir un email valido').run(req);
    await check('password').isLength({min: 6}).withMessage('El password debe ser de al menos 6 caracteres').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Los password no son iguales').run(req);
    
    let resultado =validationResult(req);

    
    
    if(!resultado.isEmpty()){
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario:{
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })

    }

    const {nombre, email, password} = req.body;

    // Verificar que el usuario no este duplicadp
    const existeusuario = await Usuario.findOne({where: {email: req.body.email}});
    if(existeusuario){
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya esta registrado'}],
            usuario:{
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }

    //Almacenar usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId(),
    })
    
    //Envia email de confirmación
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    

    //Mostrar mensaje de confirmación
    res.render('templates/mensaje',{
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un Email de Confirmación'
    })
    
}

const confirmar = async (req, res) => {
    const {token} = req.params;
    

    //Verificar que el token sea valido

    const usuario =  await Usuario.findOne({where: {token: token}});

    if(!usuario){
        return res.render('auth/confirmar-cuenta',{
            pagina: 'Token no Valido',
            mensaje: 'No hemos podido validar su token',
            error: true
        })
    }
    usuario.confirmado = true;
    usuario.token = null;
    await usuario.save();

    res.render('auth/confirmar-cuenta',{
        pagina: 'Token Valido',
        mensaje: 'LA CUENTA SE CONFIRMÓ CORRECTAMENTE',
    })   
    
    
}

const olvidePassword = (req, res) => {
    res.render('auth/olvidepassword',{
        pagina: 'Recupera tu Contraseña',
        csrfToken: req.csrfToken()
        

    })
}

const resetPassword =async(req, res) => {
 ///Validar los datos
    await check('email', 'El email es obligatorio').isEmail().withMessage('Debe ir un email valido').run(req);
 
    let resultado =validationResult(req);

    if(!resultado.isEmpty()){
        return res.render('auth/olvidepassword',{
            pagina: 'Recupera tu Contraseña',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        
        })

    }

    const {email} = req.body;


    //Verificar que el email exista
    const usuario = await Usuario.findOne({where: {email: email}});
    if(!usuario){
        return res.render('auth/olvidepassword',{
            pagina: 'Recupera tu Contraseña',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'EL EMAIL NO PERTENECE A NINGUN USUARIO'}],
        
        })
    }

    //Generar token y enviar email
    usuario.token = generarId();
    await usuario.save();

    //Envia email de confirmación


    //Renderizar mensaje de confirmación





}


// Funcion guardar formulario contacto



export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    olvidePassword,
    resetPassword,
    confirmar
    
}