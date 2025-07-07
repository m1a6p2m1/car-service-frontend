import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserProfileComponent } from 'src/app/pages/user-profile/user-profile.component';
import { CacheService } from 'src/app/services/CacheService';
import { HttpService } from 'src/app/services/http.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { UserProfileService } from 'src/app/services/user-profile/user-profile.service';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: Date;
  readStatus: boolean;
  targetUser?: number;
  other?: string;
  email?: string;
  mobile?: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class AppHeaderComponent implements OnInit {
  selectedImageUrl!: SafeUrl | null;
  showDropdown = false;
  notifications: Notification[] = [];
  unreadCount = 0;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private cacheService: CacheService,
    private userProfileService: UserProfileService,
    private localStorage: LocalStorageService,
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();

    this.notificationService.getNotifications().subscribe({
      next: (notifications: any) => {
        console.log(notifications);
        this.notificationService.addNotificationToBell(notifications);
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
      this.unreadCount = notifications.filter((n) => !n.readStatus).length;
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (
        !event.target ||
        !(event.target as Element).closest('.notification-bell')
      ) {
        this.showDropdown = false;
      }
    });
  }

  public logOutUser(): void {
    this.cacheService.clear(this.httpService.getUserId()!);
    this.httpService.removeToken();
    this.router.navigate(['']);
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

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  markAsRead(notificationId: string) {
    this.notificationService.markAsRead(notificationId);
  }

  markAllAsRead() {
    this.notifications.forEach((notification) => {
      if (!notification.readStatus) {
        this.notificationService.markAsRead(notification.id);
      }
    });
  }

  getRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }
}
