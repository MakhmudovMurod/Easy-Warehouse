const express = require('express');
const router = express.Router();
const path = require('path');
const app = express();
const db  = require('../models/db');
const User = db.user;
const Product = db.products;
const Product_Constant = db.product_constants;
const Additional_service = db.additional_service;

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));



router.get('/setting', (req,res)=>{
    Promise.all([
        Product_Constant.findAll(),
        Additional_service.findAll(),
    ])
    .then(data =>{

        // var drawings = data[0];
        var services = data[1];

        return res.render('partials/settings/settings',{services}); 
    })
    .catch( err => console.log(err));
    
});

//PRODUCT CONSTANT PAGE
router.get('/constant-create', (req,res)=>{
    
    Promise.all([
        Product_Constant.findAll(),
        Additional_service.findAll(),
    ])
    .then(data =>{

        var drawings = data[0];
        var services = data[1];

        res.render('partials/products/product_constants', {drawings, services}) 
    })
    .catch( err => console.log(err));
});
router.post('/constant-create', (req,res)=>{

    Product_Constant.create({
        name:req.body.const_name,
        code:req.body.const_code,
    })
    .then(
        res.redirect('/product/constant-create') 
    )
    .catch( err => console.log(err));
});

//PRODUCT CONSTANT DELETE ENDPOINT
router.post('/constant-delete/:id', (req,res) =>{
    Product_Constant.destroy({where:{id:req.params.id}});

    res.redirect('/product/constant-create');
});

//ADDITIONAL SERVICE CREATE PAGE
router.post('/service-create', (req,res)=>{
    Additional_service.create({
        name:req.body.service_name,
        code:req.body.service_code,
        price:req.body.service_price
    })
    .then(
        res.redirect('/settings/setting')
    )
    .catch( err => console.log(err));

});

//ADDITIONAL SERVICE DELETE ENDPOINT
router.post('/service-delete/:id', (req,res)=>{

    Additional_service.destroy({where:{id:req.params.id}});

    res.redirect('/product/constant-create');

});




module.exports = router;