import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
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
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  onlineItems: OnlineItem[] = [];
  selectedImageUrl!: SafeUrl | null;
  searchText: string = '';
  filteredList: any[] = [];
  item: any;
    
  constructor(
    private onlineItemService: OnlineItemService,
    private router: Router,
  ) {}    
    
  ngOnInit(): void{
    this.onlineItemService.getData().subscribe((data: any) => {
    this.onlineItems = data.map((item: any) => ({
    ...item,
    imageUrl: `data:${item.imageType};base64,${item.image}`
    })
    );
    this.filteredList = this.onlineItems;
    });    
  }    
  
      addToCart(item: OnlineItem) {
      console.log('Added to cart:', item);
      // Implement cart logic here
      }
  
  applyFilter() {
    if (!this.searchText) {
      this.filteredList = this.onlineItems;
    } else {
      const lower = this.searchText.toLowerCase();
      this.filteredList = this.onlineItems.filter(item =>
        item.name.toLowerCase().includes(lower)
      );
    }
  }

  public openProductDetails(item: any): void {
    this.router.navigate(['/online-shopping/product-detail', item.id]);
  }  
}
