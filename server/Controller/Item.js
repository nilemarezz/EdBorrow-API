const BorrowItemModel = require ('../Model/Item');
const pool = require ('../config/BorrowSystemDB');

const borrowItem = new BorrowItemModel ();

//https://github.com/nilemarezz/NodeJS-UCR/blob/master/server.js

exports.getAllBorrowItems = async (req, res, next) => {
  try {
    let getborrowItems = await borrowItem.getAllItem ();
    res.status (200).json ({result: 'success', data: getborrowItems});
  } catch (err) {
    res.status (500).json ({result: 'false', msg: err}); 
  }
};

exports.getSearchBorrowItems = async (req, res, next) => {
  try {
      let getborrowItems = await borrowItem.searchItem (req.query);
      res.status (200).json ({result: 'success', data: getborrowItems});
  } catch (err) {
      res.status (500).json ({result: 'false', msg: err});
  }
}

exports.getBorrowItemById = async (req, res, next) => {
  try {
    let borrowItemById;

    borrowItemById = await borrowItem.getItemById (req.params.id);

    res.status (200).json ({result: 'success', data: borrowItemById});
  } catch (err) {
    res.status (500).json ({result: 'false', msg: err});
  }
};

exports.getCategoryNameOrDepartmentName = async (req, res, next) => {
  try {
    let borrowItems;
    console.log (req.body.command);

    if (req.body.command === 'Category') {
      borrowItems = await borrowItem.getCategory ();
    } else if (req.body.command === 'Department') {
      borrowItems = await borrowItem.getDepartment ();
    } else if (req.body.command === 'OwnerItem') {
      borrowItems = await borrowItem.getOwner ();
    }

    res.status (200).json ({result: 'success', data: borrowItems});
  } catch (err) {
    res.status (500).json ({result: 'false', msg: err});
  }
};