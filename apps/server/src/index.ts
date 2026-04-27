import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    app: "ForwardToTheVoid",
    timestamp: new Date().toISOString()
  });
});

const webBuildPath = path.resolve(__dirname, "../../web/build/client");
app.use(express.static(webBuildPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(webBuildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
