import express from "express";
import http from "node:http";
import path from "node:path";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import wisp from "wisp-server-node";


const __dirname = path.resolve();
const server = http.createServer();
const app = express();
const port = 5002;

app.use("/uv/", express.static(uvPath));
app.use("/epoxy", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));
app.use(express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./static/index.html"));
});

app.use((req, res) => {
  res.statusCode = 404;
  res.sendFile(path.join(__dirname, "./static/404.html"));
});

server.on("request", (req, res) => {
  res.setHeader("Cross-Origin-Opener-Policy", "cross-origin");
  app(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/"))
    wisp.routeRequest(req, socket, head);
  else
    socket.end();
});

server.on("listening", () => {
  console.log(`Modal is running on port ${port}\n\nhttp://localhost:${port}`);
});

server.listen({
  port: port,
});