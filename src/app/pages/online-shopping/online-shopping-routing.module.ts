import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

export const OnlineShoppingRoutes: Routes = [
  {
      path: '',
      children: [
        {
          path: 'product-list',
          component: ProductListComponent,
        },
        {
          path: 'product-detail/:id',
          component: ProductDetailComponent,
        },
      ],
    },
];
