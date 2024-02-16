import mongoose from "mongoose";

try {

    await mongoose.connect(process.env.URI_MONGO);
    console.log('la conexion con mongodb fue exitosa 🍃');

} catch (error) {
    console.log('la conexion con mongodb fallo 😨' + error);
};
