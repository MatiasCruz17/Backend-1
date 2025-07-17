import express from "express";
import ProductManager from "../managers/ProductManager.js";

const router = express.Router();
const productManager = new ProductManager();

router.get("/products", async (req, res) => {
    try {
        const result = await productManager.getProducts(req.query);
        res.render("products", result);
    } catch (error) {
        res.status(500).send('error al cargar los productos');
    }
});

export default router;