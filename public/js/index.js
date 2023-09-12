const socket = io();

socket.on('connect', () => {
    console.log('Conectado al servidor WebSocket');
});

socket.on('updateProducts', (updatedProducts) => {
    // Actualiza la lista de productos en la vista
    const productList = document.getElementById('product-list');
    productList.innerHTML = updatedProducts.map((product) => `<li>${product.title}</li>`).join('');
});

const addProductForm = document.getElementById('add-product-form');

addProductForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const productTitle = document.getElementById('product-title').value;
    // Agregar lógica para enviar el nuevo producto al servidor a través de WebSocket
    socket.emit('addProduct', { title: productTitle }); // Debes crear un evento 'addProduct' en el servidor para manejar esto
    // Limpia el campo de entrada después de enviar el producto
    document.getElementById('product-title').value = '';
});
