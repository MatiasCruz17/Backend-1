import express from 'express';
import CartManager from '../managers/CartManager.js'; 
const router = express.Router();

const cartManager = new CartManager('./src/data/carts.json'); 

router.post('/', async (req, res) => {
    const newCart = await cartManager.addCart();
    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cid);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(cart);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    const updatedCart = await cartManager.addProductToCart(cid, pid);

    if (!updatedCart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(updatedCart);
});

export default router;
