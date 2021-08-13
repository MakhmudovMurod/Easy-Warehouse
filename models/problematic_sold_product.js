 
module.exports = (sequelize,DataTypes) =>{

    const Problematic_sold_product = sequelize.define('Problematic_sold_product', {
       
        
        problematic_total_price:{
            type:DataTypes.INTEGER
        },
        problematic_quantity:{
            type:DataTypes.INTEGER
        },
        problem_description:{
            type:DataTypes.STRING
        },
        
        problem_solution:{
            type:DataTypes.STRING
        },
    
        altered_product_id:{
            type:DataTypes.INTEGER 
        },

        altered_product_quantity:{
            type:DataTypes.INTEGER
        },

        altered_product_total_price:{
            type:DataTypes.INTEGER
        },
        

        createdAt:{
            type:DataTypes.DATEONLY
        },
    
        updatedAt:{
            type:DataTypes.DATEONLY
        }
    
    
        
    });
    
    return Problematic_sold_product;
    
    };