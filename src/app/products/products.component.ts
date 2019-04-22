import { Component, OnInit, OnDestroy, ɵConsole } from "@angular/core";
import { ProductService } from "../product.service";
import { ActivatedRoute } from "@angular/router";
import { Product } from "../models/product";
import "rxjs/add/operator/switchMap";
import { ShoppingCartService } from "../shopping-cart.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"]
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[];

  category: string;
  cart: any;
  subscription: Subscription;


  constructor(
    route: ActivatedRoute,
    productService: ProductService,
    private shoppingCartService: ShoppingCartService
  ) {

    productService
      .getAll()
      .switchMap(products => {
        this.products = products.map(product => {
          return <Product>{
            title: product.payload.val()["title"],
            category: product.payload.val()["category"],
            imageUrl: product.payload.val()["imageUrl"],
            price: product.payload.val()["price"],
            key: product.key
          };
        });
        return route.queryParamMap;
      })
      .subscribe(params => {
        this.category = params.get("category");
        this.filteredProducts = this.category
          ? this.products.filter(p => p.category === this.category)
          : this.products;
      });
  }

  async ngOnInit() {
    this.subscription = (await this.shoppingCartService.getCart())
      // .valueChanges()
      .subscribe(cart => {
        this.cart = cart;
      });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
