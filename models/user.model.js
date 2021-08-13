 
module.exports = (sequelize,DataTypes) => {
   
    const User = sequelize.define('User', {
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },

    password:{
        type:DataTypes.STRING,
        allowNull:false
    },

    createdAt:{
        type:DataTypes.DATEONLY
    },

    updatedAt:{
        type:DataTypes.DATEONLY
    }


});
    

    return User;

}

