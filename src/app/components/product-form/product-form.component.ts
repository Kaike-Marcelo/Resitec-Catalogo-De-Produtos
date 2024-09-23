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
import { MatSnackBar } from '@angular/material/snack-bar';

import { BrowserModule } from '@angular/platform-browser';

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
    private router: Router,
    private snackBar: MatSnackBar
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
    formValue.price = this.parseCurrency(formValue.price);
    if (this.productId != null) {
      this.productService.updateProduct(this.productId, this.productForm.value).subscribe(() => {
        this.router.navigate(['/products']);
        this.snackBar.open('Produto atualizado com sucesso!', 'x', {
          duration: 3000,
        });
      });
    } else {
      this.productService.addProduct(this.productForm.value).subscribe(() => {
        this.router.navigate(['/products']);
        this.snackBar.open('Produto adicionado com sucesso!', 'x', {
          duration: 3000,
        });
      });
    }
  }

  // Método para converter o valor do campo de preço para salvar no banco
  private parseCurrency(value: string): string {
    const numberValue = parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.'));
    return numberValue.toFixed(2);
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
    if (!value) return '';
    value = value.replace(/\D/g, '');
    const numberValue = parseFloat(value) / 100;
    if (isNaN(numberValue)) return '';

    return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
