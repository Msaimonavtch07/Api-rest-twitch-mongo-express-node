import axios from "axios";
import { validationResult, body, param } from "express-validator";

export const ValidationResultExpress = (req, res, next) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    };
    next();

};

export const paramsLinkValidator = [
    param("id", 'formato no valido (express-Validator) ')
    .trim()
    .notEmpty()
    .escape()
    ,
    ValidationResultExpress,
];

export const bodyLinkValidator = [
    body("longLink", 'formato de link incorrecto...')
    .trim()
    .notEmpty()
    .custom(async value => {
        try {

            if (!value.startsWith('https://')) {
                value = 'https://' + value;
            };
            console.log(value);

            await axios.get(value);
            return value;

        } catch (error) {
            console.log(error);
            throw new Error('not found longlink 404');
        }
    })
    // .exists()
    ,
    ValidationResultExpress,
];

export const bodyRegisterValidator = [
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
    ValidationResultExpress,    
];

export const bodyLoginValidator = [
    body('email', "formato de email incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),

    body('passwork', "Minimo 6 caracteres") 
        .trim()
        .isLength({ min: 6 }),
    ValidationResultExpress,
];