import express from "express";
import { CartManager } from "../CartManager.js";

export const cartRouter = express.Router();

cartRouter.use(express.json());
cartRouter.use(express.urlencoded({ extended: true }));

const cartManager = new CartManager("cart.json");

cartRouter.post("/", (req, res) => {
  const products = req.body;

  const createCart = cartManager.addCart();
  if (createCart) {
    return res.status(201).json({
      msg: "Carrito creado ",
      data: {},
    });
  } else {
    return res.status(400).json({
      msg: "No se pudo crear el carrito",
      data: {},
    });
  }
});

cartRouter.get("/:cid", (req, res) => {
  const id = req.params.cid;

  const productsCart = cartManager.getCartProducts(parseInt(id));
  if (productsCart) {
    return res.status(200).json({
      msg: "productos del carrito " + id,
      data: { productsCart },
    });
  } else {
    return res.status(400).json({
      msg: "No se pudo traer los productos del carrito " + id,
      data: {},
    });
  }
});

cartRouter.post("/:cid/product/:pid", (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  const addProductToCart = cartManager.addProductToCart(
    parseInt(cartId),
    parseInt(productId)
  );
  if (addProductToCart) {
    return res.status(201).json({
      msg: "Producto agregado al carrito",
      data: {},
    });
  } else {
    return res.status(400).json({
      msg: "No se pudo agregar el producto al carrito",
      data: {},
    });
  }
});
