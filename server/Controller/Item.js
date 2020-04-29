const BorrowItemModel = require("../Model/Item");
const pool = require("../config/BorrowSystemDB");
const upload = require("./upload");
const borrowItem = new BorrowItemModel();
const singleUpload = upload.single("image");
const noneUpload = upload.none();
const path = require("path");
const { getUserRole } = require("./User");

exports.getAllBorrowItems = async (req, res, next) => {
  try {
    let getborrowItems = await borrowItem.getAllItem();
    res.status(200).json({ result: "success", data: getborrowItems });
  } catch (err) {
    res.status(500).json({ result: "false", msg: err });
  }
};

exports.getSearchBorrowItems = async (req, res, next) => {
  try {
    let getborrowItems = await borrowItem.searchItem(req.query);
    res.status(200).json({ result: "success", data: getborrowItems });
  } catch (err) {
    res.status(500).json({ result: "false", msg: err });
  }
};

exports.getBorrowItemById = async (req, res, next) => {
  try {
    let borrowItemById;

    borrowItemById = await borrowItem.getItemById(req.params.id);

    res.status(200).json({ result: "success", data: borrowItemById });
  } catch (err) {
    res.status(500).json({ result: "false", msg: err });
  }
};

exports.getCategoryNameOrDepartmentName = async (req, res, next) => {
  try {
    let borrowItems;
    console.log(req.body.command);

    if (req.body.command === "Category") {
      borrowItems = await borrowItem.getCategory();
    } else if (req.body.command === "Department") {
      borrowItems = await borrowItem.getDepartment();
    } else if (req.body.command === "OwnerItem") {
      borrowItems = await borrowItem.getOwner();
    }

    res.status(200).json({ result: "success", data: borrowItems });
  } catch (err) {
    res.status(500).json({ result: "false", msg: err });
  }
};

exports.addItem = async (req, res, next) => {
  try {
    // console.log(res.locals.authData.user[0].userId)

    let image;
    await singleUpload(req, res, async function (err) {
      if (req.file) {
        image = req.file.location;
      } else {
        image = null;
      }
      console.log(image);
      let data = {
        ...req.body,
        itemImage: image,
        userId: res.locals.authData.user[0].userId,
      };
      let addItem = await borrowItem.addItem(data);
      res.status(500).json({ result: "success", msg: "Add Item Success" });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: "false", msg: err });
  }
};

exports.getItemByDepartment = async (req, res, next) => {
  try {
    let data = [];
    let role = await getUserRole(res.locals.authData.user[0].userId);
    let itemByRole = await borrowItem.getItemByDepartment(
      role[0],
      "department"
    );
    data = [...data, ...itemByRole];
    let itemByUser = await borrowItem.getItemByDepartment(
      res.locals.authData.user[0].userId,
      "user"
    );
    data = [...data, ...itemByUser];

    res.status(500).json({ result: "success", data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: "false", msg: err });
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    let image;
    await singleUpload(req, res, async function (err) {
      if (req.file) {
        image = req.file.location;
      } else {
        image = null;
      }
      console.log(req.body);
      let data = {
        ...req.body,
        itemImage: image,
        userId: res.locals.authData.user[0].userId,
      };
      
      let editItem = await borrowItem.updateItem(data);
      res.status(500).json({ result: "success", msg: "Edit Item Success" });
    });

    // let editItem = await borrowItem.updateItem(req.body);
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: "false", msg: err });
  }
};
