import jwt from "jsonwebtoken";
export function authRequired(req, res, next){
  const token = req.cookies?.token;
  if(!token) return res.status(401).json({error:"No autenticado"});
  try{
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  }catch(e){ return res.status(401).json({error:"Token inválido o expirado"}); }
}
