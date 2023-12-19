export default class ProductDTO {
    constructor(product) {
        this.title = product.title;
        this.price = product.price;
        this.description = product.description;
        this.code = product.code;
        this.stock = product.stock;
        this.category = product.category;
        this.status = product.status;
        this.id = product.id;
        this.thumbnail = product.thumbnail;
        this.owner = product.owner;
    }

}