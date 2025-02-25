import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//회원가입
const register = async (name, email, password) => {

    //회원가입 전 이메일 중복 여부 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = new User({ 
        name, 
        email, 
        password: hashedPassword 
    });

    await user.save();

    return user;
};

const login = async (email, password) => {

    //이메일에 해당되는 유저 찾기
    const user = await User.findOne({email});
    if (!user) {
        throw new Error("User not found");
    }

    //그 유저와 비밀번호 동일한지 확인
    const isPasswordRight = await bcrypt.compare(password, user.password);
    if (!isPasswordRight) {
        throw new Error("Wrong password");
    }

    // JWT 생성
    const token = jwt.sign(
        { 
            _id: user._id, //이메일도 고유값이라 반환하기 좋지만, 추후 변경 가능성과 토큰에 개인정보 포함하면 보안상 안 좋아서서 안전하게 _id로
            role: user.role //역할에 따라 다른 화면을 렌더링하기 위해 사용
        }, 
        process.env.JWT_SECRET, 
        {expiresIn: "1h"}
);
    return { token, role: user.role };
}

const authService = { register, login };
export default authService;

