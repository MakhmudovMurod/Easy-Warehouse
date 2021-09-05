 

module.exports = (sequelize,DataTypes) => {
   
    const Warehouse_supplement_story = sequelize.define('Warehouse_supplement_story', {
   
    added_date:{
        type:DataTypes.DATE
    },

    added_quantity:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    product_code:{
        type:DataTypes.INTEGER,
    },
    overall_price:{
        type:DataTypes.DECIMAL,
    },
    createdAt:{
        type:DataTypes.DATE
    },

    updatedAt:{
        type:DataTypes.DATE
    }
    
});

    return Warehouse_supplement_story;

}