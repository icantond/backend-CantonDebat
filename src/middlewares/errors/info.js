export const generateProductErrorInfo = (product) => {
    return `One or more properties are incomplete or are not valid:
    Required properties:
    title: needs to be a string, received: ${typeof(product.title)}
    price: needs to be a number, received: ${typeof(product.price)}
    description: needs to be a string, received: ${typeof(product.description)}
    stock: needs to be a number, received: ${typeof(product.stock)}
    category: needs to be a string, received: ${typeof(product.category)}
    status: needs to be a boolean, received: ${typeof(product.status)}
    code: needs to be a string, received: ${typeof(product.code)}`;
};  