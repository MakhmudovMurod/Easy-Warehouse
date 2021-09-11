const express = require('express');
const router = express.Router();
const path = require('path');
const app = express();
const db = require('../models/db');
const Deal = db.deals;
const Client = db.clients;
 
 

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

//Adding new Deal
router.get('/deals-create', (req,res)=>{
    res.render('partials/deals/deals_create', {layout:'main'});
});





router.get('/deals-history',(req,res)=>{
    
 
      
    Deal.findAll({include: {model:Client, as:'Client'}})
    .then(deals=>
        
    res.render('partials/deals/deals_history',{deals})
    )
    .catch(err=>console.log(err));
 
 });



module.exports = router;