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
