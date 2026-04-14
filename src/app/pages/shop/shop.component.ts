import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent { }
