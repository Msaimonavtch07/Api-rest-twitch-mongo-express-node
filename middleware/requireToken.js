import Jwt from "jsonwebtoken"
import { tokenVerificationErros } from "../utils/TokenManager.js";

export const requireToken = (req, res, next) => {

    try {

        let token = req.cookies.token;
        console.log(token);

        if(!token) 
            throw new Error('NO existe el token header en el Bearer...')

        // token = token.split(" ")[1];    

        const {uid} = Jwt.verify(token, process.env.JWT_SECRET)
        req.uid = uid;

        next()

    } catch (error) {
        console.log(error.message)
        return res
            .status(401)
            .send({ error: tokenVerificationErros[error.message] })

        // console.log(error)
        // return res.status(401).json({ error: error.message });

    };

};








// Respaldo del token.... 🍃😎

//import Jwt from "jsonwebtoken"

//export const requireToken = (req, res, next) => {

    //try {

        //let token = req.headers?.authorization;
        //console.log(token);

        //if(!token) 
            //throw new Error('NO extiste el token header en el Bearer...')

        //token = token.split(" ")[1];    

        //const {uid} = Jwt.verify(token, process.env.JWT_SECRET)
        //req.uid = uid;

        //next()

    //} catch (error) {
        //console.log(error.message)

        //const TokenVerificationErros = {
            //"invalid signature": 'la firma del JWT no es valida',
            //"jwt expired": 'jwt expirado',
            //"invalid token": 'token no validado',
            //"No Bearer": 'utiliza formato Bearer',
            //"jwt malformed": 'formato no valido...',
        //}

        //return res
            //.status(401)
            //.send({ error: TokenVerificationErros[error.message] })

        // console.log(error)
        // return res.status(401).json({ error: error.message });

    //};

//};