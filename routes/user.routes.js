const { request, response } = require("express");

const express = require('express');
const router = express.Router();

/* /user/test */

router.get('/register',(request,response) =>{
    response.render('register');
})

module.exports = router;