import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  HttpClientModule,
  HttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
  provideHttpClient,
} from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';

import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';

import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { ToastrModule } from 'ngx-toastr';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { FrontPageComponent } from './front-page/front-page/front-page.component';
import { TaskTrackerComponent } from './task-tracker/task-tracker.component';

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    FrontPageComponent,
    TaskTrackerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    AppSidebarComponent,
    ToastrModule.forRoot(),
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
