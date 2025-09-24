import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.WS_SECRET || "123123";

export default JWT_SECRET;
