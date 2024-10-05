import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => {
  const username = process.env.MONGO_USERNAME;
  const password = encodeURIComponent(process.env.MONGO_PASSWORD);
  const resource = process.env.MONGO_RESOURCE;
  const dbname   = process.env.MONGO_DBNAME;
  const uri = `mongodb://${username}:${password}@${resource}`;
  return { username, password, resource, uri, dbname };
});