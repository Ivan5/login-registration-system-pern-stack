const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

//registering
router.post("/register", validInfo, async (req, res) => {
  //1.- destructure the req.body
  const { name, email, password } = req.body;
  try {
    //2.- Check if user exist

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).send("User already exist");
    }
    //3.- Bcrypt the user password
    var numSaltRounds = 10;

    const salt = await bcrypt.genSalt(numSaltRounds);

    const bcryptPassword = await bcrypt.hash(password, salt);

    //4.- enter the new user inside db

    let newUser = await pool.query(
      "INSERT INTO users (user_name,user_email,user_password) VALUES ($1,$2,$3) RETURNING *",
      [name, email, bcryptPassword]
    );

    //5.- generating our jwt token
    const jwtToken = jwtGenerator(newUser.rows[0].user_id);
    return res.json({
      jwtToken,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
    console.error(error.message);
  }
});

//login route
router.post("/login", validInfo, async (req, res) => {
  try {
    //1.-destructor the req.body
    const { email, password } = req.body;
    //2.- check if user doesn't exists
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect");
    }
    //3.- check if incomming password is the same the database password
    const validPassword = bcrypt.compare(password, user.rows[0].user_password);

    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }
    //4.- give time the jwt token
    const token = jwtGenerator(user.rows[0].user_id);
    return res.json({ token });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
