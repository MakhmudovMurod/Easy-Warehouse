module.exports = (sequelize,DataTypes) => {
   
    const Additional_Service = sequelize.define('Additional_Service', {
    name:{
        type:DataTypes.STRING
    },

    price: {
        type:DataTypes.FLOAT,
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

    return Additional_Service;

}