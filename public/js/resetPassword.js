console.log("resetPassword.js loaded")

const submitButton = document.getElementById("submit-button");

submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const token = document.getElementById('token').value;

    if (password !== confirmPassword) {
        console.error('Las contraseñas no coinciden');
        return;
    }

    try {
        const response = await fetch(`api/sessions/reset-password/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password: password })
        });

        if (response.ok) {
            console.log('Contraseña restablecida correctamente');
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Contraseña restablecida con éxito!',
                showConfirmButton: false,
                timer: 1500
            });

            setTimeout(() => {
                window.location.href = '/login'
            }, 2000);
            
        } else {
            console.error('Error al restablecer la contraseña');
        }
    } catch (error) {
        console.error('Error de red:', error);
    }

})

