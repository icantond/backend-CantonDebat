import Ticket from "../dao/mongo/models/tickets.model";

async function createTicket(user, products, totalPrice) {
    const ticketData = {
        user,
        products,
        totalPrice
    };

    const newTicket = new Ticket(ticketData);
    await newTicket.save();

    return newTicket;
}

export { createTicket };