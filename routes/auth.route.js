import {Router} from "express";
import { infoUser, logOut, login, register, tokenRefresh } from "../Controllers/auth.Controller.js";
import { body } from "express-validator";
import { validationResultExpress } from "../middleware/validationResultExpress.js";
import { requireToken } from "../middleware/requireToken.js";
const router = Router();

router.post('/register', 
    [
        body('email', "formato de email incorrecto")
            .trim()
            .isEmail()
            .normalizeEmail(),

        body('passwork', "Minimo 6 caracteres") 
            .trim()
            .isLength({ min: 6 }),   

        body('passwork', "formato de passwork incorrecta")
            .custom((value, {req}) => {
                if(value !== req.body.repasswork) {
                    throw new Error('las contraseñas no coinciden'); 
                }
                return value;
            }),
    ], 
    validationResultExpress,
    register
);
router.post('/login', 
    [
        body('email', "formato de email incorrecto")
            .trim()
            .isEmail()
            .normalizeEmail(),

        body('passwork', "Minimo 6 caracteres") 
            .trim()
            .isLength({ min: 6 }),
    ] ,
    validationResultExpress,
    login
);

router.get('/protected',requireToken , infoUser)
router.get('/refresh', tokenRefresh)
router.get('/logOut', logOut)

export default router; 