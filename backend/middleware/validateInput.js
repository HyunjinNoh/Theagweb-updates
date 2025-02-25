const register = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@ajou\.ac\.kr$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Only Ajou University emails are allowed." });
  }

  next();
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  next();
};

const validateInput = { register, login };
export default validateInput;