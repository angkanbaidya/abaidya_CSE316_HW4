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




app.get("/", (req,res) =>{
    writeSearch(req,res);
});
 
app.get("/schedule",(req,res) => {
    writeSchedule(req,res);
});
 

port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log("server is at http://localhost:3000");
});


function writeSearch(req,res) {
res.writeHead(200, { "Content-Type": "text/html"});
let query = url.parse(req.url,true).query;
let search = query.search ? query.search : "";
let filter = query.filter ? query.filter : "";


html = `
<!DOCTYPE html>

<head>
    <title> CSE Class Finder </title>
</head>
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
<h1> CSE Class Find </h1><br>
<form method= "get" action = "/">
    <input type="text" name ="search" value="">
    <b>in</b>
    <select name = "filter">
     <option value = "allFields"> All Fields </option>
     <option value = "courseName"> Course Title </option>
     <option value = "classnumber"> Course Number </option>
     <option value = "instructor"> Instructor </option>
     <option value = "day"> Day </option>
     <option value = "time"> Time </option>
</select>
<input type="submit" value="Submit">
<br>
Example Searches: 220, fodor, 3:30 PM, MWF
</form>
<br><br>
`;




let sql = "SELECT * FROM classes;";
if (filter == "allFields")
    sql = `SELECT * FROM classes 
             WHERE SUBJ  LIKE '%` + search + `%' OR 
             CRS LIKE '%` + search + `%' OR
             TITLE LIKE '%` + search + `%' OR
             CMP LIKE '%` + search + `%' OR 
             SCTN   LIKE '%` + search + `%' OR
             DAYS      LIKE '%` + search + `%' OR
             STARTTIME LIKE '%` + search + `%' OR
             ENDTIME LIKE '%` + search + `%' OR
             MTGSTART LIKE '%` + search + `%' OR
             MTGEND LIKE '%` + search + `%' OR
             DURATION LIKE '%` + search + `%' OR
             INSTRUCTION LIKE '%` + search + `%' OR
             BUILDING LIKE '%` + search + `%' OR
             ROOM LIKE '%` + search + `%' OR
             INSTRUCTOR LIKE '%` + search + `%' OR
             ENRLCAP LIKE '%` + search + `%' OR
             WAITCAP LIKE '%` + search + `%' OR
             CmbndDescr LIKE '%` + search + `%' OR
             CmbndEnrlCap LIKE '%` + search + `%';`;

else if (filter == "classnumber")
    sql = `SELECT * FROM classes 
    WHERE CRS LIKE '%` + search + `%';`;
else if (filter =="courseName")
sql = `SELECT * FROM classes 
WHERE TITLE LIKE '%` + search + `%';`;
else if (filter == "instructor")
sql = `SELECT * FROM classes
    WHERE INSTRUCTOR LIKE '%` + search + `%';`;
else if (filter == "day")
sql = `SELECT * FROM classes 
 WHERE DAYS LIKE '%` + search + `%';`;
else if (filter == "time")
sql = `SELECT * FROM classes 
 WHERE STARTTIME LIKE '%` + search +`%' OR
 ENDTIME LIKE '%` + search + `%';`;

 con.query(sql,function(err,result){
    if (err) throw err;
    for (let item of result){
        html += `
            <pre>
                Class: CSE ` + " " + item.CRS + " " + item.TITLE + `
                Section: ` + item.SCTN + `
                Days: ` + item.DAYS + `
                Start Time: ` + item.STARTTIME + `
                End Time: + ` + item.ENDTIME + `
                Start Date: + ` + item.MTGSTART + `
                End Date: + ` + item.MTGEND + `
                Duration: + ` + item.DURATION + `
                Instrction Mode: ` + item.INSTRUCTION + `
                Building: ` + item.BUILDING + `
                Room: ` + item.ROOM+ `
                Instructor ` + item.INSTRUCTOR + `
                Enrollment Cap: ` + item.ENRLCAP + `
                Wait Cap: ` + item.WAITCAP + `
                Combined Description: ` + item.CmbndDescr+ `
                Combined Enrollment Cap: ` + item.CmbndEnrlCap + `<form action ="/schedule" method= "get">
                <button name="add" value = "` + item.id + `"> Add Class </button></form></pre>`;
                
    }

    res.write(html+ "\n\n</body>\n</html>");
    res.end();
});


         

};

function writeSchedule(req,res) {
    let query = url.parse(req.url,true).query;
    let addQuery = `INSERT INTO saved SELECT * FROM classes WHERE classes.id="`+query.add+ `";`
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title> Schedule </title>
        <style type = text/css>
        table,tr,th,td{
            border:1px solid black;
            height 50px;
            vertical-align: bottom;
            padidng: 15px;
            text-align: left;
        }
        </style>
        </head>
        <body>
        <h1> Schedule </h1><br>
        <a href = "/"><b> Return to Search </b></a>
        <br><br>

        <table>
            <tr>
            <th> Monday </th>
            <th> Tuesday </th>
            <th> Wednesday </th>
            <th> Thursday </th>
            <th> Friday </th>
        </tr>
        <tr>
            <td> Monday </td>
            <td> Tuesday </td>
            <td> Wednesday </td>
            <td> Thursday </td>
            <td> Friday </td>
        </tr>
        </table>
    </body>
    </html>
    `;

    con.query(addQuery, function(err, result) {
        if (err) console.log(err);
        con.query(constructSQLDayCommand("M"), function(err, result) {
            if (err) throw err;
            html = html.replace("<td> Monday </td>", getDay(result, "MON"));
            con.query(constructSQLDayCommand("TU"), function(err, result) {
                if (err) throw err;
                html = html.replace("<td> Tuesday </td>", getDay(result, "TUE"));
                con.query(constructSQLDayCommand("W"), function(err, result) {
                    if (err) throw err;
                    html = html.replace("<td> Wednesday </td>", getDay(result, "WED"));   
                    con.query(constructSQLDayCommand("TH"), function(err, result) {
                        if (err) throw err;
                        html = html.replace("<td> Thursday </td>", getDay(result, "THU"));
                        con.query(constructSQLDayCommand("F"), function(err, result) {
                            if (err) throw err;
                            html = html.replace("<td> Friday </td>", getDay(result, "FRI")); 
                            res.write(html + "\n\n<body>\n</html>");
                            res.end();    
                        });
                    });
                });
            });
        });
    });
}


function getDay(SQLResult, tableHeader) {
    let retSTR = "<td>";
    for (let item of SQLResult) {
        retSTR += "\n      <b> " + item.STARTTIME + " - " +
        item.ENDTIME + " <br><br>"  + item.SUBJ + " " + 
        item.CRS + "-" + item.SCTN + " </b> <p> " +
        item.TITLE + "<br><br>" + 
        item.INSTRUCTOR + "<br><br>" +
        "<br/><br/>";

    }
    return retSTR + "</td>";

}

function constructSQLDayCommand(search){
    var sql = `SELECT * FROM saved 
    WHERE Days           LIKE '%` + search + `%'
    ORDER BY STARTTIME;`;
return sql;
};






