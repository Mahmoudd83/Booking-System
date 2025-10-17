const cron = require("node-cron");
const Appointments = require("../models/appointmentsModel"); 
const { sendEmail } = require("./SendMail");
const { sendSMS } = require("./SendSMS");

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const upcomingAppointments = await Appointments.find({
      startTime: { $gte: now, $lte: oneHourLater },
      status: "confirmed",
    }).populate("userId providerId serviceId");

    for (const appointment of upcomingAppointments) {
      const userName = appointment.userId?.name || "Client";
      const providerName = appointment.providerId?.name || "Provider";
      const serviceTitle = appointment.serviceId?.title || "Service";
      const appointmentTime = new Date(appointment.startTime).toLocaleString();

      const emailSubject = "Appointment Reminder ";
      const emailBody = `
        <h3>Hello ${userName},</h3>
        <p>This is a friendly reminder that you have an appointment for <b>${serviceTitle}</b> with <b>${providerName}</b>.</p>
        <p> Time: ${appointmentTime}</p>
        <p>We look forward to seeing you!</p>
      `;

      const smsBody = `Reminder: Your ${serviceTitle} with ${providerName} is in 1 hour (${appointmentTime}).`;

      await sendEmail(appointment.userId.email, emailSubject, emailBody);
      await sendSMS(appointment.userId.phone, smsBody);

    }
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
});
