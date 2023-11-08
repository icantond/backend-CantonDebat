import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import usersModel from '../dao/models/users.model.js';
import configs from './config.js';

const initializePassport = () => {
    passport.use('github', new GitHubStrategy({
        clientID: configs.githubId,
        clientSecret: configs.githubSecret,
        callbackURL: 'http://localhost:8080/api/sessions/github-callback',
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const email = profile.emails[0].value; //dentro de este atrubito va a llegar el correo

            const user = await usersModel.findOne({ email });

            if(!user) {
                //crear la cuenta o el usuario desde cero
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 0,
                    email,
                    password: ''
                };

                const result = await usersModel.create(newUser);
                return done(null, result);
            } else {
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser( async (id, done) => {
        const user = await usersModel.findById(id);
        done(null, user); //req.user
    })
};

export default initializePassport;