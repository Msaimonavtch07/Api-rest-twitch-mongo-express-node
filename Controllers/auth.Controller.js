//import {validationResult } from 'express-validator'
import { User } from "../models/User.js";
import { generateToken } from "../utils/TokenManager.js";
import { generateRefreshToken } from "../utils/TokenManager.js"; 

export const register = async(req, res) => {
    //const errors = validationResult(req)
    //if(!errors.isEmpty()){
    //    return res.status(400).json({ errors: errors.array() });
    //};

    const {email, passwork} = req.body
    try {
        // alternativa buscando por Email...
        let user = await User.findOne({ email })
        if(user) throw {
            code: 11000
        };

        user = new User({ email, passwork }); 

        await user.save()

        // Generar el JWT
        const {token, expiresIn} = generateToken(user._id)
        generateRefreshToken(user.id, res);

        return res.status(201).json({token, expiresIn});

    } catch (error) {
        console.log(error.code)
        // alternativa por defecto de mongoose...
        if(error.code === 11000) {
            return res.status(400).json({ error: 'ya este user existe...' });
        }
        return res.status(500).json({ error: 'fallo el servidor al cargar...' });
    }
};

export const login = async(req, res) => {

    console.log('entro aqui===???');

    try {
        const {email, passwork} = req.body

        let user = await User.findOne({ email })
        if(!user) 
            return res.status(403).json({ error: 'NO, este user no esta loguiado...' });

        const respuestaPasswork = await user.comparePasswork(passwork)
        if(!respuestaPasswork)  
            return res.status(403).json({ error: 'NO, la contraseña que ingreso es incorrecta...' });
        
        // Generar el JWT
        const {token, expiresIn} = generateToken(user._id)

        generateRefreshToken(user.id, res);

        res.cookie('token', token, {
            httpOnly: true,
            secure: !(process.env.MODO === "developer")
        });

        return res.json({token, expiresIn});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'fallo el servidor al cargar...' });
    }
};

export const infoUser = async(req, res) => {

    try {

        const user = await User.findById(req.uid).lean();
        return res.json({ email: user.email, user: user.id });
    } catch (error) {
        return res.status(500).json({ error: 'Error de server...' });
    }

};

export const tokenRefresh = (req, res) => {
    
    try {

        // const refreshTokenCookies = req.cookies.refreshToken
        // if(!refreshTokenCookies) throw new Error('NO existe el token...')

        // const {uid} = jwt.verify(refreshTokenCookies, process.env.JWT_SECRET); 
        const {token, expiresIn} = generateToken(req.uid);

        return res.json({token, expiresIn});

    } catch (error) {
        console.log(error);

        return res.status(500).json({ error: 'Error del tokenRefresh...😨' });

        // const TokenVerificationErros = {
        //     "invalid signature": 'la firma del JWT no es valida',
        //     "jwt expired": 'jwt expirado',
        //     "invalid token": 'token no validado',
        //     "No Bearer": 'utiliza formato Bearer',
        //     "jwt malformed": 'formato no valido...',
        // }

        // return res
        //     .status(401)
        //     .send({ error: TokenVerificationErros[error.message] });
    };

};

export const logOut = (req, res) => {
    res.clearCookie('refreshToken');
    req.json({ok: true});
};