console.log("resetPassword.js loaded")

const submitButton = document.getElementById("submit-button");

submitButton. addEventListener("click", async(e) => {
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
        } else {
            console.error('Error al restablecer la contraseña');
        }
    } catch (error) {
        console.error('Error de red:', error);
    }

})
    
