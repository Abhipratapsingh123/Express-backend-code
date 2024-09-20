import express from 'express';
import usersRouter from './routes/users.mjs';
import productsRouter from './routes/products.mjs';
import  homeRouter from './routes/home.mjs';
import { loggingMiddleware } from './utils/middlewares.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
// importing passport
import passport from 'passport';
// importing a local strategy made with passport
import "./strategies/local-strategy.mjs";
// importing mongoose database
import mongoose from 'mongoose';
// for storing sessions in database
import MongoStore from 'connect-mongo';

const app = express();  


mongoose.connect('mongodb://localhost/express_tutorial')
    .then(()=> {
        console.log("Connected to  Database")
    })
    .catch((err)=>
        {console.log(`Error ${err}`) 
    });
    

// logging middleware imported from middleware.mjs
app.use(loggingMiddleware); 
// defining middleware
app.use(express.json());
// using cookie parser
app.use(cookieParser("helloworld"));
// session for authentication
app.use( session({
    secret: 'Anson the  dev',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    },
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
    }),
}) );


// enabling of passport should be after session
app.use( passport.initialize() );
// since we are using sessions so...
app.use( passport.session() );



// using routers
app.use( usersRouter );
app.use( productsRouter );
app.use( homeRouter );

// defining port
const PORT = process.env.PORT || 3000;



// Some key points to remember

// middle wares can have global or local implementaion and 
// we can also define a mddleware inside a middleware which runs in a sequential order
// don't forget to use next() function which passes the command to next middleware




// put request(updates : we need to use all data in body while updating)
// patch request(if want to change some data like changing username from Abhi to something else)(update a portion only)
// delete request
// put and patch are used to update data

// A http request is by default stateless(Doesn't know from where data is coming)



// using post request with passport

app.post('/api/auth',passport.authenticate('local'),(request, response)=>{
    response.sendStatus(200);
});

app.get('/api/auth/status',(request, response)=>{
    console.log("Inside auth/status endpoint");
    console.log(request.user);
    console.log(request.session);
    if(request.user) return response.send(request.user);
    return response.sendStatus(401);
});


// how to log the user out or how to end the session

app.post('/api/auth/logout',(request,response)=>{
    if(!request.user) return response.sendStatus(401);  

    // if the user is log in then...
    request.logOut((err)=>{
        if(err) return response.sendStatus(400);
        response.send(200);
    });
});





// listening on port 3000
app.listen(PORT,()=>{
    console.log(`Running on port ${PORT}`);
});
