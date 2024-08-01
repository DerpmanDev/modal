import express from "express";
import http from "node:http";
import path from "node:path";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { createBareServer } from '@tomphttp/bare-server-node';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import wisp from "wisp-server-node";

const __dirname = path.resolve();
const server = http.createServer();
const bareServer = createBareServer('/bare/');
const app = express();
const port = 5002;

app.use("/uv-v1/", express.static(uvPath));
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
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else app(req, res);
});
server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else if (req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else socket.end();
});


server.on("listening", () => {
  console.log(`Modal is running on port ${port}\n\nhttp://localhost:${port}`);
});

process.on("SIGINT", close);
process.on("SIGTERM", close);

function close() {
  console.log("Caught SIGTERM, shutting down");
  server.close();
  process.exit(0);
}

server.listen({
  port: port,
});
