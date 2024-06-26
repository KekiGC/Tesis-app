import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import passportMiddleware from "./middlewares/passport";
import authRoutes from "./routes/auth.routes";
import specialRoutes from "./routes/special.routes";
import patientRoutes from "./routes/patient.routes";
import medicalRecordRoutes from "./routes/medicalRecord.routes";
import appointmentRoutes from "./routes/appointment.routes";
//import pdfroutes from "./routes/pdf.routes";
import medicalRestRoutes from './routes/medicalRest.routes';
import invoiceRoutes from "./routes/invoice.routes";

//inicio
const app = express();
dotenv.config();

//configuraciones
app.set("port", process.env.PORT || 3000);

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
app.use(patientRoutes);
app.use(medicalRecordRoutes);
app.use(appointmentRoutes);
//app.use(pdfroutes);
app.use(medicalRestRoutes);
app.use(invoiceRoutes);

export default app;
