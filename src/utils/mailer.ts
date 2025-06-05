// import nodemailer from 'nodemailer';
// import fs from 'fs';

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'your-email@gmail.com',
//     pass: 'app-password'
//   }
// });

// export async function sendMonthlyEmail(user: any, filePath: string) {
//   await transporter.sendMail({
//     to: user.email,
//     subject: 'Your Monthly Expense Report',
//     text: `Attached is your expense summary. Password: ${user.username}`,
//     attachments: [
//       {
//         filename: 'Monthly-Expense.pdf',
//         content: fs.createReadStream(filePath)
//       }
//     ]
//   });
// }
