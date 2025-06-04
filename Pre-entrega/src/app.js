const express = require('express');
const app = express();
const productsRouter = require('./routes/products.routes');

app.use(express.json());

app.use('/api/products', productsRouter);

app.listen(8080, () => {
    console.log('Servidor corriendo en http://localhost:8080');
});
