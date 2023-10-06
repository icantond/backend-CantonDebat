console.log('carts.js loaded')

/*ESTA VERSION ESTA OK!!!*/
const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

addToCartButtons.forEach((button) => {
    button.addEventListener('click', async () => {
        const pid = button.getAttribute('data-product-id');

        try {
            const response = await fetch(`api/carts/6518b3030b4bb755731f2cd0/products/${pid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
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
});

//VISTA CARTS:
const removeItemButtons = document.querySelectorAll('.remove-item-button');

removeItemButtons.forEach((button) => {
    button.addEventListener('click', async () => {
        const productId = button.getAttribute('data-product-id');
        console.log('Eliminando producto con ID del lado del cliente:', productId);
        const currentURL = window.location.href;
        const parts = currentURL.split('/');
        const cartId = parts[parts.length - 1];

        try {
            const response = await fetch(`/carts/6518b3030b4bb755731f2cd0/products/${productId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.message);
                location.reload(); 
            } else {
                console.error("Error al eliminar el producto del carrito");
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    });
});

const clearCartButton = document.getElementById('empty-cart');

clearCartButton.addEventListener('click', async () => {
    const currentURL = window.location.href;
    const parts = currentURL.split('/');
    const cartId = parts[parts.length - 1];

    try {
        const response = await fetch(`/carts/${cartId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result.message);
            location.reload(); 
        } else {
            console.error("Error al vaciar el carrito");
        }
    } catch (error) {
        console.error("Error de red:", error);
    }
});