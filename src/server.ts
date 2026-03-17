import app from "./app.js";
import { env } from './config/env.js';

const PORT: number = env.getPort();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.log("Server failed to start:", err);
});