module.exports = (sequelize,DataTypes) => {

const Client = sequelize.define('Client', {
    full_name:{
        type:DataTypes.STRING
    },

    company:{
        type:DataTypes.STRING
    },

    phone_number:{
        type:DataTypes.STRING,
        unique:true
    },

    balance:{
        type:DataTypes.BIGINT
    },

    createdAt:{
        type:DataTypes.DATEONLY
    },

    updatedAt:{
        type:DataTypes.DATEONLY
    }

});

    return Client;

};