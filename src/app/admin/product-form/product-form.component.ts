import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/category.service';
import { ProductService } from 'src/app/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories$;
  product = {};
  id;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
    ) {

    this.categories$ = categoryService.getAll();

    this.id = this.route.snapshot.paramMap.get("id");

    if (this.id) {
      this.productService.get(this.id). subscribe(p => this.product = p);
    }

  }

  ngOnInit() {
  }

  async save(product) {
    if (this.id) {
      await this.productService.update(this.id, product);
    } else {
      await this.productService.create(product);
    }
    this.router.navigate(["/admin/products"]);
  }

  async delete() {
    if (confirm("Are you sure you want to delete this product?")) {
      await this.productService.delete(this.id);
      this.router.navigate(["/admin/products"]);
    }
  }



}
