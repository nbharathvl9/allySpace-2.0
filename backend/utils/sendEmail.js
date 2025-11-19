const nodemailer = require("nodemailer");

// Updated to be more flexible, accepting subject and html content
const sendEmail = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: html,
  });
};

// New helper function for task reminders
const sendTaskReminder = async (recipientEmail, taskTitle, deadline) => {
    // Format the deadline for the email body
    const deadlineStr = new Date(deadline).toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    const subject = `⏰ TASK REMINDER: ${taskTitle} is due soon!`;
    const html = `
      <h3>Task Deadline Approaching!</h3>
      <p>This is a reminder for your assigned task:</p>
      <ul>
        <li><strong>Task:</strong> ${taskTitle}</li>
        <li><strong>Deadline:</strong> <b style="color: #f59e0b;">${deadlineStr}</b></li>
      </ul>
      <p>Please ensure you complete the task on time.</p>
    `;
    
    await sendEmail(recipientEmail, subject, html);
};

// Exporting both
module.exports = {
    sendEmail, 
    sendTaskReminder
};