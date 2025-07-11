import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private formBuilder = inject(FormBuilder);
  
  forgotPasswordForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private httpService: HttpService) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const email = this.forgotPasswordForm.value.email;

      this.httpService.sendPasswordResetMail(this.forgotPasswordForm.getRawValue()).subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (error: any) => {
          console.log(error);
        }
      })

      // setTimeout(() => {
      //   this.isLoading = false;
      //   // Simulate successful response
      //   this.successMessage = `Password reset link has been sent to ${email}. Please check your inbox.`;
      //   this.forgotPasswordForm.reset();
      // }, 2000);
    }
  }

}
