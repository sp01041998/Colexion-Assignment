const mongoose = require("mongoose");
const productModel = require("../models/productModel");

const isValid = function (value) {
  if (typeof value == "undefined" || value == null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};



const productProfile = async function (req, res) {
  try {
    let productData = req.body; // extracting Product Data

    if (Object.keys(productData).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Product information is missing" });
    }

    let productInfo = {};

    let { title, code, category, price } = productData;

    // title validation

    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: "title is not valid" });
    }

    const istitlealredyUsed = await productModel.findOne({ title }); //{title :title} productInfoect shorthand property

    if (istitlealredyUsed) {
      return res
        .status(400)
        .send({ status: false, msg: "title already in use" });
    }

    productInfo.title = title.trim().toLowerCase();

    // Product code validation

    if (!isValid(code)) {
      return res.status(400).send({ status: false, msg: "Code is not valid" });
    }

    const isCodeUnique = await productModel.findOne({ code });

    if (isCodeUnique) {
      return res
        .status(400)
        .send({ status: false, msg: "code already in use" });
    }

    productInfo.code = code;

    // category validation

    if(!isValid(category)){
        return res.status(400).send({ status: false, msg: "Code is not valid" });
    }

    productInfo.category = category

    //price validation

    if (!isValid(price)) {
      return res.status(400).send({ status: false, msg: "price is not valid" });
    }

    if (isNaN(Number(price)) === true) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "Price would take only Numbers as a input",
        });
    }

    price = Number(price);

    if (price <= 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Price value can't be less than 1" });
    }

    productInfo.price = price;

    const productCreated = await productModel.create(productInfo);

    return res
      .status(201)
      .send({ status: true, msg: "product Created", data: productCreated });


  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};








module.exports.productProfile = productProfile;

