import passport from "passport";
import { Strategy } from "passport-local";
// import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helper.mjs";


passport.serializeUser((user, done)=>{
    console.log('Inside serialize user');
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser( async(id, done)=>{
    console.log('Inside deserialize ');
    console.log(`Deserializing user ID: ${id}`); 
    try{
        const findUser = await User.findById(id);
        if(!findUser) throw new Error('User not Found'); 
        done(null, findUser);
    } catch(err){
        done(err, null);
    }
});

export default passport.use(
    new Strategy( async(username, password, done) =>{
        // console.log(`Username: ${username}`);
        // console.log(`Password: ${password}`);
        try{
            // By local storage or an array

            // const findUser = mockUsers.find((user) => user.username === username);
            // if(!findUser) throw new Error('User not found');
            // if(findUser.passsword !== password) throw new Error('Invalid credentials');

            // by database

            const findUser = await User.findOne({username});
            if(!findUser) throw new Error('User not found');
            if(!comparePassword(password, findUser.password)) throw new Error('Bad Credentials');
            done(null, findUser);
        } catch(err){
            done(err, null);
        }
    })
)











