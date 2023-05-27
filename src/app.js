import express from "express";
import handlebars from "express-handlebars";
import { ProductManager } from "./ProductManager.js";
import { CartManager } from "./CartManager.js";
import { productManagerRouter } from "./routes/products.router.js";
import { cartRouter } from "./routes/cart.router.js";
import { viewsRouter } from "./routes/views.router.js";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";

const app = express();
const port = 8080;
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("Products.json");

app.use("/api/products", productManagerRouter);

app.use("/api/carts", cartRouter);

const httpServer = app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});

export const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

socketServer.on("connection", (socket) => {
  console.log("Cliente conectado");
  const products = productManager.getProducts();
  socket.emit("realtimeproducts", products);
});

app.use("/", viewsRouter);
app.use("/realtimeproducts", viewsRouter);

app.get("*", (req, res) => {
  res.status(404).send({ status: "error", data: "Página no encontrada" });
});
