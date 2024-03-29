import swaggerAutogen from "swagger-autogen";
import configs from "./config/config.js";

const doc = {
    info: {
        version: "1.0.0",
        title: 'Documentación generada con AutoGen',
        description: 'Documentación de Ecommerce proyecto Backend'
    },
    host: configs.devHost,
    basePath: '/',
    schemes: ['http'],
    tags: [
        {
            name: 'Sesssions',
            description: 'Servicios de sesiones'
        }
    ],
    definitions: {
        Login: {
            accessToken: 'asdadhgasfdjh345hfkasdfjk'
        }
    }
};

const outputFile = '../docs/swagger-output.json';
const endpointsFiles = [
    './routes/carts.router.js',
    './routes/products.router.js',
    './routes/sessions.router.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
    await import ('./app.js')
})