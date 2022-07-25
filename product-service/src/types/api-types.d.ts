export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  media: string;
}

export type ProductsList = IProduct[];
