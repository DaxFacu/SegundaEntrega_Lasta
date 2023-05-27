import express from "express";
import { ProductManager } from "../ProductManager.js";
import { socketServer } from "../app.js";

export const productManagerRouter = express.Router();

productManagerRouter.use(express.json());
productManagerRouter.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("Products.json");

productManagerRouter.get("/", (req, res) => {
  const limit = req.query.limit;
  const products = productManager.getProducts();

  if (req.query && limit) {
    const productsSlice = products.slice(0, limit);

    return res.status(200).json({
      msg: "Producto/s: ",
      data: productsSlice,
    });
  } else {
    return res.status(400).json({
      msg: "Productos: ",
      data: products,
    });
  }
});

productManagerRouter.get("/:pid", (req, res) => {
  const id = req.params.pid;
  const productFindById = productManager.getProductById(parseInt(id));
  if (productFindById != undefined) {
    return res.status(200).json({
      msg: "Producto con el id ",
      data: { productFindById },
    });
  } else {
    return res.status(400).json({
      msg: "No existe el producto con el id " + id,
      data: {},
    });
  }
});

productManagerRouter.post("/", (req, res) => {
  const products = req.body;

  const addProduct = productManager.addProduct(products);
  console.log(addProduct);

  const getProducts = productManager.getProducts();

  if (addProduct) {
    socketServer.emit("realtimeproducts", getProducts);
    return res.status(201).json({
      msg: "Producto creado ",
      data: { addProduct },
    });
  } else {
    return res.status(400).json({
      msg: "No se pudo crear el producto",
      data: {},
    });
  }
});

productManagerRouter.put("/:pid", (req, res) => {
  const id = req.params.pid;
  const updateProductBody = req.body;
  const productFindById = productManager.getProductById(parseInt(id));
  if (productFindById != undefined) {
    const updateProduct = productManager.updateProduct(
      parseInt(id),
      updateProductBody
    );
    if (updateProduct) {
      return res.status(201).json({
        msg: "Producto con el id ",
        data: { productFindById },
      });
    } else {
      return res.status(400).json({
        msg:
          "No existe el producto con el id " +
          id +
          " o hay errores en sus campos",
        data: {},
      });
    }
  }
});

productManagerRouter.delete("/:pid", (req, res) => {
  const id = req.params.pid;
  const deleteProduct = productManager.deleteProduct(parseInt(id));

  const getProducts = productManager.getProducts();

  if (deleteProduct) {
    socketServer.emit("realtimeproducts", getProducts);
    return res.status(200).json({
      msg: "Producto " + id + " eliminado",
      data: {},
    });
  } else {
    return res.status(400).json({
      msg: "No existe el producto con el id" + id,
      data: {},
    });
  }
});
