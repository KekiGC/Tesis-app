import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import passportMiddleware from "./middlewares/passport";
import path from "path";
import cron from "node-cron";
import { sendAppointmentReminders } from "./services/appointmentReminderJob";

// Import routes
import authRoutes from "./routes/auth.routes";
import userInfoRoutes from "./routes/userInfo.routes";
import specialRoutes from "./routes/special.routes";
import patientRoutes from "./routes/patient.routes";
import medicalRecordRoutes from "./routes/medicalRecord.routes";
import appointmentRoutes from "./routes/appointment.routes";
import medicalRestRoutes from "./routes/medicalRest.routes";
import invoiceRoutes from "./routes/invoice.routes";
import aptitudeRoutes from "./routes/aptitudeProof.routes";
import companyRoutes from "./routes/company.routes";
import reportRoutes from "./routes/report.routes";
import examRoutes from "./routes/exam.routes";
import externalExamRoutes from "./routes/externalExam.routes";
import treatmentRoutes from "./routes/treatment.routes";
import medicineRoutes from "./routes/medicine.routes";
import noteRoutes from "./routes/note.routes";

//inicio
const app = express();
dotenv.config();

//configuraciones
app.set("port", process.env.PORT || 3000);

// configuracion del motor de vistas EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, '../public')));

//middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
passport.use(passportMiddleware);

//routes
app.get("/", (req, res) => {
  res.send(` THE API  is at http://localhost:${app.get("port")}`);
});

app.use(authRoutes);
app.use(specialRoutes);
app.use(userInfoRoutes);
app.use(patientRoutes);
app.use(medicalRecordRoutes);
app.use(appointmentRoutes);
app.use(medicalRestRoutes);
app.use(invoiceRoutes);
app.use(aptitudeRoutes);
app.use(companyRoutes);
app.use(reportRoutes);
app.use(examRoutes);
app.use(externalExamRoutes);
app.use(treatmentRoutes);
app.use(medicineRoutes);
app.use(noteRoutes);

cron.schedule('0 17 * * *', sendAppointmentReminders);

export default app;
