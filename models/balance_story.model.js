 module.exports = (sequelize,DataTypes) => {

    const Balance_story = sequelize.define('Balance_story', {
        
        payment_amount:{
            type:DataTypes.BIGINT
        },

        payment_type:{
            type:DataTypes.STRING
        },

        payment_date:{
            type:DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
    
        createdAt:{
            type:DataTypes.DATEONLY
        },
    
        updatedAt:{
            type:DataTypes.DATEONLY
        }
    
    });
    
        return Balance_story;
    
    };