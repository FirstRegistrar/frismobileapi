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
    connectionTimeout: 60000,
    socketTimeout: 60000,
    logger: true,
    debug: true
});

const submitShareholdersForm = async (req, res) => {
    try {
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

        if (!surname || !firstName || !emailAddress) {
            return res.status(400).json({
                error: 'Missing required fields: surname, firstName, and emailAddress.'
            });
        }

        // Convert companies safely if it's a stringified JSON
        let parsedCompanies = companies;
        try {
            if (typeof companies === 'string') {
                parsedCompanies = JSON.parse(companies);
            }
        } catch (err) {
            console.error('Error parsing companies field:', err);
        }

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
            <p><strong>Companies:</strong> ${JSON.stringify(parsedCompanies) || ''}</p>
        `;

        // Only include attachments with real base64 content
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

        const mailOptions = {
            from: 'info@firstregistrarsnigeria.com',
            to: 'info@firstregistrarsnigeria.com',
            cc: 'williams.abiola@itech.ng',
            subject: 'New Shareholder Form Submission',
            html: emailBody,
            attachments
        };

        console.log('Sending email with options:', {
            to: mailOptions.to,
            cc: mailOptions.cc,
            attachmentsCount: attachments.length
        });

        const mailSent = await transporter.sendMail(mailOptions);
        console.log('Mail sent response:', mailSent);

        return res.status(200).json({
            success: true,
            message: 'Shareholder form successfully submitted and emailed.'
        });

    } catch (error) {
        console.error('Full backend error:', error);

        // Return full details for debugging
        return res.status(500).json({
            success: false,
            error: error.message || 'Unknown server error',
            stack: error.stack || null
        });
    }
};

module.exports = submitShareholdersForm;
