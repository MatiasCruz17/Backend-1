import CartModel from '../models/cart.model.js';

class CartManager {
    async createCart(){ 
        const newCart = await CartModel.create({ products: []});
        return newCart;
    }
    async getCartById(id){
        return await CartModel.findById(id).populate('products.product');
    }
    async addProductToCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;

        const index = cart.products.findIndex(p => p.product.toString() === productId);

        if (index !== -1) {
            cart.products[index].quantity += 1;
        } else {
            cart.products.push({ product: productId });
        }
        await cart.save();
        return await cart.populate('products.product');
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;

        cart.products = cart.products.filter (p => p.product.toString() !== productId)
        await cart.save();
        return cart;
    }

    async clearCart(cartId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;

        cart.products = [];
        await cart.save();
        return cart;
    }
}

export default CartManager;