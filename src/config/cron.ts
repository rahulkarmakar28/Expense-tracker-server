import { CronJob } from "cron";

// import { generatePDF } from './pdf';
// import { encryptPDF } from './encrypt-pdf';
// import { sendMonthlyEmail } from './mailer';
// import { getAllUsers, getExpensesForUser } from './db';
// import fs from 'fs';

const job = new CronJob("*/10 * * * *", async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/health`);
    if (res.ok) console.log("Cron Job successfully pinged the API");
    else console.log("GET request failed", res.status);
  } catch (err) {
    console.error("Error while sending request", err);
  }
});
const sendReport = new CronJob("0 0 1 * *", async()=>{
  try {
    // monthlyReportJob()
    console.log("Monthly Expense report sended to an user")
  } catch (error) {
    console.error("Error with sending Expenses Report", error)
  }
})


// export async function monthlyReportJob() {
//   const users = await getAllUsers();

//   for (const user of users) {
//     const expenses = await getExpensesForUser(user.id); // Only previous month

//     const pdfBuffer = await generatePDF(expenses);

//     const outPath = `/tmp/${user.username}-report.pdf`;
//     encryptPDF(pdfBuffer, user.username, outPath);

//     await sendMonthlyEmail(user, outPath);

//     fs.unlinkSync(outPath); // Clean up
//   }

//   console.log('Monthly reports sent');
// }


export {job, sendReport};