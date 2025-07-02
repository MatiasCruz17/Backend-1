import fs from "fs";
import path from "path";

class CartManager {
    constructor(pathFile) {
        this.path = pathFile;
    }

    async getCarts() {
        if (fs.existsSync(this.path)) {
            const info = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(info);
        } else {
            return [];
        }
    }

    async saveCarts(carts) {
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    }

    async addCart() {
        const carts = await this.getCarts();

        const newCart = {
            id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
            products: []
        };

        carts.push(newCart);
        await this.saveCarts(carts);
        return newCart;
    }

    async getCartById(cid) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cid);
        return cart || null;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cartId);

        if (!cart) {
            return null;
        }

        const existingProduct = cart.products.find(p => p.product === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }

        await this.saveCarts(carts);
        return cart;
    }
}

export default CartManager;
