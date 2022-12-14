

import  Usuario  from '../models/Usuario.js'; 
import jwt from 'jsonwebtoken';

const protegerRuta =async (req, res, next) => {
    //Verificar si hay un token
    const{_token} = req.cookies;
    if(!_token){
        return res.redirect('/auth/login');
    }

    //Comprobar el token
    try {
        const decode = jwt.verify(_token, process.env.JTW_SECRET);
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decode.id);
        

        //Almacenar el usuario al Request
        if(usuario){
            req.usuario = usuario;

        }else{
            return res.redirect('/auth/login')
        }
        return next();


        
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login');
    }

    
}


export default protegerRuta;