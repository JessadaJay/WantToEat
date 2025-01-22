const express = require("express");
const app = express()
const path = require('path')
const router = require("./router");

app.use(express.urlencoded({ extended: true })); // สำหรับข้อมูลที่ส่งมาจากฟอร์ม
app.use(express.json()); // สำหรับ JSON (หากใช้)
app.use(express.static(path.join(__dirname, "public")));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')
app.use("/", router);

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});