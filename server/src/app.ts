import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import companyRoutes from "./routes/company.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import gstRoutes from "./routes/gst.routes.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "http://localhost:4800",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "../public")));

app.use("/api/companies", companyRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/gst", gstRoutes);

export default app;
