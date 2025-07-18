import express from "express";
import ProductManager from "../models/product.model.js";

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
        res.status(500).send('error al cargar los productos');
    }
});

export default router;