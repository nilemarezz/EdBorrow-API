const pool = require ('../config/BorrowSystemDB');

class BorrowItem {
  constructor () {
    this.borrowItem;
  }

  async getAllItem () {
    this.borrowItem = await pool.query (`
      SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage 
      FROM Items i left join ItemDepartment d on i.departmentId = d.departmentId 
            join ItemCategory c on i.categoryId = c.categoryId
      ORDER BY i.itemName asc;
      `);
    return this.borrowItem;
  }

  async getItemById (id) {
    this.borrowItem = await pool.query (
      `SELECT * from Items i left join ItemDepartment d on i.departmentId = d.departmentId 
                            left join DepartmentPlace dp on dp.placeId = d.placeId 
      WHERE i.itemId = ${id};`
    );
    return this.borrowItem;
  }

  async getCategory () {
    this.borrowItem = await pool.query (
      `SELECT DISTINCT categoryName FROM ItemCategory;`
    );
    return this.borrowItem;
  }

  async getDepartment () {
    this.borrowItem = await pool.query (
      `SELECT DISTINCT departmentName FROM ItemDepartment;`
    );
    return this.borrowItem;
  }

  async getOwner () {
    this.borrowItem = await pool.query (
      `SELECT DISTINCT u.firstName as 'ownerName'
      FROM Items i join Users u ON i.userId = u.userId 
      WHERE i.userId IS NOT NULL;`
    );
    return this.borrowItem;
  }

  async searchItem (query) {
    let itemSearch = query.searchInput; // itemSearch = I
    let itemDepartment = query.searchDepartment; // itemDepartment = D
    let itemCategory = query.searchCategory; // itemCategory = C
    let itemReturn = query.searchReturnDate; // itemReturn = R
    let itemBorrow = query.searchBorrowDate; // itemBorrow = B
    let itemAvailability = query.searchAvailability; // itemAvailability = A

    //Have itemSearch and other (I)
    if (itemSearch) {
      //I
      this.items = await pool.query (`SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage
              FROM Items i 
              LEFT JOIN ItemDepartment d ON i.departmentId = d.departmentId
              WHERE i.itemName LIKE '%${itemSearch}%' 
              OR i.itemBrand LIKE '%${itemSearch}%'
              OR i.itemModel LIKE '%${itemSearch}%'`);
      if (itemDepartment) {
        //I,D
        this.items = await pool.query (`SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage
              FROM Items i 
              LEFT JOIN ItemDepartment d ON i.departmentId = d.departmentId
              WHERE (d.departmentName = '${itemDepartment}')
              AND (i.itemName LIKE '%${itemSearch}%' 
              OR i.itemBrand LIKE '%${itemSearch}%'
              OR i.itemModel LIKE '%${itemSearch}%')`);
        if (itemBorrow && itemReturn) {
          //I,D,B,R
        }
        if (itemCategory) {
          //I,D,C
          this.items = await pool.query (`SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage
                FROM Items i 
                LEFT JOIN ItemDepartment d ON i.departmentId = d.departmentId
                JOIN ItemCategory c ON i.categoryId = c.categoryId
                WHERE (d.departmentName IN ('${itemDepartment}')
                AND c.categoryName IN ('${itemCategory}'))
                AND i.itemName LIKE '%${itemSearch}%'
                OR i.itemBrand LIKE '%${itemSearch}%'
                OR i.itemModel LIKE '%${itemSearch}%'`);
          if (itemBorrow && itemReturn) {
            //I,D,C,B,R
          }
        }
      }
      if (itemCategory) {
        //I,C
        this.items = await pool.query (`
            SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage
            FROM Items i 
            JOIN ItemCategory c ON i.categoryId = c.categoryId 
            LEFT JOIN ItemDepartment d ON i.departmentId = d.departmentId
            WHERE (c.categoryName = '${itemCategory}')
            AND (i.itemName LIKE '%${itemSearch}%'
            OR i.itemBrand LIKE '%${itemSearch}%'
            OR i.itemModel LIKE '%${itemSearch}%')`);
        if (itemBorrow && itemReturn) {
          //I,C,B,R
        }
      }
      if (itemBorrow && itemReturn) {
        //I,B,R
      }
      if (itemSearch && itemAvailability) {
        //I,A
        this.items = await pool.query (`SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage
              FROM Items i
              LEFT JOIN ItemDepartment d ON i.departmentId = d.departmentId
              WHERE i.itemAvailability = ${itemAvailability} 
              AND (i.itemName LIKE '%${itemSearch}%' 
              OR i.itemBrand LIKE '%${itemSearch}%'
              OR i.itemModel LIKE '%${itemSearch}%')`);
        if (itemDepartment) {
          //I,A,D
          this.items = await pool.query (`SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage
                FROM Items i 
                LEFT JOIN ItemDepartment d ON i.departmentId = d.departmentId
                WHERE (i.itemAvailability = ${itemAvailability} 
                AND d.departmentName IN ('${itemDepartment}'))
                AND (i.itemName LIKE '%${itemSearch}%' 
                OR i.itemBrand LIKE '%${itemSearch}%'
                OR i.itemModel LIKE '%${itemSearch}%')`);
          if (itemCategory) {
            //I,A,D,C
            this.items = await pool.query (`SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage
                FROM Items i 
                LEFT JOIN ItemDepartment d ON i.departmentId = d.departmentId
                JOIN ItemCategory c ON i.categoryId = c.categoryId
                WHERE (i.itemAvailability = ${itemAvailability} 
                AND d.departmentName IN ('${itemDepartment}')
                AND (c.categoryName = '${itemCategory}'))
                AND (i.itemName LIKE '%${itemSearch}%' 
                OR i.itemBrand LIKE '%${itemSearch}%'
                OR i.itemModel LIKE '%${itemSearch}%')`);
            if (itemBorrow && itemReturn) {
              //I,A,D,C,B,R
            }
          }
          if (itemBorrow && itemReturn) {
            //I,A,D,B,R
          }
        }
        if (itemCategory) {
          //I,A,C
          this.items = await pool.query (`SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage
          FROM Items i 
          LEFT JOIN ItemDepartment d ON i.departmentId = d.departmentId
          JOIN ItemCategory c ON i.categoryId = c.categoryId
          WHERE (i.itemAvailability = ${itemAvailability} 
          AND c.categoryName IN ('${itemCategory}'))
          AND (i.itemName LIKE '%${itemSearch}%' 
          OR i.itemBrand LIKE '%${itemSearch}%'
          OR i.itemModel LIKE '%${itemSearch}%')`);
          if (itemBorrow && itemReturn) {
            //I,A,C,B,R
          }
        }
        if (itemBorrow && itemReturn) {
          //I,A,B,R
        }
      }
    } else if (itemDepartment) {
      //Have only itemDepartment and other but don't have itemSearch (D)
      this.items = await pool.query (`SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage
              FROM Items i 
              LEFT JOIN ItemDepartment d ON i.departmentId = d.departmentId
              WHERE d.departmentName = '${itemDepartment}'`);
      if (itemCategory) {
        //D,C
        this.items = await pool.query (`SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage
              FROM Items i 
              LEFT JOIN ItemDepartment d ON i.departmentId = d.departmentId
              JOIN ItemCategory c ON i.categoryId = c.categoryId
              WHERE d.departmentName = '${itemDepartment}'
              AND c.categoryName = '${itemCategory}'`);
        if (itemAvailability) {
          //D,C,A
          this.items = await pool.query (`SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage
              FROM Items i 
              LEFT JOIN ItemDepartment d ON i.departmentId = d.departmentId
              JOIN ItemCategory c ON i.categoryId = c.categoryId
              WHERE (d.departmentName = '${itemDepartment}'
              AND c.categoryName = '${itemCategory}')
              AND i.itemAvailability = ${itemAvailability}`);
          if (itemBorrow && itemReturn) {
            //D,C,A,B,R
          }
        }
        if (itemBorrow && itemReturn) {
          //D,C,B,R
        }
      }
      if (itemAvailability) {
        //D,A
        this.items = await pool.query (`SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage
              FROM Items i 
              LEFT JOIN ItemDepartment d ON i.departmentId = d.departmentId
              WHERE d.departmentName = '${itemDepartment}'
              AND i.itemAvailability = ${itemAvailability}`);
        if (itemBorrow && itemReturn) {
          //D,A,B,R
        }
      }
      if (itemBorrow && itemReturn) {
        //D,B,R
      }
    } else if (itemCategory) {
      //Have itemCategory and other but don't have itemSearch and itemDepartment [C]
      this.items = await pool.query (`SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage
          FROM Items i 
          LEFT JOIN ItemDepartment d ON i.departmentId = d.departmentId
          JOIN ItemCategory c ON i.categoryId = c.categoryId
          WHERE c.categoryName = '${itemCategory}'`);
      if (itemAvailability) {
        //C,A
        this.items = await pool.query (`SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage
            FROM Items i 
            JOIN ItemCategory c ON i.categoryId = c.categoryId
            WHERE c.categoryName = '${itemCategory}'
            AND i.itemAvailability = ${itemAvailability}`);
        if (itemBorrow && itemReturn) {
          //C,A,B,R
        }
      }
      if (itemBorrow && itemReturn) {
        //C,B,R
      }
    } else if (itemAvailability) {
      //A
      this.items = await pool.query (`SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage
          FROM Items i
          LEFT JOIN ItemDepartment d ON i.departmentId = d.departmentId
          WHERE i.itemAvailability = ${itemAvailability}`)
          if (itemBorrow && itemReturn) {
            //A,B,R
          }
    } else if (itemBorrow && itemReturn) {
      //B,R
    } else {
      this.items = await pool.query (`SELECT * FROM Items`);
    }
    return this.items;
  }

  async removeAllItems () {
    this.borrowItem = await pool.query (`DELETE FROM Items;`);
    return this.borrowItem;
  }

  async addItem(value){
    console.log(value)
    this.borrowItem = await pool.query(
    `INSERT INTO Items (itemBrand ,itemModel , itemName, createDate ,categoryId ,userId ,itemStatusId ,itemImage ,itemDescription ,itemBorrowable ,itemAvailability ) 
    values ('${value.itemBrand}','${value.itemModel}','${value.itemName}','${value.createDate}',1,'${value.userId}',1,${value.itemImage === null ? 'NULL': `'${value.itemImage }'`},'${value.itemDescription}',1,1) ` )
    return this.borrowItem
  }
}

module.exports = BorrowItem;
