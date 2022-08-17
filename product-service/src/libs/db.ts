import { Client } from 'pg';
import { IClientProduct, IProductBase } from '../types/api-types';
import createError from 'http-errors';

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

function nestedArraysQueryValue(flatValues, valueLength) {
  let valueIndex = 0;
  return flatValues
    .reduce((acc, _, index) => {
      if (index % valueLength === 0 && index !== 0) {
        valueIndex++;
      }
      if (acc[valueIndex] == null) {
        acc[valueIndex] = [];
      }
      acc[valueIndex].push(`$${index + 1}`);
      return acc;
    }, [])
    .map((value) => `(${value.join(',')})`)
    .join(', ');
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
        const productsValue = products.flatMap((product) => [
          product.name,
          product.description,
          product.price,
          product.media,
        ]);
        const productsQueryValues = nestedArraysQueryValue(productsValue, 4);
        const { rows: returnedProducts } = await client.query(
          `INSERT INTO products (name, description, price, media) VALUES ${productsQueryValues} RETURNING *`,
          productsValue
        );
        const DEFAULT_COUNT = 0;
        const stocksValue = returnedProducts.flatMap((product) => [
          product.id,
          DEFAULT_COUNT,
        ]);
        const stocksQueryValues = nestedArraysQueryValue(stocksValue, 2);
        await client.query(
          `INSERT INTO stocks (product_id, count) VALUES ${stocksQueryValues}`,
          stocksValue
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
