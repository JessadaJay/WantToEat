const express = require("express");
const { Product, saveProduct, Order, saveOrder, Register, saveRegister } = require('./model');
const router = express.Router();
let selectedFoods = [];
let table
//defaultZone
router.get("/table", (req, res) => {
  res.render('table.ejs');
})
//orderZone
//customerZone
router.post("/customerIndex", async (req, res) => {
  selectedFoods = req.body.selectedFoods;
  let data = ({
    table: req.body.table,
  });
  table = req.body.table
  try {
    const product = await Product.find().exec();
    res.render('customerIndex.ejs', { products: product, table: data });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while saving product");
  }

})
router.post('/updateSelectedFoods', (req, res) => {
  selectedFoods = req.body.selectedFoods;
  res.json({ selectedFoods }); // ส่งข้อมูลกลับไปที่ Client
});

router.get("/customerIndex", async (req, res) => {
  try {
    const data = await Product.find().exec();
    res.render('customerIndex.ejs', { products: data });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching products");
  }
})
router.post('/placeOrder', async (req, res) => {
  let data = new Order({
    table: table,           // ใช้ข้อมูลโต๊ะจากที่เก็บไว้ในตัวแปร
    listFood: selectedFoods,
    status: 'serve' // ใช้ข้อมูลอาหารที่ลูกค้าเลือก
  });

  console.log("Table data: ", table);
  console.log("Selected foods: ", selectedFoods);

  try {
    // บันทึกคำสั่งซื้อ
    await saveOrder(data);

    // เคลียร์ข้อมูล selectedFoods หลังจากสั่งอาหาร
    selectedFoods.length = 0; // เคลียร์ array เพื่อให้เป็นค่าว่าง

    // ส่งข้อมูลกลับไปยัง Client พร้อมสถานะสำเร็จ
    res.json({
      success: true,
      message: "Order placed successfully",
      order: data // ส่งข้อมูลคำสั่งซื้อที่บันทึกไป
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error while placing the order"
    });
  }
});




//adminZone
router.post("/adminRegister", async(req, res) => {
  let data = new Register({
    name: req.body.name,
    nickname: req.body.nickname,
    birthday: req.body.birthday,
    position: req.body.position,
    Username: req.body.nickname,
    Password: req.body.position
  });
  try {
    await saveRegister(data);
    res.render('register.ejs');
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while saving product");
  }
  
})
router.get("/adminRegister", async(req, res) => {
    res.render('register.ejs');
})
router.get("/adminLogin", (req, res) => {
  res.render('login.ejs');
})
router.post('/adminLogin', async (req, res) => {
  const { Username, Password } = req.body;

  try {
    const user = await Register.findOne({ Username });

    if (!user) {
      return res.status(400).json({ message: 'ผู้ใช้ไม่พบ' });
    }

    // ตรวจสอบรหัสผ่าน
    const pass = await Register.findOne({ Password });

    if (!pass) {
      return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }
    res.redirect('/adminIndex')
    // res.json({
    //   message: 'เข้าสู่ระบบสำเร็จ',
    //   user: { email: user.email },
    // });
    

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
  }
});
router.get("/adminIndex", async(req, res) => {
  try {
    const data = await Product.find().exec();
    res.render('adminIndex.ejs', { products: data });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching products");
  }
})

router.get("/addItem", (req, res) => {
  res.render('addItem.ejs');
})
router.post("/submit", async (req, res) => {
  let data = new Product({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description
  });

  try {
    await saveProduct(data);
    res.render('addItem.ejs');
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while saving product");
  }
});

router.get("/checkOrder", async(req, res) => {
  try {
    // ดึงข้อมูลทั้งหมดจากคอลเล็กชัน 'orders'
    const orders = await Order.find();

    // ส่งข้อมูลไปที่หน้า EJS
    res.render('checkOrder.ejs', { orders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
})
module.exports = router