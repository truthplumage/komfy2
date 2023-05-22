const mysql = require('mysql');
module.exports = class DBManager{
    constructor(){
        this.connection = mysql.createConnection({  
            host    : '210.114.1.95',   
            user    : 'komfy_admin', 
            password    : 'Mild1358!',   
            database    : 'komfy'  
        });
    }

    selectQuery(query, res) {
        this.connection.connect();
        this.connection.query(query, (error, result)=>{
            console.log(error);
            console.log(result);
            res.send(result)
        });
        this.connection.end();
    }

}