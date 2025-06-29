import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-items/menu-items';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CacheService } from 'src/app/services/CacheService';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    DemoMaterialModule,
    NgFor,
    NgIf,
    RouterModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: [],
  styles: [`
    .group-header {
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-top:30px;
      margin-bottom:30px;
    }

    .group-title {
      margin-left: 8px;
      font-weight: 500;
    }

    .expand-icon {
      margin-left: auto;
    }
  `]
})
export class AppSidebarComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  navItems!: any[];
  data!: number[];
  private cacheSubscription!: Subscription;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private cacheService: CacheService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.cacheSubscription = this.cacheService.cache$.subscribe((data) => {
      this.data = data;

      this.setAuthStatusInNavItems(this.data);
      console.log(this.navItems);
    });
  }

  public setAuthStatusInNavItems(authId: number[]) {
    this.navItems = this.menuItems.getMenuitem();
    if (authId && authId.length > 0) {
      if (authId.includes(1)) {
        this.navItems.forEach((element) => {
          element.isVisible = true;
        });
        return;
      }

      this.navItems.forEach((element) => {
        if (authId.includes(element.auth!)) {
          element.isVisible = true;
        } else {
          element.isVisible = false;
        }
      });
    } else if (
      JSON.parse(window.localStorage.getItem('privileges')!)?.length! > 0
    ) {
      const privilegeArray = JSON.parse(
        window.localStorage.getItem('privileges')!
      );

      if (privilegeArray.includes(1)) {
        this.navItems.forEach((element) => {
          element.isVisible = true;
        });
        return;
      }

      this.navItems.forEach((element) => {
        if (privilegeArray.includes(element.auth!)) {
          element.isVisible = true;
        } else {
          element.isVisible = false;
        }
      });
    } else if (authId && authId.length === 0) {
      this.navItems.forEach((element) => {
        element.isVisible = false;
      });
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  collapsedGroups: { [key: string]: boolean } = {};

  toggleGroup(name: string): void {
  this.collapsedGroups[name] = !this.collapsedGroups[name];
  }

}
