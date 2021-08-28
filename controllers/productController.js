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
        .trim()
        .not()
        .isEmpty()
        .withMessage('Название продукта не может быть пустым!'),
    check('name_code')
        .not()
        .isEmpty()
        .withMessage('Код продукта не может быть пустым!'),
    check('drawing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Рисунок товара не может быть пустым!'),
    check('drawing_code')
        .not()
        .isEmpty()
        .withMessage('Код рисунка не может быть пустым!'),
    check('sort1')
        .not()
        .isEmpty()
        .withMessage('Сорт продукта не может быть пустым!'),
    check('sort1_price')
        .not()
        .isEmpty()
        .withMessage('Цена продукта не может быть пустым!'),
],(req,res)=>{
    
    Promise.all([
        Additional_service.findAll(),
        Product.findAll(),
    ])
    .then(data => {

        const services = data[0];
        const products = data[1];
        const errors = validationResult(req);

        if(!errors.isEmpty())
        {
            const alert = errors.array();
            const req_values = req.body;
            
            res.render('partials/products/product_create', {alert,services,req_values});
        }
        else 
        {
            // All requested values
            const p_name = (req.body.product_name).toUpperCase();
            const name_code = req.body.name_code;
            const drawing = (req.body.drawing).toUpperCase();
            const drawing_code = req.body.drawing_code;
            const sort1 = req.body.sort1;
            const sort1_price = req.body.sort1_price
            const p1_code = req.body.add_service1 ? name_code + drawing_code + sort1 + req.body.add_service1 : name_code + drawing_code + sort1 + 0;
            const service1 = req.body.add_service1 ? parseInt(req.body.add_service1) : null;
            //-----------------------------------------------------------------//
            

            // Variables to check the input values are created before or not
            let equality = 0;
            var same_product;
            var price_difference;
            var name_code_difference;
            var drawing_code_difference;

            // Requested values caompared (by linear search) with database rows until it finds same product with exact same name, drawing and sort
            for(let i=0; i<products.length; i++)
            {
                if(p_name.localeCompare(products[i].product_name) == 0) 
                {
                    if(drawing.localeCompare(products[i].drawing) == 0) 
                    { 
                       if(sort1 == products[i].sort)
                        {
                            if(service1 == products[i].AdditionalServiceId)
                            {
                                ++equality;
                                same_product = products[i].id;
                                
                                if(sort1_price != products[i].price)
                                {
                                    price_difference = true; 
                                } 
                                if(name_code != products[i].name_code)
                                {
                                    name_code_difference = true;
                                }
                                if(drawing_code != products[i].drawing_code)
                                {
                                    drawing_code_difference = true;
                                }
                            }
                            
                        }
                        
                    }          
                      
                }
                
            }
            
            console.log(equality);
            if(equality == 0 ){

                var name_code_error_count = 0;
                var drawing_code_error_count = 0;
                var name_error_count = 0;
                var drawing_error_count = 0;
                var error_counter = 0;
                let code_error_message = [];
                
                for(let i=0; i<products.length; i++)
                {
                    if(name_code == products[i].name_code)
                    {
                        if(p_name != products[i].product_name)
                        {
                            ++name_code_error_count;
                            ++error_counter;
                        }
                    }
                    if(p_name == products[i].product_name)
                    {
                        if(name_code != products[i].name_code)
                        {
                            ++name_error_count;
                            ++error_counter;
                        }
                    }
                    if(drawing_code == products[i].drawing_code)
                    {
                        if(drawing != products[i].drawing)
                        {
                            ++drawing_code_error_count;
                            ++error_counter;
                        }
                    }
                    if(drawing == products[i].drawing)
                    {
                        if(drawing_code != products[i].drawing_code)
                        {
                            ++drawing_error_count;
                            ++error_counter;
                        }
                    }
                    
                }


                console.log("Error Counter value: "+error_counter);
                if(error_counter == 0)
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
    
                    const success = 'Товар создан успешно!';
                    res.render('partials/products/product_create', {success,services});
                }
                if(error_counter > 0)
                {
                    if(name_code_error_count > 0)
                    {
                        
                        Promise.all([
                            Product.findAll({where:{name_code:parseInt(req.body.name_code)}}),
                        ])  
                        .then(data=>{
                            let existed_product = data[0];
                            
                            let message = {msg:'Этот код названия раньше использовался для '+ existed_product[0].product_name +'. Вы не можете использовать этот код для других продуктов!'};
                            
                            code_error_message.push(message);
                            
                        })
                    }
                    if(name_error_count > 0)
                    {
                        Promise.all([
                            Product.findAll({where:{product_name:p_name}}),
                        ])  
                        .then(data=>{
                            let existed_product = data[0];
                            
                            let message = {msg:'Это имя использовалось ранее с кодом  '+ existed_product[0].name_code +'. Вы не можете использовать разные коды для одного название!'};
                            
                            code_error_message.push(message);
                            
                        })
                    }
                    if(drawing_error_count > 0)
                    {
                        Promise.all([
                            Product.findAll({where:{drawing:drawing}}),
                        ])  
                        .then(data=>{
                            let existed_product = data[0];
                            
                            let message = {msg:'Использован неправильный код рисунок для '+existed_product[0].drawing +'.  Должно быть - [' + existed_product[0].drawing_code + ']'};
                            
                            code_error_message.push(message);
                            
                        })
                    }
                    if(drawing_code_error_count > 0)
                    {
                        Promise.all([
                            Product.findAll({where:{drawing_code:parseInt(req.body.drawing_code)}}),
                        ])  
                        .then(data=>{
                            let existed_product = data[0];
                            
                            let message = {msg:'Этот код рисунок раньше использовался для '+ existed_product[0].drawing +'. Вы не можете использовать этот код для других рисунок!'};

                            code_error_message.push(message);
                            
                        })

                    }
                }
                
                const req_values = req.body;
                
                res.render('partials/products/product_create', {code_error_message,services,req_values});

            }
            if(equality > 0) // It means already existed product created again
            {
                Promise.all([
                    Product.findAll({where:{id:same_product}}),
                ])  
                .then(data=>{
                    let existed_product = data[0];
                    console.log(existed_product);
                    const req_values = req.body;
                    let warning = [{msg:'Этот продукт уже создан!'}];
                    if(price_difference)
                    {
                        warning.push({msg:'Этот товар создавался раньше по другой цене : ['+ existed_product[0].price + ' UZS]'});
                    }
                    if(name_code_difference)
                    {
                        warning.push({msg:'Использован неправильный код названия для '+existed_product[0].product_name+'.  Должно быть - [' + existed_product[0].name_code + ']'});
                    }
                    if(drawing_code_difference)
                    {
                        warning.push({msg:'Использован неправильный код рисунок для '+existed_product[0].drawing+'.  Должно быть - [' + existed_product[0].drawing_code + ']'});
                    }

                    res.render('partials/products/product_create', {warning,services,req_values,existed_product});
                
                })
                
                
            }
            
        }

    }) // end of promise then
    
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