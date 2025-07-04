const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASSWORD, BASE_URL } = require('../../config/config');

// Email configuration
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', // or your preferred email service
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD,
        },
        // Alternative configuration for custom SMTP
        /*
    host: 'your-smtp-host.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
    */
    });
};

// HTML template for the email
const createEmailTemplate = (name, enrollmentNumber, certificateLink) => {
    return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Credential Ready</title>
      <!--[if mso]>
      <style>
        table, td, th {border-collapse: collapse;}
        .outlook-font {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin:0; padding:0; font-family:Arial, Helvetica, sans-serif; background-color:#f5f5f5; color:#333;">
      <center>
        <!--[if mso]>
        <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
        <tr>
        <td>
        <![endif]-->
        <table role="presentation" style="max-width:600px; width:100%; margin:20px auto; background:#ffffff; border-collapse:collapse;">
          <!-- Header Section -->
          <tr>
            <td style="background-color:#6A5ACD; color:#ffffff; padding:30px 20px; text-align:center;">
              <p style="font-size:24px; margin:0 0 20px 0;">📜</p>
              <h1 class="outlook-font" style="font-size:28px; margin:0 0 8px 0; font-family:Arial, Helvetica, sans-serif; color:#ffffff;">Your Credential is Ready!</h1>
              <p class="outlook-font" style="font-size:16px; margin:0; opacity:0.9; font-family:Arial, Helvetica, sans-serif; color:#ffffff;">Your credential has been generated</p>
            </td>
          </tr>
 
          <!-- Body Section -->
          <tr>
            <td style="padding:40px 30px;">
              <table role="presentation" style="width:100%; border-collapse:collapse;">
                <tr>
                  <td>
                    <p class="outlook-font" style="font-size:18px; color:#2c3e50; margin:0 0 20px 0; font-weight:500;">
                      Dear ${name},
                    </p>
                    <p class="outlook-font" style="font-size:16px; color:#555; margin:0 0 25px 0; line-height:1.7;">
                      Congratulations! Your credential has been successfully generated and is now available for viewing and download through our Swaminarayan University portal.
                    </p>
                  </td>
                </tr>
 
                <!-- Details Section -->
                <tr>
                  <td style="background-color:#f8f9fa; border-left:4px solid #6A5ACD; padding:20px; margin:25px 0;">
                     <table role="presentation" style="width:100%; border-collapse:collapse;">
                        <tr>
                           <td style="padding-bottom:10px;">
                              <strong class="outlook-font" style="display:inline-block; min-width:140px; color:#2c3e50; font-size:14px;">Student Name:</strong>
                              <span class="outlook-font" style="color:#555; font-size:14px;">${name}</span>
                           </td>
                        </tr>
                        <tr>
                           <td style="padding-bottom:10px;">
                              <strong class="outlook-font" style="display:inline-block; min-width:140px; color:#2c3e50; font-size:14px;">Enrollment Number:</strong>
                              <span class="outlook-font" style="color:#555; font-size:14px;">${enrollmentNumber}</span>
                           </td>
                        </tr>
                        <tr>
                           <td>
                              <strong class="outlook-font" style="display:inline-block; min-width:140px; color:#2c3e50; font-size:14px;">Credential Status:</strong>
                              <span class="outlook-font" style="color:#555; font-size:14px;">✅ Credential Created Successfully!</span>
                           </td>
                        </tr>
                     </table>
                  </td>
                </tr>
 
                <!-- Button Section -->
                <tr>
                  <td style="padding:35px 0; text-align:center;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse; margin:auto;">
                      <tr>
                        <td align="center" style="background-color:#6A5ACD; padding:16px 32px;">
                          <a href="${certificateLink}" target="_blank" style="color:#ffffff; text-decoration:none; font-weight:600; font-size:16px; text-transform:uppercase; letter-spacing:0.5px; font-family:Arial, Helvetica, sans-serif; display:inline-block;">
                            View My Credential
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
 
                <!-- Next Steps Section -->
                <tr>
                  <td style="background-color:#e8f4fd; border:1px solid #b3d9f7; padding:20px; margin:25px 0;">
                    <h3 class="outlook-font" style="color:#1565c0; font-size:16px; margin:0 0 12px 0;">📋 Next Steps:</h3>
                    <ul style="color:#37474f; padding-left:20px; font-size:14px; margin:0;">
                      <li style="margin-bottom:8px;">Click the button above to access your credential</li>
                      <li style="margin-bottom:8px;">View and Store your credential Link</li>
                      <li style="margin-bottom:8px;">Keep a digital copy for your records</li>
                      <li style="margin-bottom:8px;">Contact support if you encounter any issues</li>
                    </ul>
                  </td>
                </tr>
 
                <!-- Separator -->
                <tr>
                  <td style="padding:30px 0;">
                    <div style="height:2px; background-color:#eeeeee;"></div>
                  </td>
                </tr>
 
                <!-- Important Notice -->
                <tr>
                  <td>
                    <p class="outlook-font" style="font-size:15px; color:#555; margin:0;">
                      <strong>Important:</strong> This link will remain active for your access. Please ensure you Store Link. If you have any questions or need assistance, don't hesitate to contact our support team.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
          <!-- Footer Section -->
          <tr>
            <td style="background-color:#2c3e50; color:#ecf0f1; padding:25px 30px; text-align:center;">
              <p class="outlook-font" style="font-size:14px; margin:0 0 8px 0;"><strong>Swaminarayan University Academic Office</strong></p>
              <p class="outlook-font" style="font-size:13px; opacity:0.8; color:#ecf0f1; margin:0;">
                📧 support@swaminarayanuniversity.edu | 📞 +91 63576 75561/2/3
              </p>
              <p class="outlook-font" style="font-size:13px; opacity:0.8; color:#ecf0f1; margin:0;">
                🌐 https://www.swaminarayanuniversity.ac.in | 📍 Swaminarayan University Campus, Gujarat
              </p>
            </td>
          </tr>
        </table>
        <!--[if mso]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </center>
    </body>
  </html>`;
};

// Main function to send certificate notification email
const sendMail = async (
    name,
    emailId,
    enrollmentNumber,
    baseUrl = BASE_URL,
) => {
    try {
        // Create the certificate link
        const certificateLink = `${baseUrl}/University/dashboard/viewCertificates/${enrollmentNumber}`;

        // Create transporter
        const transporter = createTransporter();

        // Email options
        const mailOptions = {
            from: {
                name: 'Swaminarayan university Academic Office',
                address: process.env.EMAIL_USER,
            },
            to: emailId,
            subject: `🎓 Your Degree Certificate is Ready - Enrollment: ${enrollmentNumber}`,
            html: createEmailTemplate(name, enrollmentNumber, certificateLink),
            // Text version for email clients that don't support HTML
            text: `
        Dear ${name},
        
        Congratulations! Your degree certificate has been successfully generated and is now available.
        
        Student Details:
        - Name: ${name}
        - Enrollment Number: ${enrollmentNumber}
        
        Please visit the following link to view and download your certificate:
        ${certificateLink}
        
        If you have any questions, please contact our support team.
        
        Best regards,
        Swaminarayan university Academic Office
      `,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Certificate notification sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        console.log('👤 Recipient:', emailId);
        console.log('🔗 Certificate Link:', certificateLink);

        return {
            success: true,
            messageId: info.messageId,
            recipient: emailId,
            certificateLink: certificateLink,
            message: 'Certificate notification sent successfully!',
        };
    } catch (error) {
        console.error('❌ Error sending certificate notification:', error);

        return {
            success: false,
            error: error.message,
            message: 'Failed to send certificate notification',
        };
    }
};

// Export function
module.exports = {
    sendMail,
};

// Example usage:
/*
const { sendMail } = require('./nodeMailer');

// Send certificate notification
const result = await sendMail(
  'John Doe',
  'john.doe@student.university.edu', 
  '20250001024'
);

console.log(result);
*/
