var express = require('express');
var router = express.Router();

var userrouter = require('./userrouter');
var newsrouter = require('./newsrouter');

router.use('/', userrouter);
router.use('/', newsrouter);

module.exports = router;