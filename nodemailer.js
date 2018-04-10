var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

var config = {
  "SMTP_HOST": "smtp.sendgrid.net",
    "SMTP_PORT": 25,
    "SMTP_USER":"apikey",
    "SMTP_PASS": "SG.xQsPEjavTfqsWih82w5MfQ.uGWWWVGbZqTxY4iW2mraWLyBLnYQEreBsA8TAiQM7Ws"

}

            var mailer = nodemailer.createTransport(smtpTransport({
                host: config.SMTP_HOST,
                port: config.SMTP_PORT,
                auth: {
                    user: config.SMTP_USER,
                    pass: config.SMTP_PASS
                }
            }));
            mailer.sendMail({
                from: "prachisrivastav1412@gmail.com",
                to: "prachisrivastav1412@gmail.com",
                cc:"",
                subject: "Attention Alert Warning",
                template: "hii",
                html: "hii"
            }, (error, response) => {
                if (error) {// resolve({ message: "Email not send " });\
                    console.log(error);
                } else {
                	console.log(response)
                    // resolve({ message: "Email send successfully" });\
                }
                mailer.close();
            });