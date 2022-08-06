import { Client } from 'pg';
import { IClientProduct, IProductBase } from '../types/api-types';
import createError from 'http-errors';
import format from 'pg-format';

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

async function openConnection<T>(handler: (client: Client) => Promise<T>) {
  const client = getClient();
  try {
    await client.connect();
    return await handler(client);
  } catch (error) {
    console.error(error);
    const clientError = new createError.ServiceUnavailable();
    clientError.expose = true;
    throw clientError;
  } finally {
    await client.end();
  }
}

export const db = {
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
  async createProducts(products: IProductBase[]) {
    return await openConnection<IClientProduct[]>(async (client) => {
      try {
        await client.query('BEGIN');
        const { rows: returnedProducts } = await client.query(
          format(
            'INSERT INTO products (name, description, price, media) VALUES %L RETURNING *',
            products
          )
        );
        const DEFAULT_COUNT = 0;
        await client.query(
          format(
            'INSERT INTO stocks (product_id, count) VALUES %L',
            returnedProducts.map((product) => [product.id, DEFAULT_COUNT])
          )
        );
        await client.query('COMMIT');
        return returnedProducts.map((product) => ({
          ...product,
          count: DEFAULT_COUNT,
        }));
      } catch (error) {
        console.error(error);
        await client.query('ROLLBACK');
        throw error;
      }
    });
  },
};
