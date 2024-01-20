import dotenv from 'dotenv';
dotenv.config();

const configs = {
    environment: process.env.ENVIRONMENT,
    mongoUrl: process.env.MONGO_URL,
    sessionSecret: process.env.SESSION_SECRET_KEY,
    githubId: process.env.GITHUB_CLIENT_ID,
    githubSecret: process.env.GITHUB_CLIENT_SECRET,
    persistence: process.env.PERSISTENCE,
    nodemailerUser: process.env.NODEMAILER_USER,
    nodemailerPass: process.env.NODEMAILER_PASS,
    twilioAccountSID: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioSmsNumber: process.env.TWILIO_SMS_NUMBER,
    jwtKey: process.env.JWT_KEY,
    port: process.env.PORT,
    devHost: process.env.DEV_HOST,
    phoneNumber: process.env.PHONE_NUMBER
};

export default configs;