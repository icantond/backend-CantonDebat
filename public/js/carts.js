console.log('carts.js loaded')

/*ESTA VERSION ESTA OK!!!*/
const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

addToCartButtons.forEach((button) => {
    button.addEventListener('click', async () => {
        console.log('Click para agregar producto al carrito')
        const pid = button.getAttribute('data-product-id');
        // const cid = "6518b3030b4bb755731f2cd0";
        const cid = button.getAttribute('data-cart-id');
        console.log('Agregando producto con ID:', pid, 'al carrito: ', cid);

        try {

            // const response = await fetch(`api/carts/6518b3030b4bb755731f2cd0/products/${pid}`, {
                const response = await fetch(`api/carts/${cid}/products/${pid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (response.ok) {
                const updatedCart = await response.json();
                
                Swal.fire({
                    title: 'Producto agregado al carrito',
                    icon: 'success',
                    toast: 'true',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3500 
                });
                location.reload();
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
        const cartId = button.getAttribute('data-cart-id');
        console.log('Eliminando producto del lado del cliente ID:', productId, ', carrito: ', cartId);

        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
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

if (clearCartButton) {
    clearCartButton.addEventListener('click', async () => {
        const cartId = clearCartButton.getAttribute('data-cart-id');
        console.log('Vaciando carrito ID:', cartId);
        try {
            const response = await fetch(`/api/carts/${cartId}`, {
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
    })
};

const purchaseCartButton = document.getElementById('purchase-cart');

if (purchaseCartButton) {
    purchaseCartButton.addEventListener('click', async () => {
        const cartId = purchaseCartButton.getAttribute('data-cart-id');
        console.log('Finalizando compra para el carrito:', cartId);

        try {
            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    Swal.fire({
                        title: 'Compra completada',
                        icon: 'success',
                        toast: 'true',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3500
                    });
                    location.reload();
                } else {
                    Swal.fire({
                        title: 'Error en la compra',
                        text: 'Algunos productos no pudieron ser comprados debido a la falta de stock.',
                        icon: 'error',
                        toast: 'true',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3500
                    });
                }
            } else {
                console.error('Error al finalizar la compra');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    });
}
