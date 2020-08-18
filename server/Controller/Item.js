const BorrowItemModel = require('../Model/Item');
const upload = require('../Utilities/Upload/Upload');
const printlog = require('../config/logColor');
const borrowItem = new BorrowItemModel();
const singleUpload = upload.single('image');
const { getUserRole } = require('./User');
const isItemDepartment = require('../Utilities/isItemInDepartment')
const checkDepartmentId = require('../Utilities/checkDepartmentId')
exports.getAllBorrowItems = async (req, res, next) => {
  try {
    let getborrowItems = await borrowItem.getAllItem();
    res.status(200).json({ result: 'success', data: getborrowItems });
  } catch (err) {
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.getSearchBorrowItems = async (req, res, next) => {
  try {
    let getborrowItems = await borrowItem.searchItem(req.query);
    res.status(200).json({ result: 'success', data: getborrowItems });
  } catch (err) {
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.getBorrowItemById = async (req, res, next) => {
  try {
    const itemDepartment = await isItemDepartment(req.params.id)
    borrowItemById = await borrowItem.getItemById(req.params.id, itemDepartment);
    res.status(200).json({ result: 'success', data: borrowItemById });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.getCategoryNameOrDepartmentName = async (req, res, next) => {
  try {
    let borrowItems;

    if (req.body.command === 'Category') {
      borrowItems = await borrowItem.getCategory();
    } else if (req.body.command === 'Department') {
      borrowItems = await borrowItem.getDepartment();
    } else if (req.body.command === 'OwnerItem') {
      borrowItems = await borrowItem.getOwner();
    }

    res.status(200).json({ result: 'success', data: borrowItems });
  } catch (err) {
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.addItem = async (req, res, next) => {
  try {
    let image;
    console.log(req.body)
    await singleUpload(req, res, async function (err) {
      if (req.file) {
        image = req.file.location;
      } else {
        image = null;
      }

      let data = {
        ...req.body,
        itemImage: image,
        userId: res.locals.authData.user[0].userId,
      };
      let addItem = await borrowItem.addItem(data);
      printlog(
        'Green',
        `Add item success : ${addItem.insertId} - ${res.locals.authData.user[0].userId}`
      );


      res.status(500).json({ result: 'success', msg: 'Add Item Success' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.getItemByDepartment = async (req, res, next) => {
  try {
    let data = [];
    let role = await getUserRole(res.locals.authData.user[0].userId);
    let itemByRole = await borrowItem.getItemByDepartment(
      role[0],
      'department'
    );
    data = [...data, ...itemByRole];
    let itemByUser = await borrowItem.getItemByDepartment(
      res.locals.authData.user[0].userId,
      'user'
    );
    data = [...data, ...itemByUser];

    res.status(200).json({ result: 'success', data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: 'false', msg: err });
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

      let data = {
        ...req.body,
        itemImage: image,
        userId: res.locals.authData.user[0].userId,
      };
      const userDepartment = await checkDepartmentId(res.locals.authData.user[0].userId)
      const editItem = await borrowItem.updateItem(data, userDepartment, res.locals.authData.user[0].userId);
      if (editItem.affectedRows === 0) {
        printlog(
          'Red',
          `Update item fale : ${data.itemId} - ${res.locals.authData.user[0].userId} - Not own item`
        );
        res.status(500).json({ result: 'false', msg: "It's not your Item" });
      } else {
        printlog(
          'Green',
          `Update item success : ${data.itemId} - ${res.locals.authData.user[0].userId}`
        );
        res.status(200).json({ result: 'success', msg: 'Edit Item Success' });
      }

    });


  } catch (err) {
    console.log(err);
    res.status(500).json({ result: 'false', msg: err });
  }
};
