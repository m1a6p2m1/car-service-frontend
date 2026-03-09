import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailValidator, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CacheService } from 'src/app/services/CacheService';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { UserProfileService } from 'src/app/services/user-profile/user-profile.service';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit{
  
  userProfileForm: FormGroup;

  isButtonDisable = false;
  submitted = false;
  selectedImageUrl!: SafeUrl | null;
  isFileSelected = false;
  fileButtonDisable = false;
  selectedData!: { id: number };

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private userProfileService: UserProfileService,
    private messageService:MessageServiceService,
    private cacheService: CacheService,
    private localStorage: LocalStorageService
  ){
    this.userProfileForm = this.fb.group({
      id: new FormControl(null),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      // login: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      phoneNumber: new FormControl('', [Validators.pattern('^(\\+94|0)[1-9]{2}[0-9]{7}$|^(\\+94|0)?7[0-9]{8}$')]),
      image: new FormControl('', [Validators.required]),
      imageName: new FormControl(''),
      imageType: new FormControl(''),
    });
  }

  ngOnInit(): void {
    // this.populateData();

    this.loadUserProfile();

  
  }

  get formControl() {
    return this.userProfileForm?.controls;
  }

  public prepareProfileData(): FormData {
    const userProfileFormData = new FormData();
    // demoFormData.append('demoForm', this.demoForm.value);
    userProfileFormData.append(
      'userProfileForm',
      new Blob([JSON.stringify(this.userProfileForm.value)], {
        type: 'application/json',
      })
    );

    if (this.isFileSelected) {
      userProfileFormData.append(
        'image',
        this.userProfileForm.get('image')?.value,
        this.userProfileForm.get('image')?.value.name
      );
    } else {
      const imageBlob = this.base64ToBlob(
        this.userProfileForm.get('image')?.value,
        this.userProfileForm.get('imageType')?.value
      );
      const file = new File(
        [imageBlob],
        this.userProfileForm.get('imageName')?.value,
        { type: this.userProfileForm.get('imageType')?.value }
      );
      userProfileFormData.append('image', file, file.name);
      this.fileButtonDisable = false;
    }
    return userProfileFormData;
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  public onFileSelected(event: any): void {
    if (event.target.files) {
      const file = event.target.files[0];
      const url = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(file)
      );
      this.selectedImageUrl = url;
      this.isFileSelected = true;
      this.userProfileForm.get('image')?.setValue(file);
    }
  }


  public editProfile(): void {
    const id = this.userProfileForm.get('id')?.value;
    console.log('Form ID:', this.userProfileForm.get('id')?.value);
    if (!id) {
      this.messageService.showError("User ID is missing. Cannot update profile.");
      return;
    }
    
    this.userProfileService.editProfile(id, this.prepareProfileData()).subscribe({
        next:(response)=>{
          console.log('server response:' ,response)
          this.messageService.showSuccess('Data Edited Successfully !');
        },
        error:(error) => {
          this.messageService.showError('Action Failed with Error :'+ error); 
        }
    });
  }


  loadUserProfile(): void {
    this.userProfileService.getLoggedInUserDetails().subscribe({
      next: (user: any) => {
        this.userProfileForm.patchValue({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber
        });
        console.log("Form ID:", this.userProfileForm.get('id')?.value);
        console.log("Form Email:", this.userProfileForm.get('email')?.value);
        console.log("Form PN:", this.userProfileForm.get('phoneNumber')?.value);
        // this.selectedData = response;
  
        // Load and show user image from local storage or API
        if (user.image && user.imageType) {
        this.selectedImageUrl =
          this.sanitizer.bypassSecurityTrustUrl(
            `data:${user.imageType};base64,${user.image}`
          );

        this.userProfileForm.patchValue({
          imageName: user.imageName,
          imageType: user.imageType
        });
      }
        // const image = this.localStorage.getItem('image');
        // const imageType = this.localStorage.getItem('imageType');
        // if (image && imageType) {
        //   this.selectedImageUrl = `data:${imageType};base64,${image}`;
        // }
        // this.userProfileForm.disable();
        // this.isButtonDisable = true;
        // this.fileButtonDisable = true;
      },
      error: (error) => {
        console.error('Failed to load user profile:', error);
      }
    });
  }


}
