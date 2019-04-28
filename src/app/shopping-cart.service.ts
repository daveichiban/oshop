import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";
import { Product } from "./models/product";
import { take, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ShoppingCart } from "./models/shopping-cart";
import { ShoppingCartItem } from "./models/shopping-cart-item";

@Injectable({
  providedIn: "root"
})
export class ShoppingCartService {
  constructor(private db: AngularFireDatabase) {}

  async getCart(): Promise<Observable<ShoppingCart>> {
    const cartId = await this.getOrCreateCartId();
    return this.db
      .object("/shopping-carts/" + cartId)
      .snapshotChanges()
      .map(action => {
        const key = action.key;
        const items = action.payload.val().items;
        return new ShoppingCart(key, items);
      });
  }

  async addToCart(product: Product) {
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }

  async clearCart() {
    const cartId = await this.getOrCreateCartId();
    this.db.object(`shopping-carts/${cartId}/items`).remove();
  }

  private create() {
    return this.db.list("shopping-carts").push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId: string, productId: string) {
    const item$ = this.db.object(
      `/shopping-carts/${cartId}/items/${productId}`
    );
    return item$;
  }

  private async getOrCreateCartId() {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) {
      const result = await this.create();
      localStorage.setItem("cartId", result.key);
      return result.key;
    }
    return cartId;
  }

  private async updateItem(product: Product, change: number) {
    const cartId = await this.getOrCreateCartId();
    const item$ = await this.getItem(cartId, product.key);
    item$
      .snapshotChanges()
      .pipe(take(1))
      .subscribe((item: any) => {
        const quantity = ((item.payload.exists() && item.payload.val().quantity) || 0) + change;
        if (quantity === 0) {
          item$.remove();
        } else {
        item$.update({
          title: product.title,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: quantity
        });
      }
    });
  }

}
