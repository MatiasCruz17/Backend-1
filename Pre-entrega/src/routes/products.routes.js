import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();

const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
});

router.post('/', async (req, res) => {
    const nuevoProducto = req.body;
    await productManager.addProduct(nuevoProducto);
    res.status(201).json({ mensaje: 'Producto creado' });
});

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const cambios = req.body;
    await productManager.updateProduct(pid, cambios);
    res.json({ mensaje: 'Producto actualizado' });
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    await productManager.deleteProduct(pid);
    res.json({ mensaje: 'Producto eliminado' });
});

export default router;
