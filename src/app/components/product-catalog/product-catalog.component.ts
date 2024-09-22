import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule],
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.css'
})
export class ProductCatalogComponent implements OnInit {

  products: Product[] = []
  displayedColumns: string[] = ['name', 'price'];

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data
    });
  }

  deleteProduct(id: number) {
    const confirmed = confirm("Você tem certeza que deseja excluir este produto?");
    if (confirmed) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.products = this.products.filter(product => product.id !== id);
        this.snackBar.open('Produto excluído com sucesso!', 'X', {
          duration: 3000,
        });
      });
    }
  }

  isValidPrice(price: any): boolean {
    return price != null && price != undefined && !isNaN(price);
  }
}
