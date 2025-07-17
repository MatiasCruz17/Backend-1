import express from 'express';
import CartManager from '../managers/CartManager.js'; 

const router = express.Router();
const cartManager = new CartManager(); 

//aca creo el carrito
router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

//obtengo el carrito con ID "populateados"
router.get('/68794f38457691cf12c44533', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
});

// agrego el producto al carrito
router.post('/68794f38457691cf12c44533/products/:pid', async (req, res) => {
    const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    if (!cart) return res.status(404).json ({ error: 'Carrito no encontrado'});
    res.json(cart)
});

// elminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const cart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
    if (!cart) return res.status(404).json ({ error: 'Carrito no encontrado'});
    res.json(cart);
});

//Borrar todo el carrito
router.delete('/68794f38457691cf12c44533', async (req, res) => {
    const cart = await cartManager.clearCart (req.params.cid);
    if (!cart) return res.status(404).json ({ error: 'carrito no encontrado'});
    res.json({ message: 'Carrito vaciado'});
})

export default router;
