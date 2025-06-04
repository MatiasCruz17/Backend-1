const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../../products.json');

class ProductManager {
    constructor() {
        this.path = filePath;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async addProduct(productData) {
        const { title, description, price, code, stock, category, thumbnails } = productData;

        if (!title || !description || !price || !code || !stock || !category || !thumbnails) {
            console.log('Todos los campos son obligatorios.');
            return;
        }

        const products = await this.getProducts();

        const codeExistente = products.find(p => p.code === code);
        if (codeExistente) {
            console.log('El código ya existe.');
            return;
        }

        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            title,
            description,
            price,
            code,
            stock,
            status: true,
            category,
            thumbnails
        };

        products.push(newProduct);

        await fs.writeFile(this.path, JSON.stringify(products, null, 2));

        console.log('Producto agregado con éxito.');
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === parseInt(id));
        if (!product) {
            console.log('Producto no encontrado.');
            return null;
        }
        return product;
    }

    async updateProduct(id, campos) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === parseInt(id));

        if (index === -1) {
            console.log('Producto no encontrado.');
            return;
        }

        campos.id = products[index].id;

        products[index] = { ...products[index], ...campos };

        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        console.log('Producto actualizado.');
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const nuevosProductos = products.filter(p => p.id !== parseInt(id));

        if (products.length === nuevosProductos.length) {
            console.log('No se encontró el producto a eliminar.');
            return;
        }

        await fs.writeFile(this.path, JSON.stringify(nuevosProductos, null, 2));
        console.log('Producto eliminado.');
    }
}

module.exports = ProductManager;
