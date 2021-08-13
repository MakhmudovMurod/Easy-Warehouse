const express = require('express');
const router = express.Router();
const path = require('path');
const app = express();
const db  = require('../models/db');
const { body, check, validationResult } = require('express-validator');



const Product = db.products;
const Product_Constant = db.product_constants;
const Additional_service = db.additional_service;
 
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));


// PRODUCT JSON 
router.get('/product-search', (req,res)=>{
    Product.findAll()
    .then(products =>
    
        res.json(products)
    )
    .catch(err=> console.log(error))
});

// PRODUCT CONSTANT JSON
router.get('/product-constant', (req,res)=>{
    Product_Constant.findAll()
    .then(data =>
        res.json(data)
    )
    .catch(err=> console.log(error))
});

// PRODUCT ADDITIONAL SERVICE JSON 
router.get('/product-services', (req,res)=>{
    Additional_service.findAll()
    .then(data =>
        res.json(data)
    )
    .catch(err=> console.log(error))
});

//------------------------------------------------------//

//PRODUCTS CRUD

//PRICE LIST PAGE
router.get('/price-list', (req,res)=>{
    Product.findAll({include: {model:Additional_service, as:'Additional_Service'}})
    .then(products=>
        res.render('partials/products/product_price', {products})
    )
    .catch(err => console.log(err));
});

//CREATE PRODUCT PAGE
router.get('/product-create',(req,res)=>{ 
    Promise.all([
        Product_Constant.findAll(),
        Additional_service.findAll()
    ])
    .then(data => {

        var drawings = data[0];
        var services = data[1];

        res.render('partials/products/product_create', {drawings, services,
            success:req.session.success,
            errors:req.session.errors
        });
            // req.session.errors = null;
            // req.session.success = null;
    })
    
});
router.post('/product-create',
[
    check('product_name')
        .not()
        .isEmpty()
        .withMessage('Название продукта не может быть пустым!'),
    check('name_code')
        .not()
        .isEmpty()
        .withMessage('Код продукта не может быть пустым!'),
    check('drawing')
        .not()
        .isEmpty()
        .withMessage('Рисунок товара не может быть пустым!'),
    check('drawing_code')
        .not()
        .isEmpty()
        .withMessage('Код продукта не может быть пустым!'),

],(req,res)=>{
    
    // All requested values
    const p_name = (req.body.product_name).toUpperCase();
    const name_code = req.body.name_code;
    const drawing = (req.body.drawing).toUpperCase();
    const drawing_code = req.body.drawing_code;
    // --------------------------------------//
    const sort1 = req.body.sort1;
    const sort1_price = req.body.sort1_price
    const p1_code = req.body.add_service1 ? name_code + drawing_code + sort1 + req.body.add_service1 : name_code + drawing_code + sort1 + 0;
    const service1 = req.body.add_service1 ? parseInt(req.body.add_service1) : null;

    // --------------------------------------//
    const sort2 = req.body.sort2;
    const sort2_price = req.body.sort2_price;
    const p2_code = req.body.add_service2 ? name_code + drawing_code + sort2 + req.body.add_service2 : name_code + drawing_code + sort2 + 0;
    const service2 = req.body.add_service2 ? parseInt(req.body.add_service2) : null;
    // --------------------------------------//
    const sort3 = req.body.sort3;
    const sort3_price = req.body.sort3_price;
    const p3_code = req.body.add_service3 ? name_code + drawing_code + sort3 + req.body.add_service3 : name_code + drawing_code + sort3 + 0;
    const service3 = req.body.add_service3 ? parseInt(req.body.add_service3) : null;
    
    
    if(req.body.sort2)
    {
        Product.create({
            product_name:p_name,
            name_code:name_code,
            drawing:drawing,
            drawing_code:drawing_code,
            sort:sort2,
            overall_code:p2_code,
            price:sort2_price,
            available_quantity:0,
            AdditionalServiceId:service2,
        })
        
    }
    if(req.body.sort3){
        Product.create({
            product_name:p_name,
            name_code:name_code,
            drawing:drawing,
            drawing_code:drawing_code,
            sort:sort3,
            overall_code:p3_code,
            price:sort3_price,
            available_quantity:0,
            AdditionalServiceId:service3,
        })
    }
    if(req.body.sort1)
    {
        Product.create({
            product_name:p_name,
            name_code:name_code,
            drawing:drawing,
            drawing_code:drawing_code,
            sort:sort1,
            overall_code:p1_code,
            price:sort1_price,
            available_quantity:0,
            AdditionalServiceId:service1,
        })
    }

    var errors = validationResult(req).array();
    
    res.redirect('/product/product-create');
    

    
});

//EDIT PRODUCT PAGE
router.get('/product-edit/:id',(req,res)=>{
    Promise.all([
        Product.findAll({include: {model:Additional_service, as:'Additional_Service'},limit:1,where:{id:req.params.id}}),
        Product_Constant.findAll(),
        Product.findOne({where:{id:req.params.id}}),
        Additional_service.findAll(),
    ])
    
    .then(data=>{

        var product = data[0];
        var product_image = data[1];
        var current_drawing = data[2].drawing;
        var current_drawing_code = data[2].drawing_code;
        var services = data[3];

        res.render('partials/products/product_edit', 
        {
            product, product_image, current_drawing,  current_drawing_code, services
        })
    })
    .catch(err => console.log(err));
});
router.post('/product-edit/:id',(req,res)=>{

    console.log(req.body);

    Product.findOne({where:{id:req.params.id}})
    .then(p=> {

        
        if(req.body.update_name_code)
        {
            if(req.body.serviceCheckbox2 === "on")
            {}
            var update_code = "" + req.body.update_name_code + p.drawing_code + p.sort;

            Product.update({
                name_code:req.body.update_name_code,
                overall_code:update_code,
            },{where:{id:req.params.id}})
        }
        if(req.body.update_name)
        {   
            Product.update({ 
                product_name:req.body.update_name,
            },{where:{id:req.params.id}})
        }
        if(req.body.update_drawing)
        {
            var update_code =  "" +  p.name_code + req.body.update_drawing_code + p.sort;
            
            Product.update({ 
                drawing:req.body.update_drawing,
                drawing_code:req.body.update_drawing_code,
                overall_code:update_code,
            },{where:{id:req.params.id}})
        }
        if(req.body.update_sort)
        {
            const update_code =  "" +  p.name_code + p.drawing_code + req.body.update_sort;

            Product.update({ 
                sort:req.body.update_sort,
                overall_code:update_code,
            },{where:{id:req.params.id}})
        }
        
        if(req.body.update_price)
        {
            Product.update({ 
                price:req.body.update_price,
            },{where:{id:req.params.id}})
        }
    
        res.redirect('/product/price-list')
    })
    .catch()

});

//DELETE PRODUCT ENDPOINT
router.post('/product-delete/:id', (req,res)=>{
    Product.destroy({where:{id:req.params.id}});

    res.redirect('/product/price-list');
});


//----------------------------------------------------//
    
//PRODUCT SETTINGS

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
        res.redirect('/product/constant-create')
    )
    .catch( err => console.log(err));

});

//ADDITIONAL SERVICE DELETE ENDPOINT
router.post('/service-delete/:id', (req,res)=>{

    Additional_service.destroy({where:{id:req.params.id}});

    res.redirect('/product/constant-create');

});

module.exports = router;