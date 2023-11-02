import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
// import usersModel from '../dao/models/users.model.js';
import { PRIVATE_KEY_JWT } from './constants.js';
import { passportStrategiesEnum } from './enums.js';
import Users from '../dao/dbManagers/users.manager.js';



const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const usersManager = new Users();

const initializePassport = () => {

    passport.use(passportStrategiesEnum.JWT, new JWTStrategy({

        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: PRIVATE_KEY_JWT

    }, async (jwt_payload, done) => {

        try {
            console.log('JWT payload:', jwt_payload);
            return done(null, jwt_payload.user); //Obtenemos el req.user

        } catch (error) {
            return done(error);
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.4677b74926edd633',
        clientSecret: 'bc9e9e720c1d59ebb10a105892cf06038fd3c79c',
        callbackURL: 'http://localhost:8080/api/sessions/github-callback',
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const email = profile.emails[0].value; //dentro de este atrubito va a llegar el correo
            const user = await usersManager.getByEmail({ email });

            if (!user) {
                //crear la cuenta o el usuario desde cero
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 0,
                    email,
                    password: ''
                };

                const result = await usersManager.createUser(newUser);
                return done(null, result);

            } else {
                return done(null, user);
            }

        } catch (error) {
            return done(error);
        }
    }));
};


export default initializePassport;
// const initializePassport = () => {
    //     passport.use('github', new GitHubStrategy({
    //         clientID: 'Iv1.4677b74926edd633',
    //         clientSecret: 'bc9e9e720c1d59ebb10a105892cf06038fd3c79c',
    //         callbackURL: 'http://localhost:8080/api/sessions/github-callback',
    //         scope: ['user:email']
    //     }, async (accessToken, refreshToken, profile, done) => {
    //         try {
    //             console.log(profile);
    //             const email = profile.emails[0].value; //dentro de este atrubito va a llegar el correo
    
    //             const user = await usersModel.findOne({ email });
    
    //             if(!user) {
    //                 //crear la cuenta o el usuario desde cero
    //                 const newUser = {
    //                     first_name: profile._json.name,
    //                     last_name: '',
    //                     age: 0,
    //                     email,
    //                     password: ''
    //                 };
    
    //                 const result = await usersModel.create(newUser);
    //                 return done(null, result);
    //             } else {
    //                 return done(null, user);
    //             }
    //         } catch (error) {
    //             return done(error);
    //         }
    //     }))
    //
    //     passport.serializeUser((user, done) => {
    //         done(null, user._id);
    //     });
    
    //     passport.deserializeUser( async (id, done) => {
    //         const user = await usersModel.findById(id);
    //         done(null, user); //req.user
    //     })
    // };