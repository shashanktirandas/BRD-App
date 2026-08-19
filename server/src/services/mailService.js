
const config=require("../config/config")
const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];

apiKey.apiKey = config.email.api;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendOTP = async (email, otp) => {

    try {

        const sendSmtpEmail = {

            sender: {
                email: "chaamnotesapp@gmail.com",
                name: "Brd App"
            },

            to: [
                {
                    email: email
                }
            ],

            subject: "Brd Email Verification",

            htmlContent: `
                <div style="
                    font-family: Arial;
                    padding: 20px;
                ">

                    <h2 style="color:#4F46E5;">
                        Brd App
                    </h2>

                    <p>Your OTP is:</p>

                    <div style="
                        font-size:32px;
                        font-weight:bold;
                        background:#f4f4f4;
                        padding:20px;
                        text-align:center;
                        border-radius:8px;
                        letter-spacing:5px;
                    ">
                        ${otp}
                    </div>

                    <p>
                        OTP valid for 5 minutes.
                    </p>

                </div>
            `
        };

        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

        console.log("SUCCESS");
        console.log(data);

    } catch(err) {

        console.log("FAILED");
        console.log(err.response?.body || err);
    }
};

const sendAdminWelcomeEmail = async (email, name = "Admin") => {

    try {

        const sendSmtpEmail = {

            sender: {
                email: "chaamnotesapp@gmail.com",
                name: "Brd Team"
            },

            to: [
                {
                    email: email,
                    name: name
                }
            ],

            subject: "🛡️ Welcome to Brd Admin Panel",

            htmlContent: `
<div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);">

<tr>
<td style="background:#111827;padding:40px;text-align:center;">

<h1 style="margin:0;color:#ffffff;font-size:34px;">
🛡️ Brd Admin
</h1>

<p style="margin-top:12px;color:#d1d5db;font-size:18px;">
Administrator Access Granted
</p>

</td>
</tr>

<tr>
<td style="padding:40px;">

<h2 style="margin-top:0;color:#111827;">
Hello ${name},
</h2>

<p style="font-size:16px;line-height:28px;color:#4b5563;">

Congratulations! Your <strong>Brd Administrator</strong> account has been successfully created.

</p>

<p style="font-size:16px;line-height:28px;color:#4b5563;">

As an administrator, you'll help keep Brd organized, secure, and enjoyable for everyone in the community.

</p>

<h3 style="color:#111827;margin-top:35px;">
Your responsibilities include:
</h3>

<table cellpadding="8" cellspacing="0" width="100%">

<tr>
<td>👥</td>
<td style="color:#4b5563;">
Manage user accounts.
</td>
</tr>

<tr>
<td>📷</td>
<td style="color:#4b5563;">
Review and manage bird photography posts.
</td>
</tr>

<tr>
<td>🦜</td>
<td style="color:#4b5563;">
Maintain accurate bird information.
</td>
</tr>

<tr>
<td>🚫</td>
<td style="color:#4b5563;">
Remove inappropriate or spam content.
</td>
</tr>

<tr>
<td>🛠️</td>
<td style="color:#4b5563;">
Help maintain a safe and friendly community.
</td>
</tr>

</table>

<div style="margin-top:35px;padding:20px;background:#f9fafb;border-left:5px solid #111827;border-radius:8px;">

<strong style="color:#111827;">
Security Reminder
</strong>

<p style="margin-top:10px;color:#4b5563;line-height:26px;">

Please keep your login credentials secure. Never share your administrator account or password with anyone.

</p>

</div>

<p style="margin-top:35px;font-size:16px;color:#4b5563;">

Thank you for helping us build a trusted platform for bird enthusiasts and photographers.

</p>

<p style="font-size:16px;color:#111827;font-weight:bold;">
Welcome to the Brd Administration Team!
</p>

<p style="margin-top:30px;color:#6b7280;">
— Team Brd
</p>

</td>
</tr>

<tr>
<td style="background:#f3f4f6;padding:25px;text-align:center;font-size:13px;color:#6b7280;">

This email confirms your Brd administrator account.

<br><br>

© 2026 Brd. All rights reserved.

</td>
</tr>

</table>

</td>
</tr>
</table>

</div>
`
        };

        await apiInstance.sendTransacEmail(sendSmtpEmail);

        console.log("ADMIN WELCOME EMAIL SENT");

    } catch (err) {

        console.log("ADMIN WELCOME EMAIL FAILED");
        console.log(err.response?.body || err);

    }

};

const sendWelcomeEmail = async (email, name = "Bird Lover") => {

    try {

        const sendSmtpEmail = {

            sender: {
                email: "chaamnotesapp@gmail.com",
                name: "Brd Team"
            },

            to: [
                {
                    email: email,
                    name: name
                }
            ],

            subject: "🐦 Welcome to Brd - Your Bird Journey Begins!",

            htmlContent: `
<div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
            <td align="center">

                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);">

                    <!-- Header -->
                    <tr>
                        <td style="background:#2563eb;padding:40px;text-align:center;">

                            <h1 style="margin:0;color:white;font-size:34px;">
                                🐦 Brd
                            </h1>

                            <p style="margin-top:12px;color:white;font-size:18px;">
                                Welcome to the Brd Community
                            </p>

                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:40px;">

                            <h2 style="margin-top:0;color:#111827;">
                                Hi ${name},
                            </h2>

                            <p style="font-size:16px;line-height:28px;color:#4b5563;">

                                Thank you for signing up for <strong>Brd</strong>.

                                Your account has been created successfully, and we're excited to have you join our growing community of bird lovers and photographers.

                            </p>

                            <p style="font-size:16px;line-height:28px;color:#4b5563;">

                                Brd is a place where you can explore amazing bird photography, learn about different bird species, and connect with creators who share their passion for wildlife.

                            </p>

                            <h3 style="color:#2563eb;margin-top:35px;">
                                Here's what you can do:
                            </h3>

                            <table cellpadding="8" cellspacing="0" width="100%">
                                <tr>
                                    <td>🦜</td>
                                    <td style="color:#4b5563;">Explore stunning bird photographs.</td>
                                </tr>

                                <tr>
                                    <td>📖</td>
                                    <td style="color:#4b5563;">Learn interesting facts about bird species.</td>
                                </tr>

                                <tr>
                                    <td>❤️</td>
                                    <td style="color:#4b5563;">Save your favorite birds and photos.</td>
                                </tr>

                                <tr>
                                    <td>🌍</td>
                                    <td style="color:#4b5563;">Discover birds from around the world.</td>
                                </tr>

                                <tr>
                                    <td>📷</td>
                                    <td style="color:#4b5563;">Follow talented wildlife photographers.</td>
                                </tr>
                            </table>

                            <div style="margin-top:35px;padding:20px;background:#eff6ff;border-left:5px solid #2563eb;border-radius:8px;">

                                <strong style="color:#111827;">
                                    Every bird has a story.
                                </strong>

                                <p style="margin-top:10px;color:#4b5563;line-height:26px;">

                                    Start exploring beautiful bird photography and discover the fascinating world of birds today.

                                </p>

                            </div>

                            <p style="margin-top:40px;font-size:16px;color:#4b5563;">

                                Thank you for choosing Brd.

                            </p>

                            <p style="font-size:16px;color:#111827;font-weight:bold;">
                                Happy Birding! 🐦
                            </p>

                            <p style="margin-top:30px;color:#6b7280;">
                                — Team Brd
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#f3f4f6;padding:25px;text-align:center;font-size:13px;color:#6b7280;">

                            This email was sent because you created a Brd account.

                            <br><br>

                            © 2026 Brd. All rights reserved.

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</div>
`
        };

        await apiInstance.sendTransacEmail(sendSmtpEmail);

        console.log("WELCOME EMAIL SENT");

    } catch (err) {

        console.log("WELCOME EMAIL FAILED");

        console.log(err.response?.body || err);

    }

};


module.exports={
        admin:sendAdminWelcomeEmail,
        otp:sendOTP,
        user:sendWelcomeEmail
};