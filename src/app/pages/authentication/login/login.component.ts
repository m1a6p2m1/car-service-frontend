import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { CacheService } from 'src/app/services/CacheService';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RsaService } from 'src/app/services/rsa-service/rsa.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class AppSideLoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  userNamePasswordError = false;

  data!: any[];
  private cacheSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private cacheService: CacheService,
    private _messageService: MessageServiceService,
    private localStorage: LocalStorageService,
    private rsaService: RsaService
  ) {
    this.loginForm = this.formBuilder.group({
      loginName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cacheSubscription = this.cacheService.cache$.subscribe((data) => {
      this.data = data;
    });
  }

  getData(userId: number): void {
    const cachedData = this.cacheService.get(userId.toString());

    // If the data is not in cache, we retrieve it from the server and store it in the cache.
    if (!cachedData) {
      this.httpService
        .getAuthIds(userId)
        .then((data: any) => {
          try {
            if (data.length > 0) {
              this.cacheService.set(userId.toString(), data);
              this.router.navigate(['/dashboard']);
            } else {
              this._messageService.showError('User does not have privileges');
            }
          } catch (error) {
            this._messageService.showError('Action Failed');
          }
        })
        .catch((error) => {
          this._messageService.showError('Action Failed');
        });
    }
  }

  get formControl() {
    return this.loginForm?.controls;
  }

  onSubmitLogin(): void {
    this.submitted = true;
    if (this.loginForm?.valid) {
      this.httpService
        .request('POST', '/login', {
          login: this.loginForm.value.loginName,
          password: this.rsaService.encrypt(this.loginForm.value.password),
        })
        .then((response) => {
          if (response && response.id) {
            // set required data to http service
            this.httpService.setAuthToken(response.token);
            this.httpService.setUserId(response.id);
            this.httpService.setLoginNameToCache(response.login);

            // set data to local storage
            this.setUserInfotoLocalStorage(response);

            this.getData(response.id);
          }
        })
        .catch((error) => {
          this.userNamePasswordError = true;
        });
    }
  }

  setUserInfotoLocalStorage(userData: any) {
    this.localStorage.setItem('id', userData.id);
    this.localStorage.setItem('firstName', userData.firstName);
    this.localStorage.setItem('lastName', userData.lastName);
    this.localStorage.setItem('login', userData.login);
    this.localStorage.setItem('password', userData.password);
    this.localStorage.setItem('image', userData.image);
    this.localStorage.setItem('imageName', userData.imageName);
    this.localStorage.setItem('imageType', userData.imageType);
    this.localStorage.setItem('employeeId', userData.employeeId);

  }
}
