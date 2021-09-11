 
module.exports = (sequelize,DataTypes) =>{

const Deal = sequelize.define('Deal', {
 
    fixed_price:{
        type:DataTypes.BIGINT
    },

    overall_discount:{
        type:DataTypes.INTEGER,
        defaultValue:0,
    },

    final_price:{
        type:DataTypes.BIGINT
    },

    paid_cash:{
        type:DataTypes.BIGINT
    },

    deal_date:{
        type:DataTypes.DATE,
    },
    
    createdAt:{
        type:DataTypes.DATE
    },

    updatedAt:{
        type:DataTypes.DATE
    }

    
});



return Deal;

};

