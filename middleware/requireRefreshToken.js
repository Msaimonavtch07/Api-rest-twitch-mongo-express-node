import { tokenVerificationErros } from "../utils/TokenManager.js";
import jwt from "jsonwebtoken";

export const requireRefreshToken = (req, res, next) => {
    try {
        
        const refreshTokenCookies = req.cookies.refreshToken
        if(!refreshTokenCookies) throw new Error('NO existe el token...')

        const {uid} = jwt.verify(refreshTokenCookies, process.env.JWT_SECRET);

        req.uid = uid;
        next();

    } catch (error) {
        console.log(error);

        res.status(401).json({error: tokenVerificationErros[error.message]});
    }
}