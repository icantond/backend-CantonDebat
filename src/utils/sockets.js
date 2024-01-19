import { productsRepository } from '../repositories/index.js';
import messagesModel from '../dao/mongo/models/messages.model.js';

export default function socketsConfig(io) {
    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');


    //Socket para agregar productos
    socket.on('addProduct', async (newProduct) => {
        try {
            const updatedProducts = await productsRepository.getAll();

            socket.emit('updateProducts', updatedProducts);
            console.log('Producto agregado:', newProduct);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });

    //Socket para eliminar productos
    socket.on('eliminar_producto', async (data) => {
        const productId = data.productId;
        const userId = data.userId;
        const userRole = data.userRole;
        const productOwner = data.productOwner;

        try {
            if (!userId || !userRole || !productOwner) {
                console.error('Datos incompletos recibidos para eliminar el producto');
                return;
            }

            if (userRole === 'premium' && productOwner !== userId) {
                console.error('Usuarios premium solo pueden eliminar sus propios productos');
                return;
            }

            await productsRepository.delete(productId);
            io.emit('producto_eliminado', { productId });

            const updatedProducts = await productsRepository.getAll();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    });
    //Socket para chat:
    socket.on('chatMessage', (data) => {
        const { user, message } = data;
        const newMessage = new messagesModel({ user, message });
        newMessage.save();

        io.emit('message', data);
    });
});
}

