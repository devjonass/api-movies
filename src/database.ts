import { Client } from "pg";

const client: Client = new Client({
  user: "jonass",
  password: "1234",
  host: "localhost",
  database: "moviess",
  port: 5432,
});

const startDataBase = async (): Promise<void> => {
  await client.connect();
  console.log("Database connected!");
};

export { client, startDataBase };
