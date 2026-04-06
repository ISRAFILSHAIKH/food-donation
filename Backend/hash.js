const bcrypt = require('bcryptjs');

const hashPassword = async () => {
  const password = "admin123";
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
};

hashPassword();