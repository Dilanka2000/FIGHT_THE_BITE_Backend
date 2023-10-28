import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import Axios from "axios";

import ENV from "../config.js";

let mailConfig = {
    service: "gmail",
    auth: {
        user: ENV.EMAIL,
        pass: ENV.PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
};

let transporter = nodemailer.createTransport(mailConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mahasona",
        link: 'https://mailgen.js/'
    }
});


/** POST: http://localhost:4040/api/registerMail
 * @param : {
  "name": "Test 01"
  "userEmail": "user01@gmail.com",
  "text": "",
  "subject": ""
  }
*/
export async function registerMail(req, res){
    const { name, userEmail, text, subject } = req.body;

    // body of the email
    let email = {
        body: {
            name,
            intro: text || "Welcome to Haunted House! We're very excited to have you on board.",
            outro: "Need help, or have question? Just reply to this email, we'd love to help."
        }
    }

    let emailBody = MailGenerator.generate(email);

    let massage = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || "Signup Successfully",
        html: emailBody
    }

    // send mail
    transporter.sendMail(massage).then(() => {
        return res.status(200).send({ msg: "You should receive an email from us." });
    }).catch(error => res.status(500).send({ error }));

}

export async function smssender(to, message){
  var users = ENV.SMSUSER;
  var apikey = ENV.SMSAPIKEY;
//   var message = "hi";
  console.log("Hi")

  var result = await Axios.post(
    `https://app.notify.lk/api/v1/send?user_id=${users}&api_key=${apikey}&sender_id=NotifyDEMO&to=${to}&message=${message}`
  );
  // var res = await Axios.post('https://webhook.site/06c6373a-2420-4fa2-a061-8effd34ba09b')
  return result;
};