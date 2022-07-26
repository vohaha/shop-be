export interface IProductBase {
  name: string;
  description: string;
  price: number;
  media: string;
}

export interface IProduct extends IProductBase {
  id: string;
}

export interface IStock {
  product_id: IProduct['id'];
  count: number;
}

export type ProductsList = IProduct[];
export type StocksList = IStock[];

export interface IClientProduct extends IProduct, Omit<IStock, 'product_id'> {}

export type IClientProductsList = IClientProduct[];
