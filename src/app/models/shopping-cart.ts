import { ShoppingCartItem } from "./shopping-cart-item";

export class ShoppingCart {

    constructor(public items: ShoppingCartItem[]) {

    }

    get totalItemsCount() {
        let count = 0;
        for (const productId in this.items) {
          if (this.items[productId].quantity ) {
            count += this.items[productId].quantity;
            console.log(count);
          }
        }
        return count;
    }
}
