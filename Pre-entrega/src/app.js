import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import http from 'http';

import viewsRouter from './routes/views.routes.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import ProductManager from './managers/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname (__filename);

const app = express();
const PORT = 8080;

const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'src/public')))

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const productManager = new ProductManager();

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    const productos = await productManager.getProducts();
    socket.emit('productosActualizados', productos);

    socket.on ('agregarProducto', async (nuevoProducto) => {
        await productManager.addProduct(nuevoProducto);
        const productosActualizados = await productManager.getProducts();
        io.emit ('productosActualizados', productosActualizados);
    });

    socket.on ('eliminarProducto', async (id) => {
        await productManager.deleteProduct(id);
        const productosActualizados = await productManager.getProducts();
        io.emit('productosActualizados', productosActualizados);
    })
})
httpServer.listen(PORT, () =>{
    console.log(`Servidor corriendo en ${PORT}`);
});
