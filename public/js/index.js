const socket = io();

socket.on('connect', () => {
    console.log('Conectado al servidor WebSocket');
});

socket.on('updateProducts', (updatedProducts) => {

    console.log('Actualización de productos recibida:', updatedProducts);

    const productList = document.getElementById('product-list');
    productList.innerHTML = updatedProducts.map((product) => `<li>${product.title}</li>`).join('');
});

const addProductForm = document.getElementById('add-product-form');

addProductForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const productData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value,
        code: document.getElementById('code').value,
        category: document.getElementById('category').value,
        thumbnail: document.getElementById('thumbnail').value,
    };

    socket.emit('addProduct', productData);

    addProductForm.reset();

});

document.getElementById('delete-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const productId = document.getElementById('productId').value;

    // Emitir un evento al servidor para solicitar la eliminación del producto
    socket.emit('eliminar_producto', { productId });

});

socket.on('producto_eliminado', (data) => {
    const productId = data.productId;

    // Actualiza la vista eliminando el elemento con el ID productId
    const productElement = document.getElementById(productId);
    if (productElement) {
        productElement.remove();
    }
});