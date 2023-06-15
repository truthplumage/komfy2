const { rejects } = require('assert');
const mysql = require('mysql');
const { resolve } = require('path');
module.exports = class DBManager{
    constructor(){
        this.connection = mysql.createConnection({  
            host    : '127.0.0.1',   
            user    : 'komfy_admin', 
            password    : 'Mild1358!',   
            database    : 'komfy'  
        });
    }

    selectQuery(query, res) {
        this.connection.query(query, (error, result)=>{
            if(error){
                console.log(error);
                res.status(500).send(error)
            }else{
                res.send(result)
            }
        });
    }
    async getQuery(query, values) {
        return new Promise((resolve, rejects)=>{
            console.log(query);
            console.log(values);
            this.connection.query(query, values, function(error, result){
                if(error){
                    console.log(error);
                    rejects(error)
                }else{
                    console.log(result);
                    resolve(result)
                }
            });
        });
    }
    updateQuery(query, params, res) {
        console.log(query);
        console.log(params);
        this.connection.query(query, params, (error, result)=>{
            if(error){
                console.error(error);
                res.error(error);
            }else {
                console.log(result);
                res.send(result)
            }
        });
    }

}