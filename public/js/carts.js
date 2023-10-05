console.log('carts.js loaded')
// Escucha los clics en los botones "Agregar al Carrito"

/*ESTA VERSION ESTA OK!!!*/
const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

addToCartButtons.forEach((button) => {
    button.addEventListener('click', async () => {
        const pid = button.getAttribute('data-product-id');

        try {
            // Realizar la solicitud POST al servidor para agregar el producto al carrito
            const response = await fetch(`api/carts/6518b3030b4bb755731f2cd0/products/${pid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}), // Puedes ajustar la cantidad según tus necesidades
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
