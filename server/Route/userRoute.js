const express = require("express");
const router = express.Router();
const {getUserDetail, userLogin, getUserRole,userRegister,ChangePassword} = require("../Controller/User")
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')

router
    .route("/")
    .put(verifyToken,validUser,ChangePassword)
router
    .route("/detail")
    .get(verifyToken,validUser,getUserDetail)
router
    .route("/login")
    .post(userLogin)
router
    .route("/register")
    .post(userRegister)

router.post("/createAdvisor", async (req, res) => {
    console.log(req.body.password)
    var cipherPassword = CryptoJS.AES.encrypt(
        req.params.password,
        config.CRYPTO_SECRET_KEY
    ).toString();
      
    const query = await pool.query(
        `INSERT Into Users (userId , password  , firstName  ,lastName ,email ,userTelNo ) 
        values ("${req.body.userId}", "${cipherPassword}" , "${req.body.firstName}" , "${req.body.lastName}" , "${req.body.email}" , "${req.body.userTelNo}")`
    );
    const query2 = await pool.query(
        `INSERT into UserRole (userId ,roleId ) values ("${req.body.userId}" , "${req.body.roleId}")`
    );
    console.log(query)
    res.send('success')
    });
// router
//     .route("/role")
//     .get(verifyToken,validUser,getUserRole)
    

module.exports = router;