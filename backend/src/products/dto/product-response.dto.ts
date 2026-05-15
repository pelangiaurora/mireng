export class ProductResponseDto {
  id: string;

  name: string;

  images: any[];

  description: string;

  price: number;

  isActive: boolean;

  createdAt: Date;

  seller: {
    id: string;
    name: string;
  };

  constructor(product: any) {
    this.id = product.id;

    this.name = product.name;

    this.images = product.images;

    this.description =
      product.description;

    this.price = Number(product.price);

    this.isActive =
      product.isActive;

    this.createdAt =
      product.createdAt;

    this.seller = {
      id: product.seller?.id,
      name: product.seller?.name,
    };
  }
}