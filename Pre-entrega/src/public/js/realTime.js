const socket = io();

const productList = document.getElementById('product-list');

socket.on('productosActualizados', (productos) => {
    productList.innerHTML = '';
    productos.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.id} - ${p.title} ($${p.price})`;
        productList.appendChild(li);
    });
});

document.getElementById('add-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const nuevoProducto = {
        title: form.title.value,
        description: form.description.value,
        price: parseFloat(form.price.value),
        code: form.code.value,
        stock: parseInt(form.stock.value),
        category: form.category.value,
        thumbnails: form.thumbnails.value
    };
    socket.emit('agregarProducto', nuevoProducto);
    form.reset();
});

document.getElementById('delete-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(e.target.id.value);
    socket.emit('eliminarProducto', id);
    e.target.reset();
});
