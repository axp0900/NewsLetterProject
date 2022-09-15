const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");



mailchimp.setConfig({
    apiKey: "e2f5fa8c255fadb12b232a8b91008550-us14",
    server: "us14"
});

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const emailAddress = req.body.emailAddy;
    const listId = "c37ce88d8a";
    const subscriberUser = {
        firstName: firstName,
        lastName: lastName,
        email: emailAddress
    }

    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscriberUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscriberUser.firstName,
                LNAME: subscriberUser.lastName
            }
        });

        res.sendFile(__dirname + "/success.html");
        console.log(
            `Successfully created an audience. The audience id is ${response.id}.`
        );
    }
    

    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});



app.listen(port, function () {
    console.log(`Server is running on port ${port}`);
});

