var express = require('express');
var router = express.Router();

const controller=require('../controllers/search.controller');

router.post('/search',controller.find);

module.exports=router;