import express from "express";
import ProductManager from "../managers/ProductManager.js";

const viewsRouter = express.Router();
const productManager = new ProductManager();

viewsRouter.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products });
});

export default viewsRouter;