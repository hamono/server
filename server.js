const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// 连接数据库
mongoose.connect('mongodb://localhost/playground', {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
  .then(() => console.log('数据库连接成功！'))
  .catch(err => console.log(err, '数据库连接失败！'));

// 创建集合规则
const usersSchema=new mongoose.Schema({
  name: String,
  password: String,
  phoneNumber: Number
});
const User=mongoose.model('User',usersSchema);

// 创建服务器实例
const app = express();

app.use(express.static('./build'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/signIn/user/logIn', (req, res) => {
  console.log(req.body.username)
  User.findOne({phoneNumber:req.body.username})
    .then(result=>{
      console.log(result);
      if(result.password==req.body.password){
        res.send({success:true,massage:'登录成功'})
      }else{
        res.send({success:false,massage:'密码错误'})
      }
    })
    .catch(()=>{
      res.send({success:false,massage:'用户不存在'})
    })
})
app.post('/signOn/user/logOn', (req, res) => {
  // 创建集合实例
  const user=new User({
    name:req.body.username,
    password:req.body.password,
    phoneNumber:req.body.phoneNumber
  });
  user.save();
    res.status(200).send({success:true,massage:'注册成功'})
})
app.listen(80);
console.log('网站启动成功！！');