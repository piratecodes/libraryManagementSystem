import jwt from 'jsonwebtoken'

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.status(401).json({msg: "Auth token Required"})

    jwt.verify(token, "JwTKeY", (err, user)=>{
        if (err) return res.status(403).json(err)
        req.user = user
        next()
    })
}
export default authToken 