console.log('Launched cartsProductDetail.js');

const addToCartFromProductDetailButtons = document.querySelectorAll('.add-to-cart-from-detail-button');

addToCartFromProductDetailButtons.forEach((button) => {
    button.addEventListener('click', async () => {
        const pid = button.getAttribute('data-product-id');
        console.log('Agregando producto con ID:', pid);
        try {
            const baseUrl = window.location.origin;

            const apiUrl = `${baseUrl}/api/carts/6518b3030b4bb755731f2cd0/products/${pid}`;

            const response = await fetch(apiUrl, {
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
                console.log('Producto agregado al carrito:', updatedCart);
                location.reload();
            } else {
                console.error('Error al agregar el producto al carrito');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    });
});