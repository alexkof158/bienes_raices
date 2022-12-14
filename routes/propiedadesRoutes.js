import express from 'express';
import {body} from 'express-validator'
import { admin,agregarImagen,crear, save } from '../controllers/propiedadesControllers.js';
import protegerRuta from '../middleware/protegerRuta.js';
 
const router = express.Router();

router.get('/mis-propiedades',protegerRuta, admin)
router.get('/propiedades/crear',protegerRuta, crear)
router.post('/propiedades/crear',
    protegerRuta, 
    body('titulo').notEmpty().withMessage('El titulo es obligatorio'),
    body('descripcion').notEmpty().withMessage('La Descripción no puede ir vacia'),
    body('categoria').isNumeric().withMessage('Debes seleccionar una categoria'),
    body('precio').isNumeric().withMessage('Debes seleccionar un precio'),
    save
)

router.get('/propiedades/agregar-imagen/:id', agregarImagen)




export default router;