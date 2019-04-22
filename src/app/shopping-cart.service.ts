import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";
import { Product } from "./models/product";
import { take, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ShoppingCart } from "./models/shopping-cart";

@Injectable({
  providedIn: "root"
})
export class ShoppingCartService {
  constructor(private db: AngularFireDatabase) {}

  private create() {
    return this.db.list("shopping-carts").push({
      dateCreated: new Date().getTime()
    });
  }

  async getCart(): Promise<Observable<ShoppingCart>> {
    const cartId  = await this.getOrCreateCartId();
    return this.db.object(`/shopping-carts/${cartId}`).snapshotChanges()
      .pipe(
        map((x: any) => {
          return new ShoppingCart(x.payload.val().items);
        }
      ));
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

  async addToCart(product: Product) {
    this.updateItemQuantity(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItemQuantity(product, -1);
  }

  private async updateItemQuantity(product: Product, change: number) {
    const cartId = await this.getOrCreateCartId();
    const item$ = await this.getItem(cartId, product.key);
    item$
      .snapshotChanges()
      .pipe(take(1))
      .subscribe((item: any) => {
        item$.update({
          product: product,
          quantity: ((item.payload.exists() && item.payload.val().quantity) || 0) + change
        });
      });
  }

}
