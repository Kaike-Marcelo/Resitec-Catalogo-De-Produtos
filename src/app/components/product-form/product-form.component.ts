import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, formatCurrency } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DirectivesModule } from '../../directives/directives.module';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    DirectivesModule],
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
      name: ['', Validators.required],
      price: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = id;
      this.productService.getproduct(id).subscribe(product => {
        this.productForm.patchValue(product);
        this.formatPriceField();
      });
    }
  }

  saveProduct() {
    if (this.productForm.invalid) {
      return;
    }

    const formValue = this.productForm.value;
    formValue.price = this.parseCurrency(formValue.price).toString();
    if (this.productId != null) {
      this.productService.updateProduct(this.productId, this.productForm.value).subscribe(() => {
        this.router.navigate(['/products']);
      });
    } else {
      this.productService.addProduct(this.productForm.value).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }

  // Método para converter o valor do campo de preço para salvar no banco
  private parseCurrency(value: string): number {
    return parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.'));
  }

  // Método para formatar o valor do campo de preço para a Interface
  private formatPriceField() {
    const priceControl = this.productForm.get('price');
    if (priceControl) {
      const formattedValue = this.formatCurrency(priceControl.value)
      priceControl.setValue(formattedValue, { emitEvent: false });
    }
  }

  // Método para formatar o valor como moeda
  private formatCurrency(value: string): string {
    value = value.replace(/\D/g, '');
    const numberValue = parseFloat(value) / 100;
    return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
