import { ShoppingCartItem } from "./shopping-cart-item";
import { Product } from "./product";

export class ShoppingCart {
  items: ShoppingCartItem[] = [];

  constructor(
    public key: string,
    public itemsMap: { [productId: string]: ShoppingCartItem }
  ) {
    this.itemsMap = itemsMap || {};

    // tslint:disable-next-line:forin
    for (const productId in itemsMap) {
      const item = itemsMap[productId];
      const x = new ShoppingCartItem();
      Object.assign(x, item);
      x.key = productId;
      this.items.push(x);
    }
  }

  getQuantity(product: Product) {
    if (this.itemsMap) {
      const item = this.itemsMap[product.key];
      return item ? item.quantity : 0;
    }
    return 0;
  }

  get totalItemsCount() {
    let count = 0;
    for (const productId in this.itemsMap) {
      if (this.itemsMap[productId].quantity) {
        count += this.itemsMap[productId].quantity;
      }
    }
    return count;
  }

  get totalPrice() {
    const sum: number = this.items.reduce(
      (total, amount) => total + amount.totalPrice,
      0
    );
    return sum;
  }
}
