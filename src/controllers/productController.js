const Order = require("../models/Order");
const Product = require("../models/Product");

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un producto por id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un producto nuevo
const createProduct = async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    model: req.body.model,
    brand: req.body.brand,
    category: req.body.category,
    stock: req.body.stock,
    images: req.body.images,
  });
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    product.model = req.body.model;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.stock = req.body.stock;
    product.images = req.body.images;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    await product.remove();
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar el número de ventas de un producto
const updateProductSales = async (productId, numSales) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    product.sales += numSales;
    await product.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProductStock = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    const products = order.products;
    for (let i = 0; i < products.length; i++) {
      const productId = products[i].product;
      const productQuantity = products[i].quantity;
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      product.stock -= productQuantity;
      await product.save();
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductSales,
  updateProductStock,
};
