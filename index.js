import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import cron from "node-cron";
import moment from "moment-timezone";
const SERVER_TIMEZONE = "Asia/Kolkata"; // Change this to match your server's timezone

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://localhost:3000/"],
//     methods: "GET, POST",
//   })
// ); // Allow frontend

// User List
const userlist = [
  { id: 1, name: "Jay", email: "jay@gmail.com", IDofcategoryList: 4 },
  {
    id: 2,
    name: "Tirth",
    email: "chhabhaiyatirth17@gmail.com",
    IDofcategoryList: 1,
  },
  { id: 3, name: "Priya", email: "priya@yahoo.com", IDofcategoryList: 2 },
  { id: 4, name: "Amit", email: "amit@hotmail.com", IDofcategoryList: 3 },
  { id: 5, name: "Sneha", email: "sneha@gmail.com", IDofcategoryList: 4 },
  { id: 6, name: "Vikram", email: "vikram@outlook.com", IDofcategoryList: 1 },
  { id: 7, name: "Neha", email: "neha@gmail.com", IDofcategoryList: 2 },
  { id: 8, name: "Suresh", email: "suresh@yahoo.com", IDofcategoryList: 3 },
  { id: 9, name: "Anjali", email: "anjali@gmail.com", IDofcategoryList: 4 },
  {
    id: 10,
    name: "Tapasvi",
    email: "thchhabhaiya@gmail.com",
    IDofcategoryList: 5,
  },
  {
    id: 11,
    name: "Tapasvi (Parul University)",
    email: "210303105707@paruluniversity.ac.in",
    IDofcategoryList: 5,
  },
];

// Category List
const categorylist = [
  { categoryID: 1, categoryName: "New Joinees" },
  { categoryID: 2, categoryName: "HR Department" },
  { categoryID: 3, categoryName: "Marketing Team" },
  { categoryID: 4, categoryName: "Interns & Trainees" },
  { categoryID: 5, categoryName: "Executive Leadership" },
];

// Schedule Mail List
let scheduleMail = [
  {
    scheduleMailID: 1,
    template: "Salary Increment Letter",
    schedule: "2027-02-9T13:25:00Z",
    recipientGroupName: "Marketing Team",
    recipient: ["thchhabhaiya@gmail.com"],
    status: "Pending",
  },
];
// let scheduleMail = [];

// Template List
const template_List = [
  { template_id: 1, template_name: "New Offer Letter" },
  { template_id: 2, template_name: "Company Event Invitation" },
  { template_id: 3, template_name: "Employee Promotion Notice" },
  { template_id: 4, template_name: "Salary Increment Letter" },
  { template_id: 5, template_name: "Termination Letter" },
];

function sendEmail(recipient, scheduleDate, template) {
  return new Promise(async (resolve, reject) => {
    try {
      let htmlContent = "";
      const username = categorylist.find(
        (user) => user.email === recipient
      )?.name;

      switch (template) {
        case "New Offer Letter":
          htmlContent = `<b>Congratulations, Patron!</b><br>
We are pleased to offer you a position at our company. Your new role starts soon. <br>
Welcome aboard!
<br><br>
This email was sent on ${scheduleDate}.
`;
          break;
        case "Company Event Invitation":
          htmlContent = `<b>Dear Patron,</b><br>
You're invited to our upcoming company event! <br>
We look forward to seeing you there. Don't miss out!
<br><br>
This email was sent on ${scheduleDate}.
`;
          break;
        case "Salary Increment Letter":
          htmlContent = `<b>Dear Patron,</b><br>
We are pleased to inform you that your salary has been incremented. Congratulations on your continued contributions to the company!
<br><br>
This email was sent on ${scheduleDate}.
`;
          break;
        case "Termination Letter":
          htmlContent = `<b>Dear Patron,</b><br>
We regret to inform you that your employment with the company has been terminated, effective immediately. We wish you the best in your future endeavors.
<br><br>
This email was sent on ${scheduleDate}.
`;
          break;
        case "Employee Promotion Notice":
          htmlContent = `<b>Dear Patron,</b><br>
Congratulations! We are pleased to inform you that you have been promoted to [new position]. Your hard work and dedication have been truly appreciated.
<br><br>
This email was sent on ${scheduleDate}.
`;
          break;
        default:
          htmlContent = "<b>Dear user, your letter is being processed.</b>";
      }
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "regionalnewsapp2025@gmail.com",
          pass: "tcxyzmiolvtxcwqi",
        },
      });

      const info = await transporter.sendMail({
        from: "regionalnewsapp2025@gmail.com",
        to: recipient,
        subject: `${template} from Virat Infra Pvt. Ltd.`,
        text: "Hello world?",
        html: htmlContent,
      });

      console.log("Message sent: %s", info.messageId);
      resolve({ message: "EMAIL SENT SUCCESSFULLY" });
    } catch (error) {
      console.error("Email send error:", error);
      reject({ message: "EMAIL FAILED TO SEND" });
    }
  });
}

// Run Task Every Minute** to Check and Send Scheduled Emails
cron.schedule("* * * * *", async () => {
  console.log("⏳ Checking for scheduled emails...");

  const now = moment().utc(); // Current time in UTC
  console.log(" 🖥️ Server Time (UTC):", now.format());

  for (let i = 0; i < scheduleMail.length; i++) {
    let { schedule, recipient, template, scheduleMailID, status } =
      scheduleMail[i];

    // Convert stored schedule time to UTC for comparison
    let scheduleDate = moment(schedule).utc();

    console.log(
      `⏰ ScheduleMail count : ${
        scheduleMail.length
      } AND Schedule Time (UTC):  ${scheduleDate.format()}`
    );

    if (status === "Pending" && scheduleDate.isSameOrBefore(now)) {
      console.log(
        `🚀 Sending scheduled email: ${template} at ${scheduleDate.format()}`
      );

      for (let email of recipient) {
        try {
          await sendEmail(email, scheduleDate.format(), template);
          scheduleMail[i].status = "Sent";
        } catch (error) {
          console.error("Failed to send email:", error);
        }
      }
    }
  }
});

//  Route 1: Get all data (Users, Categories, Scheduled Mails)
app.get("/api/data", (req, res) => {
  res.json({ userlist, categorylist, scheduleMail });
});

//  Route 2: Get Template List
app.get("/api/templates", (req, res) => {
  res.json(template_List);
});

//  Route 3: Get ScheduleMail List
app.get("/api/scheduleMail", (req, res) => {
  res.json(scheduleMail); // Send the scheduleMail list in the response
});

// Route 4: Get Categorylist List
app.get("/api/categorylist", (req, res) => {
  res.json(categorylist);
});

//  Route 5: Get Userlist List
app.get("/api/userlist", (req, res) => {
  res.json(userlist);
});

// app.get("/api/sendemail", (req, res) => {
//   sendEmail()
//     .then((response) => res.send(response.message))
//     .catch((error) => res.status(500).send(error.message));
// });

//  Route 6: Add New Scheduled Mail
app.post("/api/scheduleMail", (req, res) => {
  const { template, schedule, recipient, recipientGroupName } = req.body;
  if (!template || !schedule || !recipient || !recipientGroupName) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  // Convert schedule to UTC before storing
  let scheduleUTC = moment(schedule).utc().format();

  const newSchedule = {
    scheduleMailID: Date.now(),
    template,
    schedule: scheduleUTC,
    recipient,
    recipientGroupName,
    status: "Pending",
  };

  scheduleMail.push(newSchedule);

  res
    .status(201)
    .json({ message: "Email sent and scheduled successfully", newSchedule });
});

//  Route 10: Add New User
app.post("/api/userlist", (req, res) => {
  const { name, email, IDofcategoryList } = req.body;
  if (!name || !email || !IDofcategoryList) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    IDofcategoryList,
  };

  userlist.push(newUser);
  res.status(201).json({ message: "New user add successfully", newUser });
});

//  Route 11: Delete User
app.post("/delete/user", (req, res) => {
  const { id } = req.body;
  const index = userlist.findIndex((item) => item.id === id);

  if (index !== -1) {
    userlist.splice(index, 1);
    res.status(200).json({ message: "User deleted successfully." });
  } else {
    res.status(404).json({ error: "User not found." });
  }
});
//  Route 7: Delete Scheduled Mail
app.post("/delete/scheduleMail", (req, res) => {
  const { scheduleMailID } = req.body;
  const index = scheduleMail.findIndex(
    (item) => item.scheduleMailID === scheduleMailID
  );

  if (index !== -1) {
    scheduleMail.splice(index, 1);
    res.status(200).json({ message: "Scheduled mail deleted successfully." });
  } else {
    res.status(404).json({ error: "Scheduled mail not found." });
  }
});

//  Route 8:  get a specific scheduled mail by ID

app.get("/api/scheduleMail/:id", (req, res) => {
  const { id } = req.params;
  const scheduledMail = scheduleMail.find((mail) => mail.scheduleMailID == id);

  if (!scheduledMail) {
    return res.status(404).json({ error: "Scheduled mail not found" });
  }

  res.json(scheduledMail);
});

//  Route 9: To update scheduled mail

app.put("/api/scheduleMail/:id", (req, res) => {
  const { id } = req.params;
  const { template, schedule, recipient, recipientGroupName } = req.body;
  console.log(recipient);
  const mailIndex = scheduleMail.findIndex((mail) => mail.scheduleMailID == id);

  if (mailIndex === -1) {
    return res.status(404).json({ error: "Scheduled mail not found" });
  }

  // Update only the fields that are provided
  if (template) scheduleMail[mailIndex].template = template;
  if (schedule) scheduleMail[mailIndex].schedule = schedule;
  if (recipient) scheduleMail[mailIndex].recipient = recipient;
  if (recipientGroupName)
    scheduleMail[mailIndex].recipientGroupName = recipientGroupName;

  res.status(200).json({
    message: "Scheduled mail updated successfully",
    updatedMail: scheduleMail[mailIndex],
  });
});

//  Start Server
const PORT = 3012;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
