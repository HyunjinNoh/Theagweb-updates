import jwt from "jsonwebtoken";

export const verifyReporter = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer 토큰에서 추출

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "Reporter") {
      return res.status(403).json({ message: "Access Denied. Not a Reporter." });
    }
    req.user = decoded; // 토큰 정보 저장
    next();
  } catch (error) {
    res.status(400).json({ message: "로그인 시간이 만료되었습니다." });
  }
};

export default verifyReporter;