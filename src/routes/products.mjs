import { Router } from "express";
import { mockProducts } from "../utils/constants.mjs";
import {  signedCookies } from "cookie-parser";

const router = Router();

// get request for products

router.get("/api/products",(request,response)=>{
    // cookie is not parsed
    console.log( request.cookies );
    console.log( signedCookies );
    // using cookies to send data
    if( request.signedCookies.hello && request.signedCookies.hello === 'world')
        return response.send(mockProducts);

    return response.status(403).send({'msg': "Sorry, you need the correct cookie"});
});


// post request
router.post('/api/products',(request,response)=>{
    console.log(request.body);
    const{ body } = request;
    const newProduct = {product:mockProducts[mockProducts.length - 1].product+1, ...body}; // used spreader operator
    mockProducts.push(newProduct);
    return response.status(201).send(mockProducts);
});



export default router;

