module.exports = (sequelize,DataTypes) => {
   
    const Product = sequelize.define('Product', {
    product_name:{
        type:DataTypes.STRING
    },

    name_code:{
        type:DataTypes.INTEGER,
        // unique:true
    },

    drawing:{
        type:DataTypes.STRING,
    },

    drawing_code:{
        type:DataTypes.INTEGER,
    },

    sort:{
        type:DataTypes.INTEGER
    },

    overall_code:{
        type:DataTypes.INTEGER,
        unique: true
    },

    price:{
        type:DataTypes.FLOAT
    },

    available_quantity:{
        type:DataTypes.INTEGER,
        allowNull: true,
    },

    createdAt:{
        type:DataTypes.DATE
    },

    updatedAt:{
        type:DataTypes.DATE
    }


});

    return Product;

}