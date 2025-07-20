import express from "express";
import Product from "../models/product.model.js"
import CartManager from "../managers/CartManager.js";

const cartManager = new CartManager();
const router = express.Router();

router.get("/products", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        
        const filter = {};
        if (query) {
            if (query === "true" || query === "false") {
                filter.status = query === "true";
            } else {
                filter.category = query;
            }
        }
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true
        };
        if (sort === "asc") {
            options.sort = {price: 1};
        } else if (sort === "desc"){
            options.sort = { price: -1 };
        }
        const result = await Product.paginate(filter, options); 

        res.render("products", {
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage
        });
    } catch (error) {
        console.log("Error al cargar los productos:", error);
        res.status(500).send('error al cargar los productos');
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).lean();
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }
        res.render("productDetail", { product });
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await Product.findById(pid).lean();

        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }

        res.render("productDetail", { product });
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }
        res.render("cart", { products: cart.products });
    } catch (error) {
        console.error("Error al cargar el carrito:", error);
        res.status(500).send("Error interno del servidor");
    }
});

export default router;