import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import http from 'http';
import connectBD from './config/db.js';

import viewsRouter from './routes/views.routes.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import ProductModel from './models/product.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const start = async () => {
    await connectBD();

    const httpServer = http.createServer(app);
    const io = new Server(httpServer);

    io.on('connection', async (socket) => {
        console.log('Nuevo cliente conectado por WebSocket');

        const productos = await ProductModel.find().lean();
        socket.emit('productosActualizados', productos);

        socket.on('agregarProducto', async (nuevoProducto) => {
            await ProductModel.create(nuevoProducto);
            const productosActualizados = await ProductModel.find().lean();
            io.emit('productosActualizados', productosActualizados);
        });

        socket.on('eliminarProducto', async (id) => {
            await ProductModel.findByIdAndDelete(id);
            const productosActualizados = await ProductModel.find().lean();
            io.emit('productosActualizados', productosActualizados);
        });
    });

    httpServer.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
};
start();
