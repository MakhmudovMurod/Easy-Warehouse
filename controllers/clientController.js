const express = require('express');
const router = express.Router();
const path = require('path');
const app = express();
const { Op } = require("sequelize");
const db = require('../models/db');
const Client = db.clients;
const Deal = db.deals;
const Product = db.products;
const Sold_product = db.sold_products;
const Balance_story = db.balance_story;
const Problematic_sold_product = db.problematic_sold_products;

 

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));


/*---------------------------------------------------------------------------------------------------DISPLAYING LIST OF ALL CLIENTS */

router.get('/client-list',(req,res)=>{

    Client.findAll()
    .then(clients=>
        res.render('partials/clients/clients', {clients})
    )
    
    .catch(err => console.log(err));
}
);


/*---------------------------------------------------------------------------------------------------CREATING A NEW CLIENT */

router.get('/client-create',(req,res)=>{
    res.render('partials/clients/create_client', {layout:'main'});
});
router.post('/client-create',(req,res)=>{

    Client.create({
        first_name:req.body.client_name,
        company:req.body.client_company,
        phone_number:req.body.client_phone_number,
        balance:0,
            
     })
    .then(
        res.redirect('/client/client-list')
        )
     
    .catch(err=>console.log(err));
    
});


/*-------------------------------------------------------------------------------------------------- DISPLAYING A CLIENT PROFILE PAGE AND INFOS*/

router.get('/client-profile/:id', (req,res)=>{

    /* Note: in here [req.params.id] is the CLIENT ID */

    Promise.all([
        Client.findOne({attributes:['balance'],where:{id:req.params.id}}),
        Deal.findAll({attributes:['id','final_price','paid_cash'],where:{ClientId:req.params.id,status:1}}),
        Deal.count({where:{ClientId:req.params.id,status:1}}),
      ])
      .then(data=>{
          var balance = data[0].balance;
          var client_deals = data[1];
          var client_deal_number = data[2];     
          
  
          if(balance === 0)
          {
              for(i=0;i<client_deal_number; i++)
              {   
                  var final_price = client_deals[i].final_price;
                  var deal_id = client_deals[i].id;
                  Deal.update({
                      paid_cash:final_price
                  },{where:{ClientId:req.params.id,id:deal_id}})
              }    
          }
      })
   
    Promise.all([
        /* [0] */   Client.findAll({limit:1,where:{id:req.params.id}}),
        /* [1] */   Deal.count({where:{ClientId:req.params.id,status:1}}),
        /* [2] */   Deal.sum('final_price',{where:{'ClientId':req.params.id}}),
        /* [3] */   Deal.findOne({
                                  attributes:['deal_date'],
                                  order: [['deal_date', 'DESC']], 
                                  where:{ClientId:req.params.id,status:1}
                                }),
        /* [4] */   Deal.findAll({where:{ClientId:req.params.id,status:1}}),
        /* [5] */   Product.findAll(),
        // /* [6] */   Problematic_sold_product
    ])
    .then(data =>{
        var clients = data[0];
        if( data[3])
        {   var last_deal_date = data[3].deal_date;
            var deals_number = data[1];
            var overal_deals_cost = data[2];
        }
        else
        {   var last_deal_date_none = "пока нет сделок";
            var deals_number = "пока нет сделок";
            var overal_deals_cost = "пока нет сделок";
        }
        var client_deals = data[4];
        var products = data[5];
        
        res.render('partials/clients/client_profile',{clients,deals_number,overal_deals_cost,last_deal_date,
                                                        last_deal_date_none,client_deals,products,});
    })        
    .catch(err => console.log(err));
});

/* ---------------------------------------------------------------------------------------------- 5.CREATING A NEW DEAL FOR CLIENT */

router.get('/client-deal/:id',(req,res)=>{
    
    /* Note: in here [req.params.id] is the CLIENT ID */
    


    Promise.all([
        Deal.findOne({attributes:['status','id'], order:[['createdAt','DESC']]}),
        Deal.findOne({attributes:['id','status'], where:{status:0}}),
                
    ])
    .then(ob=>{

        
        if(ob !== null)
        {
            var status = ob[0].status;
            var last_deal_id = ob[0].id;
            
            var status_2 = ob[1].status;
            var deal_id_2 = ob[1].id;

            console.log(last_deal_id);
            

            if(status == 0)
            {   
                
                Deal.update({
                    ClientId:req.params.id,
                },{where:{id:last_deal_id}})
            }
            if(status_2 == 0)
            {
                Deal.update({
                    ClientId:req.params.id,
                },{where:{id:deal_id_2}})
            }

            if(status == 1)
            {
                Deal.create({
                    ClientId:req.params.id,
                })
            }
        }
        
    })
    .catch(err=>console.log(err));
    
            
    Promise.all([
        Deal.create({Client:req.params.id}),
        Product.findAll({}),
        Deal.findOne({attributes:['id'],order: [['createdAt', 'DESC']]}),
        Product.findAll({where:{'available_quantity':{[Op.gt]:0}}}),
        Product.count({where:{'available_quantity':{[Op.gt]:0}}}),
        Product.findAll({where:{'available_quantity':{[Op.gt]:0}}}),
    ])

    .then(data=>{
        var products = data[1];
        var deal_id = data[2].id;
        var available_products = data[3];
        var product_number = data[4];

        var arr = [];
        
        for(i=0; i<product_number; i++)
        {
            arr.push
            ({ 
                id: data[5][i].id, 
                class:data[5][i].product_class,
                subclass:data[5][i].prduct_subclass, 
                drawing:data[5][i].drawing, 
                sort:data[5][i].sort, 
                price:data[5][i].price,
                quantity:data[5][i].available_quantity, 
            })
        }



        
        res.render('partials/clients/create_deal',{products,deal_id,available_products,
        product_number,
        arr});
    })
    .catch(err=>console.log(err));
});

router.post('/client-deal/:id',(req,res)=>{

    /* Note: in here [req.params.id] is the Deal ID */
    

    var array = req.body.product_id;
    var sold_products_number = array.length;
    var isArray = Array.isArray(array);



    for(i=0;i<sold_products_number; i++)
    {
        if(sold_products_number > 1)
            {
                Sold_product.create({
                    DealId:req.params.id,
                    ProductId:req.body.product_id[i],
                // product:price
                    sold_quantity:req.body.product_quantity[i],
                    overall_sold_cost:req.body.total[i],
                })
                Product.decrement('available_quantity',
                                {
                                    by: req.body.product_quantity[i],
                                    where:{id:req.body.product_id[i]}
                                })
        }
    }
    
    if(isArray===false)
    {
        Sold_product.create({
            DealId:req.params.id,
            ProductId:req.body.product_id,
        // product:price
            sold_quantity:req.body.product_quantity,
            overall_sold_cost:req.body.total,
        })
        Product.decrement('available_quantity',
                        {
                            by: req.body.product_quantity,
                            where:{id:req.body.product_id}
                        })
    }

    
    Deal.update({
        fixed_price:req.body.deal_fixed_price,
        total_additional_price:0,
        cash_discount:req.body.deal_cash_discount,
        final_price:req.body.deal_final_price,
        deal_date:req.body.create_deal_date,
        paid_cash:req.body.deal_paid_cash,
        status:1
        
    },{where:{id:req.params.id}})

    var balance_difference = req.body.deal_final_price - req.body.deal_paid_cash; 
    
    Promise.all([
        Deal.findOne({attributes:['ClientId'],order: [['createdAt', 'DESC']],where:{id:req.params.id}}),
    ])
    .then(ob=>{
            
        var client_id = ob[0].ClientId;

        Client.decrement('balance',
                            {
                                by:balance_difference,
                                where:{id:client_id}, 
                            })

    })

    
    
    .then(
        
        res.redirect('/client/client-list/')
    )
    .catch(err=>console.log(err));

})

/*------------------------------------------------------------------------------------------------------PROBLEMATIC DEALS  */

router.get('/client-problem-deal/:id',(req,res)=>{

    /* NOTE: in here [req.params.id] is SOLD PRODUCT ID */
    // Promise.all
    // ([
    //     Problematic_sold_product.create({                                                            
                     
    //     }),                                                                                      
    //     Sold_product.findAll({limit:1,where:{}}),                                                     
    //     Product.findAll({limit:1,where:{}}),                                                        
    // ])                                                                                               
    // .then(data=>{
    //     res.render('partials/clients/problem_deal');
    // })
    // .catch(err=>console.log(err));
    
});

/*------------------------------------------------------------------------------------------------------ DISPLAY SOLUTIONS OF PROBLEMATIC DEALS  */
router.get('/problem-solutions/:id',(req,res)=>{

    /* NOTE: in here [req.params.id] is SOLD CLIENT ID */
    
    Problematic_sold_product.findAll({where:{ClientId:req.params.id}})
    .then(problems=>{

        res.render('partials/clients/problem_products',{problem});
    })
    .catch(err=>console.log(err));

})


/*------------------------------------------------------------------------------------------------------DEAL DETAILS OF CLIENT */

router.get('/client-deal-detail/:id',(req,res)=>{

    /* NOTE: In here  [req.params.id] is DEAL ID */
    
    Promise.all([
        Deal.findAll({limit:1,where:{id:req.params.id}}),
        Sold_product.findAll({where:{DealId:req.params.id}}),
        Deal.findOne({attributes:['ClientId'], where:{id:req.params.id}}),
    ])
    .then(data=>{

        var deals = data[0];
        var sold_products = data[1];     
        var client_id = data[2].ClientId;
        
        res.render('partials/clients/deal_detail',{deals, sold_products,client_id});
    })
    .catch(err=>console.log(err));
});

/*-----------------------------------------------------------------------------------------------------UPDATE/EDIT CLIENT INFORMATION */

router.get('/client-edit/:id',(req,res)=>{

    /* NOTE: in here [req.params.id] is CLIENT ID */

    Client.findAll({limit:1,where:{id:req.params.id}})
    .then(client=>
    
        res.render('partials/clients/client_edit', {client})
    )
    
    .catch(err => console.log(err));
     
});
router.post('/client-edit/:id',(req,res)=>{

    if(req.body.update_name)
    {
        Client.update({ 
            first_name:req.body.update_name,
        },{where:{id:req.params.id}})
    }
    if(req.body.update_phone_number)
    {
        Client.update({ 
            phone_number:req.body.update_phone_number,
        },{where:{id:req.params.id}})
    }
    if(req.body.update_company)
    {
        Client.update({ 
            company:req.body.update_company,
        },{where:{id:req.params.id}})
    }
    
    res.redirect('/client/client-profile/'+ req.params.id)
});

/*------------------------------------------------------------------------------------------------BALANCE HISTORY OF CLIENT */

router.get('/client-balance/:id',(req,res)=>{

    /* NOTE: in here [req.params.id] is CLIENT ID */

    Promise.all([
        Client.findOne({attributes:['balance'],where:{id:req.params.id}}),
        Deal.findAll({attributes:['id','final_price','paid_cash'],where:{ClientId:req.params.id,status:1}}),
        Deal.count({where:{ClientId:req.params.id,status:1}}),
      ])
      .then(data=>{
          var balance = data[0].balance;
          var client_deals = data[1];
          var client_deal_number = data[2];     
          
  
          if(balance === 0)
          {
              for(i=0;i<client_deal_number; i++)
              {   
                  var final_price = client_deals[i].final_price;
                  var deal_id = client_deals[i].id;
                  Deal.update({
                      paid_cash:final_price
                  },{where:{ClientId:req.params.id,id:deal_id}})
              }    
          }
      })

    Promise.all([
        Balance_story.findAll({where:{ClientId:req.params.id}}),
        Client.findAll({where:{id:req.params.id}})
    ])
    
    .then(data=>{
        
        var balance = data[0];
        var client = data[1];
        
        res.render('partials/clients/client_balance', {balance,client})
    })
    
    .catch(err => console.log(err));
});

/*------------------------------------------------------------------------------------------------UPDATE (REPLENISH) BLANCE OF CLIENT */

router.post('/client-balance-update/:id',(req,res)=>{
    
    /* NOTE: in here [req.params.id] is CLIENT ID */
    
    Promise.all([
      Client.findOne({attributes:['balance'],where:{id:req.params.id}}),
       Deal.findAll({attributes:['id','final_price','paid_cash'],where:{ClientId:req.params.id,status:1}}),
       Deal.count({where:{ClientId:req.params.id,status:1}}),
    ])
    .then(data=>{
        var balance = data[0].balance;
        var client_deals = data[1];
        var client_deal_number = data[2];     
        

        if(balance >= 0)
        {
            for(i=0;i<client_deal_number; i++)
            {   
                var final_price = client_deals[i].final_price;
                var deal_id = client_deals[i].id;
                Deal.update({
                    paid_cash:final_price
                },{where:{ClientId:req.params.id,id:deal_id}})
            }    
        }
    })
    Client.increment({balance:req.body.balance_add_amount},{where:{id:req.params.id}})
    Balance_story.create({
       ClientId:req.params.id,
       payment_amount:req.body.balance_add_amount,
       payment_type:req.body.payment_type,
    })

    .then(
        res.redirect('/client/client-balance/'+req.params.id)
    )
    .catch(err=>console.log(err));
});




module.exports = router;


   

