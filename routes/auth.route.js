import {Router} from "express";
import { infoUser, logOut, login, register, tokenRefresh } from "../Controllers/auth.Controller.js";
// import { body } from "express-validator";
// import { validationResultExpress } from "../middleware/validationResultExpress.js";
import { requireToken } from "../middleware/requireToken.js";
import { requireRefreshToken } from "../middleware/requireRefreshToken.js";
import { bodyLoginValidator, bodyRegisterValidator } from "../middleware/validateManager.js";

const router = Router();

router.post(
    '/register', 
    bodyRegisterValidator, 
    register,
);

router.post(
    '/login', 
    bodyLoginValidator,
    login
);

router.get('/protected',requireToken , infoUser)
router.get('/refresh',requireRefreshToken ,tokenRefresh)
router.get('/logOut', logOut)

export default router; 