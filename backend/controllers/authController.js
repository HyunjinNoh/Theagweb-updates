import authService from "../services/authService.js";

// 회원가입
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await authService.register(name, email, password);
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 로그인 
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, role } = await authService.login(email, password);
    res.status(200).json({ token, role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const authController = { register, login };
export default authController;