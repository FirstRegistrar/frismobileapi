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
    socketTimeout: 60000,     // 60 seconds
    logger: true,             // Enable debug logging
    debug: true               // Include connection details
});

const submitShareholdersForm = async (req, res) => {
    const {
        surname,
        firstName,
        otherNames,
        address,
        previousAddress,
        city,
        country,
        mobileTelephone1,
        mobileTelephone2,
        emailAddress,
        bvn,
        nin,
        passportNumber,
        companies,
        signature,
        companySealImage,
        userPassportImage,
        ninSlipImage
    } = req.body;

    // Validate required fields
    if (!surname || !firstName || !emailAddress) {
        return res.status(400).json({ 
            error: 'The following fields are required: surname, first name, and email address.' 
        });
    }

    try {
        // Construct email body safely
        const emailBody = `
            <h3>New Shareholder Form Submission</h3>
            <p><strong>Surname:</strong> ${surname || ''}</p>
            <p><strong>First Name:</strong> ${firstName || ''}</p>
            <p><strong>Other Names:</strong> ${otherNames || ''}</p>
            <p><strong>Address:</strong> ${address || ''}</p>
            <p><strong>Previous Address:</strong> ${previousAddress || ''}</p>
            <p><strong>City:</strong> ${city || ''}</p>
            <p><strong>Country:</strong> ${country || ''}</p>
            <p><strong>Mobile Telephone 1:</strong> ${mobileTelephone1 || ''}</p>
            <p><strong>Mobile Telephone 2:</strong> ${mobileTelephone2 || ''}</p>
            <p><strong>Email Address:</strong> ${emailAddress || ''}</p>
            <p><strong>BVN:</strong> ${bvn || ''}</p>
            <p><strong>NIN:</strong> ${nin || ''}</p>
            <p><strong>Passport Number:</strong> ${passportNumber || ''}</p>
            <p><strong>Companies:</strong> ${companies ? JSON.stringify(companies) : ''}</p>
        `;

        // Prepare attachments (only include if valid and not empty)
        const attachments = [];

        const addAttachment = (filename, contentBase64) => {
            if (contentBase64 && typeof contentBase64 === 'string' && contentBase64.trim() !== '') {
                attachments.push({
                    filename,
                    content: contentBase64,
                    encoding: 'base64'
                });
            }
        };

        addAttachment('Signature.png', signature);
        addAttachment('CompanySeal.png', companySealImage);
        addAttachment('UserPassport.png', userPassportImage);
        addAttachment('NINSlip.png', ninSlipImage);

        // Mail options
        const mailOptions = {
            from: 'info@firstregistrarsnigeria.com',
            to: 'info@firstregistrarsnigeria.com',
            cc: 'williams.abiola@itech.ng',
            subject: 'New Shareholder Form Submission',
            html: emailBody,
            attachments
        };

        // Send email
        const mailSent = await transporter.sendMail(mailOptions);

        if (mailSent) {
            return res.status(200).json({
                success: true,
                message: 'Shareholder form successfully submitted and emailed.'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'The form could not be sent. Please contact support.'
            });
        }
    } catch (error) {
        console.error('Error submitting shareholder form:', error);

        return res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request.',
            errorDetails: {
                name: error.name,
                message: error.message,
                stack: error.stack
            }
        });
    }
};

module.exports = submitShareholdersForm;
