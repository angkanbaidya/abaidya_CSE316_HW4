var mysql = require("mysql");
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "abc123",
    database: "hw4"
});
 
const express = require("express"); 
const app = express();
const url = require("url");
const { resolveSoa, CONNREFUSED } = require("dns");
const { SSL_OP_NO_QUERY_MTU } = require("constants");
const bodyParser = require('body-parser');


app.get("/", (req,res) =>{
    writeSearch(req,res);
});
 
app.get("/schedule",(req,res) => {
    writeSchedule(req,res);
});
 
function writeSearch(req,res){


html = `
<!DOCTYPE html>

<head>
<style>

    table {
        border: 10px solid red;
        padding: 4px 8px;
        margin-top: 20px;
    }   
    table,th{
        text-align:left;
        background-color: white;
        padding: 4px,30px,4px,8px
        
    }   
    td{
        text-align:center;
    }
</style>

<body>
<div class = "header">
<form name = "searchengine">
    <input type="text" name ="searchengine" id="searchTerm" />
<b> in </b>
<select name = "john">
    <option value = "allFields"> All Fields </option>
    <option value = "courseName"> Course Title </option>
    <option value = "classnumber"> Class Number </option>
    <option value = "day"> Day </option>
    <option value = "time"> Time </option>
</select>
<input type="submit" value="Submit" id="submitButton" />
</form>
`;

 ;
let entry = url.parse(req.url,true).query.searchengine;
let entrytwo = url.parse(req.url,true).query.john;


sql = "SELECT * FROM CLASSES"
console.log(entry);
console.log(entrytwo);
if (entrytwo == "allFields"){
    sql = `SELECT * FROM classes 
             WHERE SUBJ  LIKE '%` + entry + `%' OR 
             CRS LIKE '%` + entry + `%' OR
             TITLE LIKE '%` + entry + `%' OR
             CMP LIKE '%` + entry + `%' OR 
             SCTN   LIKE '%` + entry + `%' OR
             DAYS      LIKE '%` + entry + `%' OR
             STARTTIME LIKE '%` + entry + `%' OR
             ENDTIME LIKE '%` + entry + `%' OR
             MTGSTART LIKE '%` + entry + `%' OR
             MTGEND LIKE '%` + entry + `%' OR
             DURATION LIKE '%` + entry + `%' OR
             INSTRUCTION LIKE '%` + entry + `%' OR
             BUILDING LIKE '%` + entry + `%' OR
             ROOM LIKE '%` + entry + `%' OR
             INSTRUCTOR LIKE '%` + entry + `%' OR
             ENRLCAP LIKE '%` + entry + `%' OR
             WAITCAP LIKE '%` + entry + `%' OR
             CmbndDescr LIKE '%` + entry + `%' OR
             CmbndEnrlCap LIKE '%` + entry + `%`;
}

else if (entrytwo == "classnumber")
sql = `SELECT * FROM classes 
    WHERE CRS LIKE '%` + entry `%';`;
else if (entrytwo =="courseName")
sql = `SELECT * FROM classes 
WHERE TITLE LIKE '%` + entry `%';`;
else if (entrytwo == "instructor")
sql = `SELECT * FROM classes
    WHERE INSTRUCTOR LIKE '%` + entry `%';`;
else if (entrytwo == "day")
sql = `SELECT * FROM classes 
 WHERE DAYS LIKE '%` + entry `%';`;

else if (entrytwo == "time")
sql = `SELECT * FROM classes 
 WHERE STARTTIME LIKE '%` + entry `%' OR
 ENDTIME LIKE '%` + entry + `%';`;

 con.query(sql,function(err,result){
    for (let item of result){
        html += `
            <table>
                <tr>
                   <th>` + item.SUBJ + item.CRS + item.TITLE+ item.SCTN+item.CMP +  ` </th> 
                </tr>` +
                `</tr> 
                <th> ` + item.STARTTIME + item.ENDTIME + item.DURATION + `</th>
                 </tr>` +
                `<tr> 
                <th>` + item.MTGSTART + item.MTGEND + `</th>
                 </tr>` +
                `<tr> 
                <th>` + item.BUILDING + item.ROOM + item.INSTRUCTOR + `</th>
                 </tr>` +
                `<tr>
                 <th> ` + item.ENRLCAP + item.WAITCAP + `</th>
                  </tr>` +
                `<tr> <td> <button class = "Add"> Add Class </button> </td></tr> </form></table>`
                
    }

    res.write(html+ "\n\n</body>\n</html>");
    res.end();
});


         

};






port = process.env.PORT || 3001;
app.listen(port, () =>{
    console.log("server is at http://localhost:3000");
});

