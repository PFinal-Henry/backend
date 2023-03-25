const Order = require("../models/Order");
const Product = require("../models/Product");

// Controlador para actualizar ventas de productos
const updateProductSales = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate("products.product");
    if (!order) {
      return console.log("Order not found");
    }
    for (let item of order.products) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { sales: item.quantity },
      });
    }
    console.log("Product sales updated successfully");
  } catch (err) {
    console.error(err);
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
  updateProductSales,
  updateProductStock,
};
