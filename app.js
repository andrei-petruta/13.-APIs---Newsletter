const express = require("express");
const https = require("https");

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));



app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})


app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                    }
            }
        ]
    }

    const jsonData = JSON.stringify(data);


    const url = "https://us1.api.mailchimp.com/3.0/list/8ef91d3cfd"
    const options = {
        method: "POST",
        auth: "andrei:1592f02f41e67be8bbba524af1afdb8e-us1"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

})


app.post("/failure.html", function(req, res) {
    res.redirect("/");
})

app.post("/success.html", function(req, res) {
    res.redirect("/");
})




app.listen(process.env.PORT || 3000, function() {
    console.log("Server now running on port 3000!");
})


//API Key -- 1592f02f41e67be8bbba524af1afdb8e-us1
//List ID -- 8ef91d3cfd