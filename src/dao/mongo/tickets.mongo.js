import ticketsModel from "./models/tickets.model.js";

export default class Tickets {
    constructor(){
        console.log("Working tickets with DB");
    }

    async createTicket(ticketData) {
        return await ticketsModel.create(ticketData);
    }

    async getTicketById(ticketId) {
        return await ticketsModel.findById(ticketId)
            .populate('user')
            .populate('products.product');
    }
}
