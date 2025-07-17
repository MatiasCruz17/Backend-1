import mongoose from "mongoose";

const connectBD = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/backend-coder', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conectado a MongoDB correctamente');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

export default connectBD;