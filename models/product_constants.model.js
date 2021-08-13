module.exports = (sequelize,DataTypes) => {
   
    const Product_Constant = sequelize.define('Product_Constant', {
    name:{
        type:DataTypes.STRING
    },

    code:{
        type:DataTypes.INTEGER,
        unique: true
    },

    createdAt:{
        type:DataTypes.DATE
    },

    updatedAt:{
        type:DataTypes.DATE
    }


});

    return Product_Constant;

}