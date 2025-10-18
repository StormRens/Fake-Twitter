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


(async () => {
    try {
        await connectDB(); 
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server due to DB error:', err);
    }
})();