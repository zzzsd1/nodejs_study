const { User } = require('../models/User');

let auth = (req, res, next) => {

    // 인증처리 하는 곳
    console.log("1");

    // 클라이언트에서 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth + "";
    console.log(req.cookies);
    console.log(token);

    // 토큰을 복호화 한 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        console.log("3");
        console.log(user);
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next();
    })

    // 유저가 있으면 인증 ok

    // 유저가 없으면 인증 no !
}

module.exports = {auth};