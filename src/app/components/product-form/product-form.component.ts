import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [MatFormFieldModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {

  productForm: FormGroup;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: [''],
      price: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = id;
      this.productService.getproduct(id).subscribe(product => {
        this.productForm.patchValue(product);
      });
    }
  }

  saveProduct() {
    if (this.productId != null) {
      this.productService.updateProduct(this.productId, this.productForm.value).subscribe(() => {
        this.router.navigate(['/products']);
      });
      /*if (this.productId != null) {
        this.productService.updateProduct({ ...this.productForm.value, id: this.productId }).subscribe(() => {
          this.router.navigate(['/products']);
        });*/
    } else {
      this.productService.addProduct(this.productForm.value).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }
}
