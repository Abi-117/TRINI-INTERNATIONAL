import PDFDocument from "pdfkit";
import Order from "../models/Order.js";

export const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const doc = new PDFDocument({
      margin: 50,
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(24).text(
      "TRINI INTERNATIONAL",
      {
        align: "center",
      }
    );

    doc.moveDown();

    doc.fontSize(16).text(
      `Invoice #${order._id}`
    );

    doc.text(
      `Date : ${new Date(
        order.createdAt
      ).toLocaleDateString()}`
    );

    doc.moveDown();

    doc.fontSize(14).text("Customer");

    doc.text(order.customer.name);

    doc.text(order.customer.email);

    doc.text(order.customer.phone || "");

    doc.moveDown();

    doc.fontSize(14).text("Products");

    order.items.forEach((item) => {
      doc.text(
        `${item.product.name}
Qty : ${item.quantity}
₹${item.price}`
      );

      doc.moveDown();
    });

    doc.fontSize(16).text(
      `Total : ₹${order.total}`
    );

    doc.end();
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};