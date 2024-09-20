import { Router } from "express";
import { mockUsers } from "../utils/constants.mjs";

const router = Router();


// adding locally scoped middlewares in get request
router.get("/",(request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    // updating session data to avoid multiple saves
    request.session.visited = true;
    response.cookie('hello', 'world', { maxAge : 60000 * 60, signed: true});
    response.status(201).send({ msg: "Hello" });
});




// an auth post request

// router.post('/api/authentication',(request,response)=>{
//     const{ body: { username, password} } = request;
//     const findUser = mockUsers.find((user) => user.username === username);
//     if(!findUser || findUser.passsword !== password) return response.status(401).send({msg: "Bad Credentials" });

//     request.session.user = findUser;
//     return response.status(200).send(findUser); 
// });


// router.get('/api/authentication/status',(request, response) => {
//     request.sessionStore.get( request.sessionID, (err, session)=>{
//         console.log(session);
//     });
//     return request.session.user ? response.status(200).send(request.session.user) :
//      response.status(401).send({msg: "Not authenticated" });

// });


// cart post request

router.post('/api/cart',(request,response) => {
  if(!request.session.user) return response.sendStatus(401);
  const { body : item} = request;
  const { cart } = request.session;

  if( cart ){
    cart.push( item );
  }
  else{
    request.session.cart = [item];
  }
  return response.status(201).send(item);
});


//getting cart

router.get('/api/cart',(request, response)=>{
    if(!request.session.user) return response.sendStatus(401);
    return response.send( request.session.cart ?? []);

});






export default router;
