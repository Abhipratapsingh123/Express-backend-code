import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";    
import { hashPassword } from "../utils/helper.mjs";

const router = Router();


// for users get request and query parameters and using session

router.get('/api/users', query('filter')
.isString()
.notEmpty()
.isLength({ min:3, max: 10})
.withMessage('Must be between 3-10 characters'), (request,response)=>{
console.log(request["express-validator#contexts"]);
console.log( request.session );
console.log( request.session.id ); 
request.sessionStore.get( request.session.id, (err, sessionData )=>{
    if(err){
        console.log(err);
        throw err;
    }
    console.log(sessionData);

});
const result = validationResult(request);
console.log(result);
const{
   query:{filter,value},
}=request;

// when filter and value are undefined

if(filter && value)
    return response.send(
   mockUsers.filter((user)=> user[filter].includes(value))
);
return response.send(mockUsers);

})


// post request and how to use middleware
// express-validator 
// using schema function to make code more readable  

router.post('/api/users', checkSchema(createUserValidationSchema), async (request,response)=>{
    // console.log(request.body); 
    const result = validationResult(request);
    console.log(result);
    if(!result.isEmpty()) return response.status(400).send(result.array());
    const data = matchedData(request);
    console.log(data);
    data.password = hashPassword(data.password);
    console.log(data);
    const newUser = new User(data);
    try{
        const savedUser = await newUser.save();
        return response.status(201).send(savedUser);
    } catch(err){
        console.log(err);
        return response.sendStatus(400);
    }
    
})


// route parameters

router.get("/api/users/:id", (request,response)=>{
    console.log(request.params);
    const parsedID = parseInt(request.params.id);
    console.log(parsedID);
    if(isNaN(parsedID)) return response.status(400).send({msg:"Bad request. Invalid ID"});
    const findUser = mockUsers.find((user)=> user.id === parsedID);
    if(!findUser) return response.sendStatus(404);
    return response.send(findUser);
 
});


// put request
router.put('/api/users/:id', resolveIndexByUserId, (request,response)=>{
    const { body, findUserIndex} = request;
    mockUsers[findUserIndex] = {id:mockUsers[findUserIndex].id, ...body};
    return response.sendStatus(200);
});

// patch request

router.patch('/api/users/:id', resolveIndexByUserId, (request,response)=>{
    const {body , findUserIndex} = request;
    mockUsers[findUserIndex] = {... mockUsers[findUserIndex] , ... body};
    return response.sendStatus(200);
});



// delete request

router.delete('/api/users/:id', resolveIndexByUserId, (request, response) => {
     const { findUserIndex } = request;
     mockUsers.splice(findUserIndex , 1);
     return response.sendStatus(200);
});






export default router;

