export const generateProductErrorInfo = (product) => {
    return `One or more properties are incomplete or are not valid:
    Required properties:
    title: needs to be a string, received: ${product.title}
    price: needs to be a number, received: ${product.price}`;
};  