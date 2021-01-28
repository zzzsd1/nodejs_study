const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require("./models/User");

app.use(bodyParser.urlencoded({entended: true})); //application/x-www-form-urlencoded
app.use(bodyParser.json()); //application/json
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://test1:test1@boiler-plate.oe1sb.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!! nodeMon 테스트')
})

app.post('/register', (req, res) => {

  // 회원가입 할 때 필요한 정보들을 client 에서 가져오면 그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body)
  user.save( (err, userInfo) => {
    if(err) return res.json({success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/login', (req, res) => {
  // 요청된 이메일을 db에 있는지 확인한다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccss: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 요청된 이메일이 db에 있다면 비번이 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
      return res.json({ loginSuccss: false, message: "비밀번호 오류"})
      // 비번이 맞다면 토큰을 생성한다.
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
        res.cookie("x-auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId:user._id
        })
      })

    })
    
  })




})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})