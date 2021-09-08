const Sequelize = require('sequelize');
const {Op} = require('sequelize');
const sequelize = new Sequelize('Easy-Warehouse-DB','','',{
  host:'localhost',
  dialect: 'sqlite',
  storage: 'config/Easy-Warehouse-DB.db3'

  
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.clients = require('./client.model.js')(sequelize,Sequelize);
db.balance_story = require('./balance_story.model')(sequelize,Sequelize);
db.products = require('./product.model.js')(sequelize,Sequelize);
db.deals = require('./deal.model.js')(sequelize,Sequelize);
db.problematic_sold_products = require('./problematic_sold_product')(sequelize,Sequelize);
db.sold_products = require('./sold_product.model')(sequelize,Sequelize);
db.product_price_story = require('./product_price_story.model')(sequelize,Sequelize);
db.warehouse_supplement_story = require('./warehouse_supplement_story.model')(sequelize,Sequelize);
db.user = require('./user.model')(sequelize,Sequelize);
db.product_constants = require('./product_constants.model')(sequelize,Sequelize);
db.additional_service = require('./additional_service.model')(sequelize,Sequelize);

              //DATABASE RELATIONS
// Additional Service
db.additional_service.hasMany(db.products, { as: "Product"});
db.products.belongsTo(db.additional_service,{
  as: "Additional_Service"
});

// Clients --> Deals 
db.clients.hasMany(db.deals, { as: "Deal"});
db.deals.belongsTo(db.clients,{
  as:"Client" 
});

//Clients -->Balance_story
db.clients.hasMany(db.balance_story, { as: "Balance_story"});
db.balance_story.belongsTo(db.clients,{
  as:"Client" 
});


// Deals --> Sold_products
db.deals.hasMany(db.sold_products, { as: "Sold_product"});
db.sold_products.belongsTo(db.deals,{
  as:"Deal"
});

//Sold_products --> Problematic_sold_products
db.sold_products.hasMany(db.problematic_sold_products, { as: "Problematic_sold_product"});
db.problematic_sold_products.belongsTo(db.sold_products,{
  as:"Sold_product"
});
 
//Products --> Sold_products
db.products.hasMany(db.sold_products, { as: "Sold_product"});
db.sold_products.belongsTo(db.products,{
  as:"Product"
});

 
//Products --> Warehouse_supplement_story
db.products.hasMany(db.warehouse_supplement_story, { 
  onDelete: 'cascade',
  as: "Warehouse_supplement_story"});
db.warehouse_supplement_story.belongsTo(db.products,{
  onDelete: 'cascade', 
  foreignKey: { allowNull: false },
  as:"Product"
});

//Products --> Product_price_story
db.products.hasMany(db.product_price_story, { as: "Product_price_story"});
db.product_price_story.belongsTo(db.products,{
  as:"Product"
});



module.exports = db;




