const nodeMailer = require('nodemailer');
require('dotenv').config();

const transporter = nodeMailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: 'info@firstregistrarsnigeria.com',
        pass: 'Investor1'
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 60000, // 60 seconds
    socketTimeout: 60000,      // 60 seconds
    logger: true, // Enable debug logging
    debug: true    // Include connection details
});

const sendEmail = async (mail, code) => {
    const mailOptions = {
        from: 'info@firstregistrarsnigeria.com', // Avoid relying on process.env for now
        to: mail,
        cc: 'williams.abiola@itech.ng', // ✅ added CC
        subject: 'Your One Time Password (OTP)',
        text: `Your One Time Password (OTP) for First Registrars Mobile App log-in is ${code}. It expires in 20 minutes. If you did not initiate this request, kindly call our customer service. Do not share your OTP with anyone.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true }; // Email sent successfully
    } catch (error) {
        return {
            success: false,
            error: {
                message: error.message,
                stack: error.stack,
                code: error.code,
                response: error.response, // SMTP response
            },
        }; // Return detailed error info
    }
};

module.exports = { transporter, sendEmail };
