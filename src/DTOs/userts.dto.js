export default class UsersDTO {
    constructor (user) {
        this.id = user._id;
        this.name = user.name;
        this.lastname = user.lastname;
        this.email = user.email;
        this.age = user.age;
        this.cart = user.cart;
        this.role = user.role;
        this.password = user.password;
    }
}