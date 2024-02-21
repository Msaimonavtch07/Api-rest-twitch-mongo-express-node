//import {validationResult } from 'express-validator'
import { User } from "../models/User.js";
import jwt from "jsonwebtoken"; 

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
        return res.status(201).json({ ok: true });

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

    try {
        const {email, passwork} = req.body

        let user = await User.findOne({ email })
        if(!user) 
            return res.status(403).json({ error: 'NO, este user no esta loguiado...' });

        const respuestaPasswork = await user.comparePasswork(passwork)
        if(!respuestaPasswork) 
            return res.status(403).json({ error: 'NO, la contraseña que ingreso es incorrecta...' });
        
        // Generar el JWT
        const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET)


        return res.json({ token });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'fallo el servidor al cargar...' });
    }
};