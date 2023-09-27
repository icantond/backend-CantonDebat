const socket = io();

socket.on('connect', () => {
    console.log('Conectado al servidor WebSocket');
});

//ACTUALIZACION DE VISTA PRODUCTOS
socket.on('updateProducts', (updatedProducts) => {
    console.log('Actualización de productos recibida:', updatedProducts);

    const productListContainer = document.getElementById('product-list-container');
    productListContainer.innerHTML = `
        <ul id="product-list">
            ${updatedProducts.map((product) => `
                <li class="product-list-item">
                    <h3 class="product-list-item-title">Producto: ${product.title}</h3>
                    <p class="product-list-item-code">ID: ${product._id}</p>
                    <img src="${product.thumbnail}" width="50px">
                </li>
            `).join('')}
        </ul>
    `;
});


const addProductForm = document.getElementById('add-product-form');

//AGREGAR PRODUCTOS:
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

//ELIMINAR PRODUCTOS:

document.getElementById('delete-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const productId = document.getElementById('productId').value;
    socket.emit('eliminar_producto', { productId });

});
socket.on('producto_eliminado', (data) => {
    const productId = data.productId;
    
    const productListContainer = document.getElementById('product-list-container');
    const productToRemove = document.getElementById(productId);
    
    if (productToRemove) {
        productListContainer.removeChild(productToRemove);
    }
});
