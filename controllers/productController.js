import fs from "fs";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import braintree from "braintree";
import slugify from "slugify";
import orderModel from "../models/orderModel.js";

// gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "xn86xdv5jnpntywv",
  publicKey: "57452mnsy8wqw3n5",
  privateKey: "f1dd1eac82f63b6031603d37dbf492b4",
});

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, quantity, category, shipping } =
      req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(404).send({
          success: false,
          message: "Name is required",
        });
      case !description:
        return res.status(404).send({
          success: false,
          message: "description is required",
        });
      case !price:
        return res.status(404).send({
          success: false,
          message: "price is required",
        });
      case !quantity:
        return res.status(404).send({
          success: false,
          message: "quantity is required",
        });
      case !category:
        return res.status(404).send({
          success: false,
          message: "category is required",
        });
      case photo && photo.size <= 100000:
        return res.status(404).send({
          success: false,
          message: "Photo is required",
        });
    }
    const product = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    return res.status(201).send({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while creating product",
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, price, quantity, category, shipping } =
      req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(404).send({
          success: false,
          message: "Name is required",
        });
      case !description:
        return res.status(404).send({
          success: false,
          message: "description is required",
        });
      case !price:
        return res.status(404).send({
          success: false,
          message: "price is required",
        });
      case !quantity:
        return res.status(404).send({
          success: false,
          message: "quantity is required",
        });
      case !category:
        return res.status(404).send({
          success: false,
          message: "category is required",
        });
      case photo && photo.size <= 100000:
        return res.status(404).send({
          success: false,
          message: "Photo is required",
        });
    }
    const product = await productModel.findByIdAndUpdate(
      id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    return res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while Updating product",
    });
  }
};

export const getAllProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .select("-photo")
      .populate("category")
      .limit(10)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      totalProducts: products.length,
      message: "Successfully get all products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting all products",
      error,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel
      .findOne({ slug })
      .select("-photo")
      .populate("category");
    console.log(product);
    res.status(200).send({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting Single product",
      error,
    });
  }
};

export const deleteSingleProductController = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while Deleting Single product",
      error,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while getting product photo",
    });
  }
};

// filter by category and price
export const filterProductController = async (req, res) => {
  const { checked, radioPrice } = req.body;
  try {
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radioPrice.length)
      args.price = {
        $gte: radioPrice[0],
        $lte: radioPrice[1],
      };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
    });
  }
};

// product count controller

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    return res.status(200).send({
      success: true,
      message: "Successfuly get",
      total,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while counting products",
      error,
    });
  }
};

export const productListController = async (req, res) => {
  // try {
  //   const perPage = 3;
  //   const page = req.params.page ? req.params.page : 1;
  //   const products = await productModel
  //     .find({})
  //     .select("-photo")
  //     .skip((page - 1) * perPage)
  //     .limit(perPage)
  //     .sort({ createdAt: -1 });
  //   return res.status(200).send({
  //     success: true,
  //     message: "Successfully get list",
  //     products,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   return res.status(400).send({
  //     success: false,
  //     message: "Error while getting list",
  //     error,
  //   });
  // }
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "error in search ctrl",
      error,
    });
  }
};

export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

export const categoryProductController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    return res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "error while geting category wise product",
      error,
    });
  }
};

// Payments Api

// TOKEN
export const brainTreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (error, result) {
      if (error) {
        return res.status(500).send(error);
      } else {
        return res.status(200).send(result);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// PAYMENT

export const brainTreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          return res.json({ ok: true });
        } else {
          return res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// CHANGE ORDERS STATUS

export const changeOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    return res.json(order);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while getting orders controller",
    });
  }
};
