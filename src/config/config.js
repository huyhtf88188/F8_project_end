import dotenv from "dotenv";
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  DB_URI: process.env.DB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  CATEGORY_ID_DEFAULT: process.env.CATEGORY_ID_DEFAULT,

  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_OF_MY: process.env.SMTP_OF_MY,
  SMTP_SECRET: process.env.SMTP_SECRET,
  SMTP_USERNAME: process.env.SMTP_USERNAME,
};

export default env;
