import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-items/menu-items';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CacheService } from 'src/app/services/CacheService';
import { Subscription } from 'rxjs';
import { authenticationEnum } from 'src/app/guards/auth.enum';
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
  styleUrl: './sidebar.component.scss'
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
    this.loadUserName();
    this.cacheSubscription = this.cacheService.cache$.subscribe((data) => {
      this.data = data;

      this.setAuthStatusInNavItems(this.data);
      // console.log(this.navItems);
    });
  }

  public setAuthStatusInNavItems(authId: number[]) {
    this.navItems = this.menuItems.getMenuitem();
    if (authId && authId.length > 0) {
      if (authId.includes(1)) {
        // this.navItems.forEach((element) => {
        //   element.isVisible = true;
        // });

        for (let i = 0; i < this.navItems.length; i++) {
          if (this.navItems[i].type === 'group') {
            this.navItems[i].isVisible = true;
          }

          if (this.navItems[i].children.length && this.navItems[i].children.length > 0) {
            this.navItems[i].children.forEach((child: any) => {
              child.isVisible = true;
            })
          }
        }


        return;
      }

      this.navItems.forEach((element) => {
        // if (authId.includes(element.auth!)) {
        //   element.isVisible = true;
        // } else {
        //   element.isVisible = false;
        // }



        if (element.type == 'group') { /* Parent */
          // element.auth.forEach((authEnum: authenticationEnum) => {
          //   if (authId.includes(authEnum)) {
          //     element.isVisible = true;
          //   } else {
          //     element.isVisible = false;
          //   }
          // })

          if (element.children && element.children.length > 0) {
            element.children.forEach((child: any) => {
              if (authId.includes(child.auth)) {
                child.isVisible = true;
              } else {
                child.isVisible = false;
              }
            });
          }

          for (let i = 0; i < element.auth.length; i++) {
              if (authId.includes(element.auth[i])) {
                element.isVisible = true;
                break;
              } else {
                element.isVisible = false;
              }
          }
        }
      });
    } else if (
      JSON.parse(window.localStorage.getItem('privileges')!)?.length! > 0
    ) {
      const privilegeArray = JSON.parse(
        window.localStorage.getItem('privileges')!
      );

      if (privilegeArray.includes(1)) {
        // this.navItems.forEach((element) => {
        //   element.isVisible = true;
        // });

        for (let i = 0; i < this.navItems.length; i++) {
          if (this.navItems[i].type === 'group') {
            this.navItems[i].isVisible = true;
          }

          if (this.navItems[i].children.length && this.navItems[i].children.length > 0) {
            this.navItems[i].children.forEach((child: any) => {
              child.isVisible = true;
            })
          }
        }

        return;
      }

      // this.navItems.forEach((element) => {
      //   if (privilegeArray.includes(element.auth!)) {
      //     element.isVisible = true;
      //   } else {
      //     element.isVisible = false;
      //   }
      // });

      this.navItems.forEach((element) => {
        if (element.type == 'group') { /* Parent */
          if (element.children && element.children.length > 0) {
            element.children.forEach((child: any) => {
              if (privilegeArray.includes(child.auth)) {
                child.isVisible = true;
              } else {
                child.isVisible = false;
              }
            });
          }

          for (let i = 0; i < element.auth.length; i++) {
              if (privilegeArray.includes(element.auth[i])) {
                element.isVisible = true;
                break;
              } else {
                element.isVisible = false;
              }
          }
        }
      });
    } else if (authId && authId.length === 0) {
      // this.navItems.forEach((element) => {
      //   element.isVisible = false;
      // });

      for (let i = 0; i < this.navItems.length; i++) {
          if (this.navItems[i].type === 'group') {
            this.navItems[i].isVisible = false;
          }

          if (this.navItems[i].children.length && this.navItems[i].children.length > 0) {
            this.navItems[i].children.forEach((child: any) => {
              child.isVisible = false;
            })
          }
        }
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  collapsedGroups: { [key: string]: boolean } = {};

  toggleGroup(name: string): void {
  this.collapsedGroups[name] = !this.collapsedGroups[name];
  }

  loggedUserName: string = '';

  loadUserName(): void {
  const firstName = localStorage.getItem('firstName') || '';
  const lastName = localStorage.getItem('lastName') || '';
  this.loggedUserName = `${firstName} ${lastName}`.trim();
  }

}
