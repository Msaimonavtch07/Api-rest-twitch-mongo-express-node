import 'dotenv/config';
import './database/connectDB.js';
import cors from 'cors';
import express from "express";
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import LinkRouter from './routes/link.route.js';
import redirectRouter from './routes/redirect.router.js';

const app = express();

const whiteList = [process.env.ORIGIN1]

app.use(cors({
    origin: function (origin, callback) {
        if(whiteList.includes(origin)){
            return callback(null, origin);
        }
        return callback('Error de CORS origin: ' + origin + ' No autorizado 😡 ')
    }
}));

app.use(express.json());
app.use(cookieParser());

// ejemplo Back redireccional (opcional)
app.use('/', redirectRouter);

app.use('/api/v1/auth', authRouter); 
app.use('/api/v1/links', LinkRouter);

// Solo de ejemplo del login index...

// Se hizo solo con fines ilustrativos.... 😁
// app.use(express.static('public'))

// app.get('/', (req, res) => {
//     res.json({ ok: true });
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('😎😎😎 http://localhost:' + PORT));