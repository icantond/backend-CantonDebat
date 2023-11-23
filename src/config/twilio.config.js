import twilio from 'twilio';
import configs from './config.js';

const accountSid = configs.twilioAccountSID;
const authToken = configs.twilioAuthToken;
const smsNumber = configs.twilioSmsNumber;

const client = twilio(accountSid, authToken);

export { accountSid, authToken, smsNumber, client };