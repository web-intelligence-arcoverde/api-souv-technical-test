import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json";
import errorHandler from "./middlewares/error-handle";
import rateLimiterMiddleware from "./middlewares/rate-limit";
import { limiter } from "./middlewares/rate-limit-express";
import productRoutes from "./modules/product/routes";

dotenv.config();

const app = express();
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(limiter);
app.use(rateLimiterMiddleware);
app.use("/product", productRoutes);
app.use(errorHandler);

export default app;
