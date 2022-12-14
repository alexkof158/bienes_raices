import express from "express";


import { formularioLogin, formularioRegistro, olvidePassword, registrar, confirmar,resetPassword, autenticar } from "../controllers/usuarioControllers.js";

const router = express.Router();



router.get('/login', formularioLogin)    
router.post('/login', autenticar)    

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get('/confirmar/:token', confirmar)


router.get('/olvidepassword', olvidePassword)
router.post('/olvidepassword', resetPassword)





export default router;