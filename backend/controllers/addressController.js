import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
  try {
    const customer = req.customer._id;

    const address = await Address.create({
      customer,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Address Added",
      address,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

export const getAddresses = async (
  req,
  res
) => {

  const addresses = await Address.find({
    customer: req.customer._id,
  });

  res.json({
    success: true,
    addresses,
  });

};

export const deleteAddress = async (
  req,
  res
) => {

  await Address.findOneAndDelete({
    _id: req.params.id,
    customer: req.customer._id,
  });

  res.json({
    success: true,
    message: "Address Deleted",
  });

};

export const updateAddress = async (
  req,
  res
) => {

  const address =
    await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        customer: req.customer._id,
      },
      req.body,
      {
        new: true,
      }
    );

  res.json({
    success: true,
    address,
  });

};

export const setDefaultAddress = async (
  req,
  res
) => {

  await Address.updateMany(
    {
      customer: req.customer._id,
    },
    {
      isDefault: false,
    }
  );

  const address =
    await Address.findByIdAndUpdate(
      req.params.id,
      {
        isDefault: true,
      },
      {
        new: true,
      }
    );

  res.json({
    success: true,
    address,
  });

};