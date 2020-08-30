const BorrowItemModel = require('../Model/Item');
const UserModel = require('../Model/User');
const { actionLogs } = require('../Model/Data');
const upload = require('../Utilities/Upload/Upload');
const printlog = require('../config/logColor');
const borrowItem = new BorrowItemModel();
const user = new UserModel();
const singleUpload = upload.single('image');
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

exports.getValidateItem = async (req, res, next) => {
  try {
    let getborrowItems = await borrowItem.getValidateByItemId(req.query);
    res.status(200).json({ result: 'success', data: getborrowItems });
  } catch (err) {
    res.status(500).json({ result: 'false', msg: 'hahah' });
  }
}

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
      await actionLogs.ADD_ITEM_LOG(res.locals.authData.user[0].userId, true, 'Success');
      res.status(200).json({ result: 'success', msg: 'Add Item Success' });
    });
  } catch (err) {
    console.log(err);
    await actionLogs.ADD_ITEM_LOG(res.locals.authData.user[0].userId, false, err.code);
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.removeItemById = async (req, res, next) => {
  try {
    await borrowItem.removeItemById(req.query.itemId);
    await actionLogs.DELETE_ITEM_LOG(res.locals.authData.user[0].userId, true, `Id : ${req.query.itemId}`);
    res.status(200).json({ result: 'success', msg: 'Remove item success', });
  } catch (err) {
    console.log(err);
    await actionLogs.DELETE_ITEM_LOG(res.locals.authData.user[0].userId, false, err.code);
    res.status(500).json({ result: 'false', msg: err });
  }
}

exports.getItemByDepartment = async (req, res, next) => {
  try {
    const department = await checkDepartmentId(res.locals.authData.user[0].userId)
    let itemByUser = await borrowItem.getItemByDepartment(
      res.locals.authData.user[0].userId,
      department
    );

    res.status(200).json({ result: 'success', data: itemByUser });
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
        await actionLogs.UPDATE_ITEM_LOG(res.locals.authData.user[0].userId, false, 'Not own item');
        res.status(500).json({ result: 'false', msg: "It's not your Item" });
      } else {
        printlog(
          'Green',
          `Update item success : ${data.itemId} - ${res.locals.authData.user[0].userId}`
        );
        await actionLogs.UPDATE_ITEM_LOG(res.locals.authData.user[0].userId, true, 'Success');
        res.status(200).json({ result: 'success', msg: 'Edit Item Success' });
      }

    });


  } catch (err) {
    console.log(err);
    await actionLogs.UPDATE_ITEM_LOG(res.locals.authData.user[0].userId, false, err.code);
    res.status(500).json({ result: 'false', msg: err });
  }
};
