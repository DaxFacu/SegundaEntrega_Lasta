import express from "express";
import { ProductManager } from "../ProductManager.js";

const productManager = new ProductManager("Products.json");

export const viewsRouter = express.Router();

viewsRouter.use(express.json());
viewsRouter.use(express.urlencoded({ extended: true }));

viewsRouter.get("/", (req, res) => {
  let products = productManager.getProducts();
  res.render("home", { products });
});

viewsRouter.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {});
});
