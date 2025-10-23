import express from "express";
import cors from "cors";
import routes from "./server.routes";
import { connectDB } from "./db";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use(express.json())

// Prefixes the endpoint with /
app.use('/',routes);



// REVERT BACK WHEN MONGO IS SET UP
(async () => {
    connectDB().catch(err => {
        console.warn("Warning: couldnt connect to mongodb, endpoints will error", err);
    });

    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    })
})();