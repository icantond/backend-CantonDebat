import nodemailer from 'nodemailer';
import configs from './config.js';

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configs.nodemailerUser,
        pass: configs.nodemailerPass,
    }
})

export default transport;