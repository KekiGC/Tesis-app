"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./middlewares/passport"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const special_routes_1 = __importDefault(require("./routes/special.routes"));
const patient_routes_1 = __importDefault(require("./routes/patient.routes"));
const medicalRecord_routes_1 = __importDefault(require("./routes/medicalRecord.routes"));
const appointment_routes_1 = __importDefault(require("./routes/appointment.routes"));
//import pdfroutes from "./routes/pdf.routes";
const medicalRest_routes_1 = __importDefault(require("./routes/medicalRest.routes"));
const invoice_routes_1 = __importDefault(require("./routes/invoice.routes"));
//inicio
const app = (0, express_1.default)();
dotenv_1.default.config();
//configuraciones
app.set("port", process.env.PORT || 3000);
//middlewares
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
passport_1.default.use(passport_2.default);
//routes
app.get("/", (req, res) => {
    res.send(` THE API  is at http://localhost:${app.get("port")}`);
});
app.use(auth_routes_1.default);
app.use(special_routes_1.default);
app.use(patient_routes_1.default);
app.use(medicalRecord_routes_1.default);
app.use(appointment_routes_1.default);
//app.use(pdfroutes);
app.use(medicalRest_routes_1.default);
app.use(invoice_routes_1.default);
exports.default = app;
