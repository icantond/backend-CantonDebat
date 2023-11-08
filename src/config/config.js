import dotenv from 'dotenv';
dotenv.config();

const configs = {
    mongoUrl: process.env.MONGO_URL,
    sessionSecret: process.env.SESSION_SECRET_KEY,
    githubId: process.env.GITHUB_CLIENT_ID,
    githubSecret: process.env.GITHUB_CLIENT_SECRET,
};

export default configs;