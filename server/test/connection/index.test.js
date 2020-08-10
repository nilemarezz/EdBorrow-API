const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const server = require('../../index');

chai.should();
chai.use(chaiHttp);

describe('Test Connection', () => {
  it('check Connection', done => {
    chai.request(server).get('/api/items').end((err, res) => {
      if (err) {
        done(err);
        process.exit(1);
      } else {
        res.should.have.status(200);
        done();
      }
    });
  });
});

// describe('Test Items', () => {
//   // beforeEach((done) => { //Before each test we empty the database
//   //   borrowItem.removeAllItems();//should use the Test Database, not Development Database
//   //   done();
//   // });
//   /*
//     *Test the /GET route
//     */
//   describe('/GET Item', () => {
//     it('GET all the items should have a data and status success', done => {
//       chai.request(server).get('/api/items/').end((err, res) => {
//         if (err) {
//           done(err);
//           process.exit(1);
//         } else {
//           res.body.should.have.property('data');
//           res.should.have.status(200);
//           res.body.data.should.be.a('array');
//           res.body.result.should.have.eql('success');
//           done();
//         }
//       });
//     });
//     // it ('GET search item should have a data and status success', done => {
//     //   chai.request (server).get ('/api/items/search').end ((err, res) => {
//     //     if (err) {
//     //       done (err);
//     //       process.exit (1);
//     //     } else {
//     //       res.body.should.have.property ('data');
//     //       res.should.have.status (200);
//     //       res.body.data.should.be.a ('array');
//     //       res.body.result.should.have.eql ('success');
//     //       done ();
//     //     }
//     //   });
//     // });
//     // it ('POST column item should have a data and status success', done => {
//     //   chai.request (server).post ('/api/items/getColumn').end ((err, res) => {
//     //     if (err) {
//     //       done (err);
//     //       process.exit (1);
//     //     } else {
//     //       res.should.have.status (200);
//     //       res.body.should.be.a ('object');
//     //       res.body.should.have.property ('data');
//     //       res.body.should.have.property('result').eql ('success');
//     //       done ();
//     //     }
//     //   });
//     // });
//     // it ('it should GET a item by the given id', done => {
//     //   let borrowItem = new BorrowItem ();
//     //   ({
//     //     itemId: 20013,
//     //     itemBrand: null,
//     //     itemModel: null,
//     //     itemName: 'Lenovo Legion',
//     //     categoryName: 'Electronic',
//     //     departmentName: 'SRM',
//     //     userId: null,
//     //     roleTag: 'Advisor',
//     //     itemStatusId: 2,
//     //     itemBorrowable: 1,
//     //     itemAvailability: 0,
//     //     placeBuilding: 'SIT',
//     //     placeFloor: 3,
//     //     placeRoom: '202',
//     //     itemDescription: null,
//     //     itemImage: null,
//     //   });
//     //   chai
//     //     .request (server)
//     //     .get ('/book/' + borrowItem.itemId)
//     //     .send (book)
//     //     .end ((err, res) => {
//     //       if (err) {
//     //         done (err);
//     //         process.exit (1);
//     //       } else {
//     //         res.should.have.status (200);
//     //         res.body.should.be.a ('object');
//     //         res.body.should.have.property ('itemBrand');
//     //         res.body.should.have.property ('itemModel');
//     //         res.body.should.have.property ('itemName');
//     //         res.body.should.have.property ('categoryName');
//     //         res.body.should.have.property ('departmentName');
//     //         res.body.should.have.property ('userId');
//     //         res.body.should.have.property ('roleTag');
//     //         res.body.should.have.property ('itemStatusId');
//     //         res.body.should.have.property ('itemBorrowable');
//     //         res.body.should.have.property ('itemAvailability');
//     //         res.body.should.have.property ('placeBuilding');
//     //         res.body.should.have.property ('placeFloor');
//     //         res.body.should.have.property ('placeRoom');
//     //         res.body.should.have.property ('itemDescription');
//     //         res.body.should.have.property ('itemImage');
//     //         res.body.should.have.property ('itemId').eql (borrowItem.itemId);
//     //         done ();
//     //       }
//     //     });
//     // });
//   });
// });
