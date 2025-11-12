import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TableModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Davivienda Marketplace';

  products: Product[] = [
    { id: 1, name: 'Smartphone Samsung Galaxy S24', category: 'Tecnología', price: 3299000 },
    { id: 2, name: 'Smart TV LG 55" 4K', category: 'Electrodomésticos', price: 2199000 },
    { id: 3, name: 'Laptop HP Pavilion 15"', category: 'Tecnología', price: 2899000 },
    { id: 4, name: 'Nevera LG 420L', category: 'Electrodomésticos', price: 1899000 },
    { id: 5, name: 'Audífonos Sony WH-1000XM5', category: 'Tecnología', price: 1299000 },
    { id: 6, name: 'Aire Acondicionado Samsung 12000 BTU', category: 'Electrodomésticos', price: 1499000 },
    { id: 7, name: 'Consola PlayStation 5', category: 'Tecnología', price: 2599000 },
    { id: 8, name: 'Lavadora Samsung 18Kg', category: 'Electrodomésticos', price: 1699000 }
  ];

  onButtonClick() {
    alert('PrimeNG Button clicked!');
  }
}
