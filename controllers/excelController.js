const excel = require('exceljs');
const db = require('../models/db');
const Balance_story = db.balance_story;
const Client = db.clients;
const Deal = db.clients;
const Problematic_sold_product = db.problematic_sold_products;
const Product_price_story = db.product_price_story;
const Product = db.products;
const Sold_product = db.sold_products;
const Warehouse_supplement_story = db.warehouse_supplement_story;

const download = (req,res) => {
    Client.findAll().then((objs)=>{
        let clients = [];

        objs.forEach((obj)=>{

            clients.push({
                id:obj.id,
                first_name: obj.first_name,
                company:obj.company,
                phone_number:obj.phone_number,
                balance:obj.balance
            });
        });

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Clients');

        worksheet.columns = [
            {header: "ID", key:"id", width:5},
            {header: "First Name", key:"id", width:5},
            {header: "Company", key:"id", width:5},
            {header: "Phone Number", key:"id", width:5},
            {header: "Balance", key:"id", width:5},

        ];

        worksheet.addRows(clients);


        return workbook.xlsx.writeFile('clients.xlsx').then(function(){
            res.status(200).end();
        });
    });
};

module.exports = {
    download,
};