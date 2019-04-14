exports.DataHandler = class{
    constructor(filename){
        var fs = require("fs");
        var contents = fs.readFileSync(filename);
        this.dataset = JSON.parse(contents);
    }

    retrieve(){
        return this.dataset;
    }

    display(){
        return JSON.stringify(this.dataset);
    }
}