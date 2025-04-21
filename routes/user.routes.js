const { request, response } = require("express");
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require ('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');





/* /user/test */

router.get('/register',(request,response) =>{
    response.render('register');
})

router.post('/register',
    body('email').trim().isEmail().isLength({min:10}),
    body('password').trim().isLength({min:5}),
    body('username').trim().isLength({min:3}),
    async (request,response) =>{

        const errors = validationResult(request);

        if(!errors.isEmpty()){
            return response.status(400).json({
                errors: errors.array(),
                message:'Invalid data'
            })
        }
    
    const {email,username,password} = request.body;

    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = await userModel.create({
        email,
        username,
        password: hashPassword,
    })

    response.json(newUser);

})

router.get('/login',(request,response) =>{
    response.render('login');
})

router.post('/login',
    body('username').trim().isLength({min:3 }),
    body('password').trim().isLength({min:5}),
    async (request,response) =>{

        const errors = validationResult(request);

        if(!errors.isEmpty()) {
            return response.status(400).json({
                Error:errors.array(),
                message:'Invalid data'
                
            })
        }

        const{username, password} = request.body;

        const user = await userModel.findOne({
            username: username
        })

        if(!user){
            return response.status(400).json({
                message:'username or password is incorrect'
            })
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return response.status(400).json({
                message:'username or password is incorrect'
            })
        }

        const token = jwt.sign({
            userID: user._id,
            email:user.email,
            username:user.username
        },
            process.env.JWT_SECRET,
    )

   response.cookie('token',token)

   response.send('Logged in ')
    }
)

module.exports = router;