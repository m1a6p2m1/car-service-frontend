import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CacheService } from 'src/app/services/CacheService';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
})
export class AppHeaderComponent {
  constructor(
    private httpService: HttpService,
    private router: Router,
    private cacheService: CacheService
  ) {}

  public logOutUser(): void {
    this.cacheService.clear(this.httpService.getUserId()!);
    this.httpService.removeToken();
    this.router.navigate(['/authentication/login']);
  }
}
