import Tickets from "../dao/mongo/tickets.mongo.js";

export default class TicketsRepository {
    constructor() {
        this.dao = new Tickets();
    }

    async createTicket(ticketData) {
        return await this.dao.createTicket(ticketData);
    }
}