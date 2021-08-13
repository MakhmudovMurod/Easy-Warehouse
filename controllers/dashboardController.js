const express = require('express');
const router = express.Router();
const path = require('path');
const app = express();
const db  = require('../models/db');
const { Op } = require("sequelize");
const Deals = db.deals;
const Client = db.clients;
const Product = db.products;
const Supplement_story = db.warehouse_supplement_story;

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));




router.get('', (req,res)=>{

    Promise.all([
    /* [0] */     Product.sum('available_quantity'),
    /* [1] */     Client.count(),
    /* [2] */     Product.sum('available_quantity',{where: {sort:1}}),
    /* [3] */     Supplement_story.findOne({attributes:['added_date'],order: [['added_date', 'DESC']]}),
    /* [4] */     Client.count({where:{'createdAt':{[Op.substring]:'-01-'}}}),
    /* [5] */     Client.count({where:{'createdAt':{[Op.substring]:'-02-'}}}),
    /* [6] */     Client.count({where:{'createdAt':{[Op.substring]:'-03-'}}}),
    /* [7] */     Client.count({where:{'createdAt':{[Op.substring]:'-04-'}}}),
    /* [8] */     Client.count({where:{'createdAt':{[Op.substring]:'-05-'}}}),
    /* [9] */     Client.count({where:{'createdAt':{[Op.substring]:'-06-'}}}),
    /* [10] */    Client.count({where:{'createdAt':{[Op.substring]:'-07-'}}}),
    /* [11] */    Client.count({where:{'createdAt':{[Op.substring]:'-08-'}}}),
    /* [12] */    Client.count({where:{'createdAt':{[Op.substring]:'-09-'}}}),
    /* [13] */    Client.count({where:{'createdAt':{[Op.substring]:'-10-'}}}),
    /* [14] */    Client.count({where:{'createdAt':{[Op.substring]:'-11-'}}}),
    /* [15] */    Client.count({where:{'createdAt':{[Op.substring]:'-12-'}}}),
    /* [16] */    Deals.sum('final_price'),
    /* [17] */    Deals.sum('final_price',{where:{'deal_date':{[Op.substring]:'-01-'}}}),
    /* [18] */    Deals.sum('final_price',{where:{'deal_date':{[Op.substring]:'-02-'}}}),
    /* [19] */    Deals.sum('final_price',{where:{'deal_date':{[Op.substring]:'-03-'}}}),
    /* [20] */    Deals.sum('final_price',{where:{'deal_date':{[Op.substring]:'-04-'}}}),
    /* [21] */    Deals.sum('final_price',{where:{'deal_date':{[Op.substring]:'-05-'}}}),
    /* [22] */    Deals.sum('final_price',{where:{'deal_date':{[Op.substring]:'-06-'}}}),
    /* [23] */    Deals.sum('final_price',{where:{'deal_date':{[Op.substring]:'-07-'}}}),
    /* [24] */    Deals.sum('final_price',{where:{'deal_date':{[Op.substring]:'-08-'}}}),
    /* [25] */    Deals.sum('final_price',{where:{'deal_date':{[Op.substring]:'-09-'}}}),
    /* [26] */    Deals.sum('final_price',{where:{'deal_date':{[Op.substring]:'-10-'}}}),
    /* [27] */    Deals.sum('final_price',{where:{'deal_date':{[Op.substring]:'-11-'}}}),
    /* [28] */    Deals.sum('final_price',{where:{'deal_date':{[Op.substring]:'-12-'}}}),
    /* [29] */    Product.findAll(),
    /* [30] */    Deals.findAll({include:{model:Client, as:'Client'},limit:5,order: [['deal_date', 'DESC']],where:{status:1} }),
    /* [31] */    Product.findAll({limit:5,order: [['createdAt', 'DESC']]}),
    // /* [32] */    Product.count(),
    
    
    ])
    .then(data =>{ 

        var product_quantity = data[0];
        var client_number = data[1];
        var sort1_quantity = data[2];
        if(data[3])
        {
            var update_date = data[3].added_date;
        }
        else
        {
            var update_date = "еще не добавлено";
        }
        
        //Monthly Number Of clients
        var client_jan = data[4];
        var client_feb = data[5];
        var client_mar = data[6];
        var client_apr = data[7];
        var client_may = data[8];
        var client_jun = data[9];
        var client_jul = data[10];
        var client_aug = data[11];
        var client_sep = data[12];
        var client_oct = data[13];
        var client_nov = data[14];
        var client_dec = data[15];
        
        var deal_cost = data[16];
        //Monthly Deals Value
        var deal_cost_jan = data[17];
        var deal_cost_feb = data[18];
        var deal_cost_mar = data[19];
        var deal_cost_apr = data[20];
        var deal_cost_may = data[21];
        var deal_cost_jun = data[22];
        var deal_cost_jul = data[23];
        var deal_cost_aug = data[24];
        var deal_cost_sep = data[25];
        var deal_cost_oct = data[26];
        var deal_cost_nov = data[27];
        var deal_cost_dec = data[28];
        
        var products = data[29];
        var latest_deals = data[30];
        var latest_products = data[31];
        
       res.render('partials/dashboard/dashboard',
        {
            product_quantity,client_number,sort1_quantity,update_date,
            
            client_jan,client_feb,client_mar,client_apr,client_may,client_jun,
            client_jul,client_aug,client_sep,client_oct,client_nov,client_dec,

            deal_cost,
            deal_cost_jan,deal_cost_feb,deal_cost_mar,deal_cost_apr,deal_cost_may,deal_cost_jun,
            deal_cost_jul,deal_cost_aug,deal_cost_sep,deal_cost_oct,deal_cost_nov,deal_cost_dec,

            products,latest_deals,latest_products,
        
        });
    })
        
});


module.exports = router;

