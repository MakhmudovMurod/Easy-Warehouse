 

module.exports = (sequelize,DataTypes) => {
   
    const Sold_product = sequelize.define('Sold_product', {
 
    product_price:{
        type:DataTypes.INTEGER
    },

    sold_quantity:{
        type:DataTypes.INTEGER
    },

    overall_sold_cost:{
        type:DataTypes.BIGINT
    },

    createdAt:{
        type:DataTypes.DATEONLY
    },

    updatedAt:{
        type:DataTypes.DATEONLY
    }

    

});

    return Sold_product;

}