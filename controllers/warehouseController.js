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



const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));




router.get('/warehouse-replenish', (req,res)=>{
    Promise.all([
        Product.findAll(),
        Additional_service.findAll(),
    ])
    .then(data=>{
        const products = data[0];
        const services = data[1];

        res.render('partials/warehouse/warehouse_replenish', {services})
    })
    .catch(err=>console.log(err))
   
});


router.post('/warehouse-replenish',(req,res)=>{
    
   
    Product.increment({available_quantity:req.body.added_quantity}, {where:{id:req.body.product_id}})
    
    
    Warehouse_supplement_story.create({

        ProductId:req.body.product_id,
        added_quantity:req.body.added_quantity,
        added_date:req.body.added_date,
    })
    .then(
    res.redirect('/warehouse/warehouse-check-reserve')
    )
    .catch(err=>console.log(err));

})




router.get('/warehouse-check-reserve', (req,res)=>{

    
    Promise.all([
        Product.findAll({where:{available_quantity:{[Op.gt]: 0}}}),
        Product.findAll({where:{available_quantity:0,AdditionalServiceId:null}}),
        Product.findAll({include: {model:Additional_service, as:'Additional_Service'},
        where:{
            available_quantity:{[Op.gt]: 0},
            AdditionalServiceId:{[Op.ne]: null}
        }})
    ])
    .then(data=>{
        
        const available_products = data[0];
        const not_available_products = data[1];
        const add_service_products = data[2];

        res.render('partials/warehouse/check_reserve', {available_products,not_available_products,add_service_products})

    })
    .catch(err => console.log(err));
    

});





router.get('/warehouse-supplement-story', (req,res)=>{

    Warehouse_supplement_story.findAll({include:{model:Product, as:'Product'}, order:[['added_date','DESC']]})
    .then(data=>
        
        res.render('partials/warehouse/supplement_story', {data})
    )
    .catch(err => console.log(err));

    
 

});



module.exports = router;