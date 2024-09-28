import { registerAs } from "@nestjs/config";

export default registerAs('secretsEnd',()=>{
  const jwt = process.env.JWT_SECRET_BACKEND;
  return { jwt };
})