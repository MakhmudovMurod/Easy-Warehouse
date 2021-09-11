const express = require('express');
const router = express.Router();
const path = require('path');
const app = express();
const db = require('../models/db');
const { Op } = require("sequelize");
const { sequelize, warehouse_reserve } = require('../models/db');
const Product = db.products;
const Warehouse_supplement_story = db.warehouse_supplement_story;
const Additional_service = db.additional_service;
const { body, check, validationResult } = require('express-validator');


const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

// WAREHOUSE REPLENISH PAGE
router.get('/warehouse-replenish', (req,res)=>{
    Promise.all([
        Product.findAll(),
        Additional_service.findAll(),
    ])
    .then(data=>{
        const products = data[0];
        const services = data[1];

        return res.render('partials/warehouse/warehouse_replenish', {services});
    })
    .catch(err=>console.log(err))
   
});
router.post('/warehouse-replenish',
[
    check('product_name')
        .isLength({ min: 5 })
        .withMessage('Название продукта должно состоять не менее чем из 5 символов!')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Название продукта не может быть пустым!'),
    check('drawing')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Рисунок товара не может быть пустым!'),
    check('sort')
        .not()
        .isEmpty()
        .withMessage('Сорт продукта не может быть пустым!'),
    check('service')
        .not()
        .isEmpty()
        .withMessage('Доп. услуга не может быть пустым!'),
    check('overall_code')
        .not()
        .isEmpty()
        .withMessage('Код продукта не может быть пустым!'),
    check('price')
        .not()
        .isEmpty()
        .withMessage('Цена продукта не может быть пустым!'),
    check('added_quantity')
        .not()
        .isEmpty()
        .withMessage('Количество продукта не может быть пустым!'),
    check('overall_sum')
        .not()
        .isEmpty()
        .withMessage('Итоговая цена не может быть пустым!'),
    check('added_date')
        .not()
        .isEmpty()
        .withMessage('Дата пополненения не может быть пустым!'),
],(req,res)=>{
    
    Promise.all([
        Product.findAll(),
        Additional_service.findAll(),
    ])
    .then(data=>{
        const products = data[0];
        const services = data[1];
        const errors = validationResult(req);
        const req_values = req.body;

        if(!errors.isEmpty())
        {
            const error = errors.array();
        
            return res.render('partials/warehouse/warehouse_replenish', {services,error,req_values});
        }
        else
        {
            //All requested values
            const product_name = (req.body.product_name).toUpperCase();
            const drawing = (req.body.drawing).toUpperCase();
            const sort = req.body.sort;
            const price = req.body.price;
            const service = req.body.service == 0 ? null : parseInt(req.body.service);
            const overall_code = parseInt(req.body.overall_code);
            const quantity = req.body.added_quantity;
            const overall_price = req.body.overall_sum;
            const date = req.body.added_date;

            var searching_product;
            var searching_code;
            

            // Requested values caompared (by linear search) with database rows until it finds same product with exact same name, drawing and sort
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
                                searching_product = products[i].id;
                                searching_code = products[i].overall_code;
                            }
                        }
                    }          
                }
            }

            if(searching_code == overall_code)
            {
                Product.increment({
                    available_quantity:quantity
                }, {where:{overall_code:overall_code}})

                Warehouse_supplement_story.create({
                    ProductId:searching_product,
                    product_code:overall_code,
                    added_quantity:quantity,
                    overall_price:overall_price,
                    added_date:date,
                })
                
                
                const success = 'Товар успешно пополнен!';

                return res.render('partials/warehouse/warehouse_replenish', {services,success});
            }
            else
            {
                const warning = 'Введенные данные и код продукта не совпадают. Еще раз проверьте введенную информацию!';

                return res.render('partials/warehouse/warehouse_replenish', {services,warning,req_values});

            }
            


        }

    })
    .catch(err => console.log(err));

})

// WAREHOUSE SINGLE REPLENISH PAGE
router.get('/single-replenish/:id',(req,res)=>{
    Promise.all([
        Product.findAll({where:{id:req.params.id}}),
    ])
    .then(data=>{
        const product = data[0];

        return res.render('partials/warehouse/single_replenish',{product});
    })
    .catch(err=>console.log(err));
});
router.post('/single-replenish/:id',
[
    check('added_quantity')
        .not()
        .isEmpty()
        .withMessage('Количество продукта не может быть пустым!'),
    check('overall_sum')
        .not()
        .isEmpty()
        .withMessage('Итоговая цена не может быть пустым!'),
    check('added_date')
        .not()
        .isEmpty()
        .withMessage('Дата пополненения не может быть пустым!'),
],(req,res)=>{
    Promise.all([
        Product.findAll({where:{id:req.params.id}}),
    ])
    .then(data=>{
        const product = data[0];
        const errors = validationResult(req);

        if(!errors.isEmpty())
        {
            const error = errors.array();
        
            return res.render('partials/warehouse/single_replenish', {error});
        }
        else
        {
            const overall_code = parseInt(req.body.overall_code);         
            const quantity = req.body.added_quantity;
            const overall_price = req.body.overall_sum;
            const date = req.body.added_date;

            Product.increment({
                available_quantity:quantity
            }, {where:{overall_code:overall_code}})

            Warehouse_supplement_story.create({
                ProductId:req.params.id,
                product_code:overall_code,
                added_quantity:quantity,
                overall_price:overall_price,
                added_date:date,
            })
            
            
            const success = 'Товар успешно пополнен!';

            return res.render('partials/warehouse/single_replenish', {product,success});
        }

    })
    .catch(err => console.log(err));    

});

// WAREHOUSE RESERVE PAGE
router.get('/warehouse-check-reserve', (req,res)=>{
    Promise.all([
        Product.findAll({where:{available_quantity:{[Op.gt]: 0},AdditionalServiceId:null}}),
        Product.findAll({where:{available_quantity:0,AdditionalServiceId:null}}),
        Product.findAll({include: {model:Additional_service, as:'Additional_Service'},
        where:{
            available_quantity:{[Op.gt]: 0},
            AdditionalServiceId:{[Op.ne]: null}
        }}),
        
    ])
    .then(data=>{
        
        const products = data[0];
        const not_products = data[1];
        const service_products = data[2];

        return res.render('partials/warehouse/check_reserve', {products,not_products,service_products});

    })
    .catch(err => console.log(err));
    
});

// WAREHOUSE SUPPLEMENT STORY 
router.get('/warehouse-supplement-story', (req,res)=>{

    Warehouse_supplement_story.findAll({include:{model:Product, as:'Product'}, order:[['added_date','DESC']]})
    .then(data=>
        
        res.render('partials/warehouse/supplement_story', {data})
    )
    .catch(err => console.log(err));

    
 

});

router.get('/single-supplement-story/:id',(req,res)=>{
    Promise.all([
        Warehouse_supplement_story.findAll({include:{model:Product, as:'Product'},where:{ProductId:req.params.id}})
    ])
    .then(data=>{
        const story = data[0];

        res.render('partials/warehouse/single_story',{story});
    })
    .catch(err=>console.log(err));
});



module.exports = router;