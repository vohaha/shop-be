import { Client } from 'pg';

const { DB_HOST, DB_PORT, DB_NAME, DB_PASSWORD, DB_USER } = process.env;
function getClient() {
  return new Client({
    user: DB_USER,
    host: DB_HOST,
    port: +DB_PORT,
    database: DB_NAME,
    password: DB_PASSWORD,
    connectionTimeoutMillis: 5000,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

async function openConnection(handler: (client: Client) => Promise<unknown>) {
  const client = getClient();
  try {
    await client.connect();
    return await handler(client);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

export const api = {
  async getProductsList() {
    return await openConnection(async (client) => {
      const { rows: productsList } = await client.query(
        'SELECT products.*, stocks.count FROM products LEFT JOIN stocks ON products.id = stocks.product_id'
      );
      return productsList;
    });
  },
  async getProductById(predicateProductId: string) {
    return await openConnection(async (client) => {
      const { rows: product } = await client.query(
        'SELECT p.*, s.count FROM products p LEFT JOIN stocks s ON s.product_id = p.id WHERE id = $1',
        [predicateProductId]
      );
      return product;
    });
  },
};
