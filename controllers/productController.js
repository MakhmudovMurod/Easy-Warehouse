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
        Additional_service.findAll()
    ])
    .then(data => {
        
        var services = data[0];

        res.render('partials/products/product_create', {services});
        
    })
    
});

router.post('/product-create',
[
    check('product_name')
        .isLength({ min: 10 })
        .withMessage('Название продукта должно состоять не менее чем из 10 символов!')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Название продукта не может быть пустым!'),
    check('name_code')
        .isNumeric()
        .withMessage('Код названия продукта должен быть только числовым значением!')
        .isLength({ min: 3,max:3 })
        .withMessage('Код названия продукта должен состоять из 3-х значных цифр!')
        .not()
        .isEmpty()
        .withMessage('Код названия продукта не может быть пустым!'),
    check('drawing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Рисунок товара не может быть пустым!'),
    check('drawing_code')
        .isNumeric()
        .withMessage('Рисунок код должен быть только числовым значением!')
        .isLength({ min:1,max:1 })
        .withMessage('Длина кода рисунка должна быть однозначным числом!')
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
            
            return res.render('partials/products/product_create', {alert,services,req_values});
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
            if(equality == 0 )
            {
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
                    return  res.render('partials/products/product_create', {success,services});
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
                            
                            let message = {msg:'Этот код названия ('+ existed_product[0].name_code +') раньше использовался для '+ existed_product[0].product_name +'. Вы не можете использовать этот код для других продуктов!'};
                            
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
                            
                            let message = {msg:'Это имя ('+ existed_product[0].product_name +') использовалось ранее с кодом  '+ existed_product[0].name_code +'. Вы не можете использовать разные коды для одного название!'};
                            
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
                
                return res.render('partials/products/product_create', {code_error_message,services,req_values});

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

                    return res.render('partials/products/product_create', {warning,services,req_values,existed_product});
                
                })
                
                
            }
            
        }

    }) // end of promise then
    
});

//EDIT PRODUCT PAGE
router.get('/product-edit/:id',(req,res)=>{
    Promise.all([
        Product.findAll({include: {model:Additional_service, as:'Additional_Service'},limit:1,where:{id:req.params.id}}),
        Additional_service.findAll(),
    ])
    .then(data=>{
        const product = data[0];
        const services = data[1]

        res.render('partials/products/product_edit',{product,services});
    })
    .catch(err=>console.log(err));

});

router.post('/product-edit/:id',
[
    check('product_name')
        .isLength({ min: 10 })
        .withMessage('Название продукта должно состоять не менее чем из 10 символов!')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Название продукта не может быть пустым!'),
    check('name_code')
        .isNumeric()
        .withMessage('Код названия продукта должен быть только числовым значением!')
        .isLength({ min: 3,max:3 })
        .withMessage('Код названия продукта должен состоять из 3-х значных цифр!')
        .not()
        .isEmpty()
        .withMessage('Код названия продукта не может быть пустым!'),
    check('drawing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Рисунок товара не может быть пустым!'),
    check('drawing_code')
        .isNumeric()
        .withMessage('Рисунок код должен быть только числовым значением!')
        .isLength({ min:1,max:1 })
        .withMessage('Длина кода рисунка должна быть однозначным числом!')
        .not()
        .isEmpty()
        .withMessage('Код рисунка не может быть пустым!'),
    check('sort')
        .not()
        .isEmpty()
        .withMessage('Сорт продукта не может быть пустым!'),
    check('price')
        .not()
        .isEmpty()
        .withMessage('Цена продукта не может быть пустым!'),
],(req,res)=>{

    Promise.all([
        Product.findAll({include: {model:Additional_service, as:'Additional_Service'},limit:1,where:{id:req.params.id}}),
        Product.findAll(),
        Additional_service.findAll(),
    ])
    .then(data => {

        const product = data[0]; // editing product
        const products = data[1];
        const services = data[2];
        const errors = validationResult(req);
        
        

        // All requested values
        const product_name = (req.body.product_name).toUpperCase();
        const name_code = req.body.name_code;
        const drawing = (req.body.drawing).toUpperCase();
        const drawing_code = req.body.drawing_code;
        const sort = req.body.sort;
        const price = req.body.price
        const code = req.body.service ? name_code + drawing_code + sort + req.body.service : name_code + drawing_code + sort + 0;
        const service = req.body.service ? parseInt(req.body.service) : null;
        //-----------------------------------------------------------------//
        
        if(!errors.isEmpty())
        {
            const error = errors.array();
            const req_values = req.body;

            console.log(req_values);
            
            return res.render('partials/products/product_edit', {error,services,req_values,product});
        }
        else
        {
            // Variables to check the input values are created before or not
            let equality = 0;
            var same_product;
            var price_difference;
            var name_code_difference;
            var drawing_code_difference;

            for(let i=0; i<products.length; i++)
            {
                if(product_name.localeCompare(products[i].product_name) == 0) 
                {
                    if(drawing.localeCompare(products[i].drawing) == 0) 
                    { 
                       if(sort == products[i].sort)
                        {
                            if(service == products[i].AdditionalServiceId)
                            {
                                ++equality;
                                same_product = products[i].id;
                                
                                if(price != products[i].price)
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
                
            } // end of for

        }// end else
        



        // return res.render('partials/products/product_edit',{error_messages,req_values,product,services});
        
        // return res.redirect('/product/price-list');
        
        
    }) // !-promise then
});



//DELETE PRODUCT ENDPOINT
router.post('/product-delete/:id', (req,res)=>{
    Product.destroy({where:{id:req.params.id}});

    res.redirect('/product/price-list');
});


module.exports = router;