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
                <p class="product-list-item-code" id="productId" >${product._id}}</p>
                <img src="static/img/${product.thumbnail}" width="50px">
                <input type="hidden" id="product-owner" value="${product.owner}">
                <button type="submit" class="delete-button">Eliminar Producto</button>
            </li>
                `).join('')}
            </ul>
        `;
});

const addProductForm = document.getElementById('add-product-form');
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(addProductForm);

    fetch('/api/products', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {

            const productData = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                price: document.getElementById('price').value,
                stock: document.getElementById('stock').value,
                code: document.getElementById('code').value,
                category: document.getElementById('category').value,
                thumbnail: data.thumbnail,
                owner: document.getElementById('owner').value
            };
            socket.emit('addProduct', productData);

            addProductForm.reset();
        })
        .catch(error => console.error(error));
});

//ELIMINAR PRODUCTOS:
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
    
            const productId = e.target.parentElement.querySelector('.product-list-item-code').textContent;
            const productOwner = e.target.parentElement.querySelector('#product-owner').value;
            const userId = document.getElementById('owner').value;
            const userRole = document.getElementById('user-role').value;
            //FALTA CAMBIAR EL SOCKET PARA ENVIAR CORREO DE AVISO A USUARIOS PREMIUM
            console.log('Producto a eliminar:', productId);
            socket.emit('eliminar_producto', { productId, userId, userRole, productOwner });
        });
    });
    
    const addProductToCartForm = document.getElementById('add-product-to-cart-form');
    addProductToCartForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cartId = document.querySelector('#cartId').value;
        const productId = document.querySelector('#productId').value;
        const quantity = document.querySelector('#quantity').value;

        try {
            if (!cartId || !productId || !quantity) {
                console.error('Por favor, complete todos los campos');
                return;
            }

            // Realizar la solicitud POST al servidor
            const response = await fetch(`api/carts/${cartId}/products/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "quantity": quantity, }),
            });

            if (response.ok) {
                const updatedCart = await response.json();
                console.log('Producto agregado al carrito:', updatedCart);
            } else {
                console.error('Error al agregar el producto al carrito');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    });

