 

module.exports = (sequelize,DataTypes) => {
   
    const Product_price_story = sequelize.define('Product_price_story', {
 
    price_set_date:{
        type:DataTypes.DATE
    },

    createdAt:{
        type:DataTypes.DATEONLY
    },

    updatedAt:{
        type:DataTypes.DATEONLY
    }


    
});

    return Product_price_story;

}