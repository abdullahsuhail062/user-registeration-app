import { ChangeDetectorRef, Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule, } from '@angular/material/progress-spinner';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, NgIf, NgStyle } from '@angular/common';
import { HttpClient,} from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { ApiServiceService } from '../api-service.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,MatInputModule,MatProgressSpinnerModule,
    MatInputModule,ReactiveFormsModule,CommonModule,NgIf,MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
@Injectable({providedIn: 'root'})

export class LoginComponent {
  hide: boolean = true
  loginForm: FormGroup
  usernameError: any
  emailError: any
  passwordError: any
  mismatchPasswordsError: any
  generalError: string = ''
  isLoading: boolean = false
  isLoggingIn: boolean = false

  constructor(private cdr: ChangeDetectorRef,private router: Router,private apiService: ApiServiceService, private http: HttpClient){
    this.loginForm = new FormGroup({email: new FormControl('',[Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@example\.(com|org|net)$/)]),password: new FormControl('',[Validators.required,Validators.minLength(8),
        Validators.pattern('^[a-zA-Z0-9]+$'
)]),confirmPassword: new FormControl('',[Validators.required,Validators.minLength(8)])}) 
    }


  
  onSubmit(): void{
   const formData ={
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }
   
    this.passwordsMisMatchValidator()
    if (this.loginForm.valid) {
      this.toggleSpinner()
      
         this.isLoggingIn =true
      this.apiService.loginUser(formData).subscribe({next: (data) => {
      localStorage.setItem('authToken', data.token);
      const token = data.token; // Assume this is the JWT token from backend
      const expiresAt = Date.now() + 3600 * 1000; // Set expiration time to 1 hour from now
      localStorage.setItem('authToken', token);
      localStorage.setItem('expiresAt', expiresAt.toString());
      ;this.router.navigate(['/dashboard']);
      this.isLoggingIn = false
      
    }, error: (error) => {
      
    
      if (error.status===400 && error.error) {
        this.handleError(error.error)}


      
        if (error.status===500) {
          this.isLoading = false
          this.generalErrorFn(error.error)
          
        
        }
      
      
    }
    })}}
   
      
    handleError(errorMessage:any){

      Object.keys(errorMessage).forEach((error:any) => {
       

         
    if (error === 'email') {
      this.emailError = errorMessage.email
      this.loginForm.get('email')?.setErrors({emailErr: this.emailError})
    }

    if (error === 'password') {
      this.passwordError = errorMessage.password
      this.loginForm.get('password')?.setErrors({passwordErr: this.passwordError})
    }
    if (error ==='noUserExist') {
      this.emailError = errorMessage.noUserExist
      this.loginForm.get('email')?.setErrors({emailErr: this.emailError})
      
    }

      
      });
    

      }
      generalErrorFn(error:any){
        this.generalError = error.message
      
      }
  
      passwordsMisMatchValidator():any{
        const password = this.loginForm.get('password')?.value
        const confirmPassword =this.loginForm.get('confirmPassword')?.value
        this.mismatchPasswordsError = 'password do not match'
        return confirmPassword !== password? this.loginForm.get('confirmPassword')?.setErrors({mismatchPasswordsError: this.mismatchPasswordsError}): false
      }
  
       togglePasswordVisibility(): boolean{
      return this.hide= !this.hide
      }
      toggleSpinner(){
       this.isLoading = true
         
    

    }
  }
  
