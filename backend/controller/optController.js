import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import dotenv from 'dotenv';
dotenv.config();

let otp1=null;
// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., use 'gmail', 'hotmail', etc.
  auth: {
    user: process.env.emailsend, //  your email
    pass: process.env.pass    // your email passkey
  }
});

// Send OTP to user
export const sendOtp = async (req, res) => {
  const { email } = req.body;
   otp1 = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });
//    console.log(otp1);
  
  try {
    // Send OTP email
    await transporter.sendMail({
      from: 'kushwahay535@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp1}`
    });

    res.status(200).json({
      message: 'OTP sent to email',
      success: true
    });
  } catch (error) {
    console.log("error is ",error);
    res.status(500).json({
      message: 'Failed to send OTP',
      success: false
    });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  console.log(`verify otp1 : ${otp1} and otp is ${otp}`)

  if (otp1 === otp) {
     otp1=null
    return res.status(200).json({
      message: "OTP is valid",
      success: true
    });
  } else {
    return res.status(400).json({
      message: "Invalid OTP",
      success: false
    });
  }
};



// import nodemailer from 'nodemailer';
// import otpGenerator from 'otp-generator';
// import dotenv from 'dotenv';

// dotenv.config();

// // OTP storage in memory
// const otpStore = new Map();

// // Configure Nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.emailsend,
//     pass: process.env.pass
//   }
// });

// // Send OTP
// export const sendOtp = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: "Email is required", success: false });
//   }

//   // Generate OTP
//   const otp = otpGenerator.generate(6, { 
//     upperCaseAlphabets: false, 
//     lowerCaseAlphabets: false, 
//     specialChars: false 
//   });

//   const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

//   // Store in Map
//   otpStore.set(email, { otp, otpExpiry });

//   try {
//     await transporter.sendMail({
//       from: process.env.emailsend,
//       to: email,
//       subject: 'Your OTP Code',
//       text: `Your OTP is ${otp}. It will expire in 5 minutes.`
//     });

//     res.status(200).json({ message: "OTP sent successfully", success: true });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     res.status(500).json({ message: "Failed to send OTP", success: false });
//   }
// };

// // Verify OTP
// export const verifyOtp = (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     return res.status(400).json({ message: "Email and OTP required", success: false });
//   }

//   const record = otpStore.get(email);

//   if (!record) {
//     return res.status(400).json({ message: "No OTP found, request again", success: false });
//   }

//   if (Date.now() > record.otpExpiry) {
//     otpStore.delete(email); // delete expired OTP
//     return res.status(400).json({ message: "OTP expired, request again", success: false });
//   }

//   if (record.otp !== otp) {
//     return res.status(400).json({ message: "Invalid OTP", success: false });
//   }

//   // OTP valid → delete it
//   otpStore.delete(email);

//   return res.status(200).json({ message: "OTP verified successfully", success: true });
// };
