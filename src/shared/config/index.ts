import "dotenv/config";

interface Config {
  port: number;
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
  };
  jwt: {
    secret: string;
  };
  transporter: {
    host: string;
    port: number;
    auth: {
      user: string;
      pass: string;
    };
  };
}

const config: Config = {
  port: parseInt(process.env.PORT!),
  db: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    name: process.env.DB_NAME!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
  transporter: {
    host: process.env.TRANS_HOST,
    port: parseInt(process.env.TRANS_PORT),
    auth: {
      user: process.env.TRANS_USER,
      pass: process.env.TRANS_PASS,
    },
  },
};

export default config;
