import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OnlineItemService } from 'src/app/services/registration/online-item.service';

interface OnlineItem {
  id: any;
  name: string;
  image:String;
  imageType: String;
  price:String;
  imageUrl?: string;
}

@Component({
  selector: 'app-shopping-cart',
  standalone: false,
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent implements OnInit{
    onlineItems: OnlineItem[] = [];
     selectedImageUrl!: SafeUrl | null;
  
    constructor(
      private onlineItemService: OnlineItemService
    ) {}
  
    ngOnInit(): void{
      this.onlineItemService.getData().subscribe((data: any) => {
        this.onlineItems = data.map((item: any) => ({
      ...item,
      imageUrl: `data:${item.imageType};base64,${item.image}`
    }));
  
      });
    }

    addToCart(item: OnlineItem) {
    console.log('Added to cart:', item);
    // Implement cart logic here
    }
  
}
