import nodemailer from 'nodemailer';

const sendWelcomeEmail = async (email: string, password: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bupinder209@gmail.com',
      pass:"outoxrjnzukrpsan",
    },
  });

  const mailOptions = {
    from: 'bupinder209@gmail.com',
    to: email,
    subject: 'Welcome!',
    text: `Thank you for registering. Your login details are:\nEmail: ${email}\nPassword: ${password}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export { sendWelcomeEmail };
