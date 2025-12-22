import { app } from "./app";

const port = process.env.PORT || 3001;
const _server = app.listen(port);

console.log(`🚀 API server running at http://localhost:${port}`);
