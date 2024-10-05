import { registerAs } from "@nestjs/config";

export default registerAs('secretsFront',()=>{
  const jwt = process.env.JWT_SECRET_FRINTEND;
  return { jwt };
})