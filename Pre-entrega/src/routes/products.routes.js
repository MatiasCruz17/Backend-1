import express from 'express';
import Product from '../models/product.model.js';

const router = express.Router();

// products con paginación, orden, filtro
router.get('/', async (req, res) => {
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
            options.sort = { price: 1 };
        } else if (sort === "desc") {
            options.sort = { price: -1 };
        }

        const result = await Product.paginate(filter, options);

        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage
                ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort || ""}&query=${query || ""}`
                : null,
            nextLink: result.hasNextPage
                ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort || ""}&query=${query || ""}`
                : null
        });

    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

//agarrar un producto
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;

        const product = await Product.findById(pid).lean();

        if (!product) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }

        res.json({ status: "success", product });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

export default router;
