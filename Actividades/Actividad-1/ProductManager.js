import http from "http";

const server = http.createServer( (request, response ) => {
    
});

class ProductManager {
    constructor (){
        this.products = [];
        this.currentId = 1;
    }

    addProduct (title, description, price, thumbnail, code, stock){
        if(!title || !description || !price || !thumbnail || !code || ! stock){
            console.log("todos los campos son obligatorios")
            return;
        }
        
        const codeRepetido = this.products.find(product => product.code === code);
        if (codeRepetido) {
            console.log(`Este codigo ya existe "${code}"`);
            return;
        }

        const nuevoProducto = {
            id: this.currentId ++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(nuevoProducto);
        console.log("nuevo producto agregado: ", nuevoProducto);
    }

    getProducts () {
        return this.products;
    }

    getProductsById (id){
        const product = this.products.find(p => p.id === id);
        if (!product) {
            console.log("Not found")
        } else{
            return product;
        }
    }
}

const manager = new ProductManager();

manager.addProduct("Celular", "Smartphone", 120000, "img1.jpg", "abc123", 5);
manager.addProduct("Celular", "Smartphone", 150000, "img2.jpg", "1234", 5);

console.log(manager.getProducts());

console.log(manager.getProductsById(1));
console.log(manager.getProductsById(5));

ProductManager.listen(8080);