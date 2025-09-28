import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.WS_SECRET;

export default JWT_SECRET;
