import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnlineItemService } from 'src/app/services/registration/online-item.service';

interface OnlineItem {
  id: any;
  name: string;
  image:String;
  imageType: String;
  price:String;
  imageUrl?: String;
  description: String;
}

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit{
  productId!: number;
  item: any;

  onlineItems: OnlineItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private onlineItemService: OnlineItemService,
  ){}

ngOnInit(): void {
  this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.getProductDetails();
}

getProductDetails() {
    this.onlineItemService.getItemById(this.productId).subscribe({
      next: (data) => {
      const item = data as OnlineItem;
      this.item = {
        ...item,
        imageUrl: `data:${item.imageType};base64,${item.image}`
      };
      },
      error: (err) => {
        console.error('Failed to load item:', err);
      }
    });
  }

quantity: number = 1;

increaseQuantity() {
  this.quantity++;
}

decreaseQuantity() {
  if (this.quantity > 1) {
    this.quantity--;
  }
}

}
