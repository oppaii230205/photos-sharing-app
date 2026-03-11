import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { env } from "./config";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
