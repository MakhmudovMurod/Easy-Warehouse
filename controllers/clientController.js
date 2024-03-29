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
const Additional_service = db.additional_service;

const { body, check, validationResult } = require('express-validator');

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

//CLIENTS LIST PAGE
router.get('/client-list',(req,res)=>{

    Client.findAll()
    .then(clients=>
        res.render('partials/clients/clients', {clients})
    )
    .catch(err => console.log(err));
}
);

// CREATE CLIENT PAGE
router.get('/client-create',(req,res)=>{
    res.render('partials/clients/create_client', {layout:'main'});
});
router.post('/client-create',
[
    check('full_name')
        .isLength({ min: 5 })
        .withMessage('Фамилия и имя должны содержать более 5 символов!')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Фамилия и Имя не могут быть пустыми!'),
    check('phone_number')
        .isNumeric()
        .withMessage('Номер телефона должен быть только числовым значением!')
        .not()
        .isEmpty()
        .withMessage('Номер телефона не может быть пустым!'),
    check('company_name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Название компании не может быть пустым!'),
],(req,res)=>{
    Promise.all([
        Client.findAll(),
    ])
    .then(data=>{
        const clients = data[0];
        const req_values = req.body;
        const errors = validationResult(req);
        const error = errors.array();
        

        if(!errors.isEmpty())
        {
            return res.render('partials/clients/create_client',{error,req_values});
        }
        else
        {
            // All requested data
            const fullName = (req.body.full_name).toUpperCase();
            const company = (req.body.company_name).toUpperCase();
            const phoneNumber = req.body.phone_number;
            let equality = false;
            let phone_equality = false;

            for(let i=0; i<clients.length; i++)
            {
                if(fullName == clients[i].full_name)
                {
                    if(phoneNumber == clients[i].phone_number)
                    {
                        if(company == clients[i].company)
                        {
                            equality = true;
                        }
                    }
                }
                if(phoneNumber == clients[i].phone_number)
                {
                    phone_equality = true;
                }
            }
            const warning = [];
            if(equality)
            {   
                warning.push({msg:'Этот клиент создавался раньше!'});    

                return res.render('partials/clients/create_client',{warning,req_values});
            }
            else if(phone_equality)
            {
                warning.push({msg:'Этот номер телефона уже создан!'});

                return res.render('partials/clients/create_client',{warning,req_values});
            }
            else
            {   
                Client.create({
                    full_name:fullName,
                    company:company,
                    phone_number:phoneNumber,
                    balance:0
                })

                const success = 'Клиент успешно создан!';
            
                return res.render('partials/clients/create_client',{success});
            }
        }
    })
    .catch(err=>console.log(err));
});

// CLIENT EDIT PAGE
router.get('/client-edit/:id',(req,res)=>{
    Promise.all([
        Client.findAll({limit:1,where:{id:req.params.id}}),
    ])
    .then(data=>{
        const client = data[0][0];
        
        return res.render('partials/clients/client_edit', {client})
    })
    .catch(err=>console.log(err));
});
router.post('/client-edit/:id',
[
    check('full_name')
        .isLength({ min: 5 })
        .withMessage('Фамилия и имя должны содержать более 5 символов!')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Фамилия и Имя не могут быть пустыми!'),
    check('phone_number')
        .isNumeric()
        .withMessage('Номер телефона должен быть только числовым значением!')
        .not()
        .isEmpty()
        .withMessage('Номер телефона не может быть пустым!'),
    check('company_name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Название компании не может быть пустым!'),
]
,(req,res)=>{
    Promise.all([
        Client.findAll(),
        Client.findAll({limit:1,where:{id:req.params.id}}),
        
    ])
    .then(data=>{
        const clients = data[0];
        const client = data[0][0];
        const req_values = req.body;
        const errors = validationResult(req);
        const error = errors.array();

        if(!errors.isEmpty())
        {
            return res.render('partials/clients/client_edit',{error,req_values,client});
        }
        else
        {
            // All requested data
            const fullName = (req.body.full_name).toUpperCase();
            const company = (req.body.company_name).toUpperCase();
            const phoneNumber = req.body.phone_number;
            let equality = false;
            let phone_equality = false;
            let same_client_id;

            for(let i=0; i<clients.length; i++)
            {
                if(fullName == clients[i].full_name)
                {
                    if(phoneNumber == clients[i].phone_number)
                    {
                        if(company == clients[i].company)
                        {
                            equality = true;
                            same_client_id = clients[i].id;
                        }
                    }
                }
                if(phoneNumber == clients[i].phone_number)
                {
                    phone_equality = true;
                    same_client_id = clients[i].id;
                }
            }

            const warning = [];
            
            if(equality)
            {   
                if(same_client_id != req.params.id)
                {
                    warning.push({msg:'Этот клиент создавался раньше!'});    

                    return res.render('partials/clients/client_edit',{warning,req_values,client});
                }
                else
                {
                    Client.update({
                        full_name:fullName,
                        company:company,
                        phone_number:phoneNumber,
                    },{where:{id:req.params.id}})
    
                    return res.redirect('/client/client-profile/'+ req.params.id);
                }
            
            }
            if(phone_equality)
            {
                if(same_client_id != req.params.id)
                {
                    warning.push({msg:'Этот номер телефона уже создан!'});

                    return res.render('partials/clients/client_edit',{warning,req_values,client});
                }
                else
                {
                    Client.update({
                        full_name:fullName,
                        company:company,
                        phone_number:phoneNumber,
                    },{where:{id:req.params.id}})
    
                    return res.redirect('/client/client-profile/'+ req.params.id);
                }
            }
            else
            {   
                Client.update({
                    full_name:fullName,
                    company:company,
                    phone_number:phoneNumber,
                },{where:{id:req.params.id}})

                return res.redirect('/client/client-profile/'+ req.params.id);
            }
        }
    })
    .catch(err=>console.log(err));
});

// CLIENT PROFILE PAGE
router.get('/client-profile/:id', (req,res)=>{
    Promise.all([
        Client.findAll({limit:1,where:{id:req.params.id}}),
        Deal.findAll({where:{ClientId:req.params.id}}),
        Deal.count({where:{ClientId:req.params.id}}),
        Deal.sum('final_price',{where:{ClientId:req.params.id}}),
        Deal.findAll({limit:1,order:[['deal_date', 'DESC']],where:{ClientId:req.params.id}})
    ])
    .then(data=>{
        const client = data[0][0];
        const deals = data[1];
        const deals_number = data[2];
        const overall_deals_price = Number.isNaN(data[3]) ? 0 : data[3];
        // const last_deal_at = data[4][0].deal_date == null ? 'пока нет сделок' : data[4][0].deal_date;
        const last_deal_at ='пока нет сделок';

        return res.render('partials/clients/client_profile',{client,deals,deals_number,overall_deals_price,last_deal_at});
    })
    .catch(error=>console.log(error));
});

// CREATE NEW DEAL PAGE
router.get('/create-deal/:id',(req,res)=>{
    Promise.all([
        Additional_service.findAll(),        
    ])
    .then(data=>{
        const services = data[0];

        return res.render('partials/clients/create_deal',{services});
    })
    .catch(error=>console.log(error));
});
router.post('/create-deal/:id',(req,res)=>{

});

// DEAL DETAIL PAGE
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


/* THESE LOGICS WILL BE CHANGE AFTER DISCUSSION WITH CLIENT */
// PROBLEMATIC DEALS
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
// SOLUTIONS FOR PROBLEMATIC DEALS
router.get('/problem-solutions/:id',(req,res)=>{

    /* NOTE: in here [req.params.id] is SOLD CLIENT ID */
    
    Problematic_sold_product.findAll({where:{ClientId:req.params.id}})
    .then(problems=>{

        res.render('partials/clients/problem_products',{problem});
    })
    .catch(err=>console.log(err));

})
// BALANCE HISTORY PAGE
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
// REPLENISH BALANCE 
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
/* ---------------------------------------------------------- */





module.exports = router;


   

