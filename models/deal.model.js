 
module.exports = (sequelize,DataTypes) =>{

const Deal = sequelize.define('Deal', {
 
    fixed_price:{
        type:DataTypes.BIGINT
    },

    total_additional_price:{
        type:DataTypes.BIGINT
    },

    cash_discount:{
        type:DataTypes.INTEGER,
        defaultValue:0,
    },

    final_price:{
        type:DataTypes.BIGINT
    },

    deal_date:{
        type:DataTypes.DATE,
    },

    paid_cash:{
        type:DataTypes.BIGINT
    },

    status:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
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

