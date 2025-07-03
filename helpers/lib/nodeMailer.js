const nodemailer = require('nodemailer');

// Nodemailer transporter setup (this example uses Gmail, but you can use any service)
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'kishancoc99@gmail.com',
//         pass: 'cqoyuomiedunartc',
//     },
// });

// Email configuration
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', // or your preferred email service
        auth: {
            user: 'kishancoc99@gmail.com',
            pass: 'cqoyuomiedunartc',
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
        <title>Credential Ready</title>
      </head>
      <body style="margin:0; padding:0; font-family:Segoe UI, Tahoma, Geneva, Verdana, sans-serif; background-color:#f5f5f5; color:#333;">
        <div style="max-width:600px; margin:20px auto; background:#fff; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.1); overflow:hidden;">
          
          <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; padding:30px 20px; text-align:center;">
            <div style="width:60px; height:60px; background:rgba(255,255,255,0.2); border-radius:50%; margin:0 auto 20px; display:flex; align-items:center; justify-content:center; font-size:24px;">📜</div>
            <h1 style="font-size:28px; margin-bottom:8px;">Your Credential Ready!</h1>
            <p style="font-size:16px; opacity:0.9;">Your credential has been generated</p>
          </div>
    
          <div style="padding:40px 30px;">
            <div style="font-size:18px; color:#2c3e50; margin-bottom:20px; font-weight:500;">
              Dear ${name},
            </div>
    
            <div style="font-size:16px; color:#555; margin-bottom:25px; line-height:1.7;">
              Congratulations! Your credential has been successfully generated and is now available for viewing and download through our Swaminarayan University portal.
            </div>
    
            <div style="background:#f8f9fa; border-left:4px solid #667eea; padding:20px; margin:25px 0; border-radius:0 8px 8px 0;">
              <div style="margin-bottom:10px;">
                <strong style="display:inline-block; min-width:140px; color:#2c3e50; font-size:14px;">Student Name:</strong>
                <span style="color:#555; font-size:14px;">${name}</span>
              </div>
              <div style="margin-bottom:10px;">
                <strong style="display:inline-block; min-width:140px; color:#2c3e50; font-size:14px;">Enrollment Number:</strong>
                <span style="color:#555; font-size:14px;">${enrollmentNumber}</span>
              </div>
              <div>
                <strong style="display:inline-block; min-width:140px; color:#2c3e50; font-size:14px;">Credential Status:</strong>
                <span style="color:#555; font-size:14px;">✅ Credential Created Successfuly!</span>
              </div>
            </div>
    
            <div style="text-align:center; margin:35px 0;">
              <a href=${certificateLink} style="display:inline-block; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; text-decoration:none; padding:16px 32px; border-radius:50px; font-weight:600; font-size:16px; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 4px 15px rgba(102,126,234,0.4);">
                View My Credential
              </a>
            </div>
    
            <div style="background:#e8f4fd; border:1px solid #b3d9f7; border-radius:8px; padding:20px; margin:25px 0;">
              <h3 style="color:#1565c0; font-size:16px; margin-bottom:12px;">📋 Next Steps:</h3>
              <ul style="color:#37474f; padding-left:20px; font-size:14px;">
                <li style="margin-bottom:8px;">Click the button above to access your credential</li>
                <li style="margin-bottom:8px;">View and Store your credential Link</li>
                <li style="margin-bottom:8px;">Keep a digital copy for your records</li>
                <li style="margin-bottom:8px;">Contact support if you encounter any issues</li>
              </ul>
            </div>
    
            <div style="height:2px; background:linear-gradient(90deg, transparent, #667eea, transparent); margin:30px 0;"></div>
    
            <div style="font-size:15px; color:#555;">
              <strong>Important:</strong> This link will remain active for your access. Please ensure you Store Link. If you have any questions or need assistance, don't hesitate to contact our support team.
            </div>
          </div>
    
          <div style="background:#2c3e50; color:#ecf0f1; padding:25px 30px; text-align:center;">
            <p style="font-size:14px; margin-bottom:8px;"><strong>Swaminarayan University Academic Office</strong></p>
            <p style="font-size:13px; opacity:0.8; color:#ecf0f1;">
              📧 support@swaminarayanuniversity.edu | 📞 +91 63576 75561/2/3<br/>
              🌐 https://www.swaminarayanuniversity.ac.in | 📍 Swaminarayan University Campus, Gujarat
            </p>
          </div>
        </div>
      </body>
    </html>
    `;
};

// Main function to send certificate notification email
const sendMail = async (
    name,
    emailId,
    enrollmentNumber,
    baseUrl = 'http://192.168.1.24:5173',
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
