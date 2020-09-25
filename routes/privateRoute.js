const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next){
    const token = req.header('auth-token');
    if(!token)
        return res.status(401).send('No token');
    
    //verify the token
    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        console.log(req.user);
        next();
    } catch(error){
        res.status(400).send('invalid token');
    }

}