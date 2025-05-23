import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserProfileComponent } from 'src/app/pages/user-profile/user-profile.component';
import { CacheService } from 'src/app/services/CacheService';
import { HttpService } from 'src/app/services/http.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserProfileService } from 'src/app/services/user-profile/user-profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
})
export class AppHeaderComponent implements OnInit{
  selectedImageUrl!: SafeUrl | null;

    
  constructor(
    private httpService: HttpService,
    private router: Router,
    private cacheService: CacheService,
    private userProfileService: UserProfileService,
    private localStorage: LocalStorageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  public logOutUser(): void {
    this.cacheService.clear(this.httpService.getUserId()!);
    this.httpService.removeToken();
    this.router.navigate(['/authentication/login']);
  }

  loadUserProfile(): void {
    let userImage = this.localStorage.getItem('image');
    let userImageType = this.localStorage.getItem('imageType');
    if (userImage && userImageType) {
        const unsafeUrl = `data:${userImageType};base64,${userImage}`;
        this.selectedImageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeUrl);
    } else {
        this.selectedImageUrl = 'assets/images/item/men_logo.png';
    }
  }

  public openUserProfile(): void {
    this.router.navigate(['/pages/user-profile']);
  }

  
}
