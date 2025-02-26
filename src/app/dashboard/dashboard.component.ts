import { Component, inject, NgModule, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { ApiServiceService } from '../api-service.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgClass, NgIf } from '@angular/common';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';
import { SharedService } from '../shared.service';
import { error } from 'node:console';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { response } from 'express';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatToolbarModule,NgIf,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  profileInitial: string =''
  userPrompt: string = ''
  email: any
  showWelcomeMessage: boolean = false;
  constructor(private sharedService: SharedService,private router: Router, private authservice: AuthService, private dialog: MatDialog, private apiService: ApiServiceService){}
  ngOnInit(): void {
    this.greetUser()
    this.apiService.fetchUserProfile().subscribe({next: (data)=>{
      this.profileInitial = data.email.charAt(0).toUpperCase(); },error:(error)=>{this.handleError(error)}})
      this.sharedService.taskTriggered$.subscribe(()=>{this.openDeleteAccountDialog()})
    }
   
    
      
     
  
  
  logout(){
    this.authservice.logout()
    this.router.navigate(['/login'])
    this.dialog.closeAll()
  }

  dashboard(){
    this.router.navigate(['/dashboard'])
    this.dialog.closeAll()


  }
  confirmDelete(){
    this.apiService.deleteAccount().subscribe({next:
      (response) => {
        this.authservice.deleteToken()
        this.router.navigate(['/login'])
        this.dialog.closeAll()
        console.log('Account deleted successfully');
        // Perform any necessary clean-up or redirect
      },
     error: (error) => {
        this.handleError(error)
      }}
    );
  }

  

  closeAllDialog(){
    this.dialog.closeAll()
  }
  
 
  openDeleteAccountDialog(){
   const dialogRef= this.dialog.open(DeleteAccountDialogComponent,{position:{right:'0px'},width: '400px',data:{onConfirmDelete: ()=> this.confirmDelete(), onCloseAll: ()=> this.closeAllDialog()}})
      dialogRef.afterClosed().subscribe((result)=>{
        if (result ==='confirm') {
          this.confirmDelete()
         


          
  }
      })

  
  }
  onAddAnOtherAccont(){
    this.dialog.closeAll()
    this.authservice.logout()
    this.router.navigate(['/login'])
  }
   
  
  openProfileDialog(): void{
    const dialogConfig = new MatDialogConfig
    dialogConfig.height = '400px'
    this.apiService.fetchUserProfile().subscribe({next: (userdata)=>{
      this.dialog.open(UserProfileComponent,{position: {top: '55px', right: '0px'},width: '180px', panelClass: 'custom-dialog',data:{username: userdata.username, email: userdata.email, onLogout: () => this.logout(), onNavigateToDashboard: () => this.dashboard(), onOpenDeleteAccountDialog: ()=> this.openDeleteAccountDialog(),onAddingAnotherAccount: ()=> this.onAddAnOtherAccont()}})
    }, error: (error)=>{this.handleError(error)
    }})
  
}
  greetUser(){
    const isWelcomed = localStorage.getItem('isWelcomed');
    
    if (isWelcomed === 'false') {
      this.showWelcomeMessage = true; // Show the welcome message
      // Update the flag to avoid showing it again
      localStorage.setItem('isWelcomed', 'true');
    }
  }
  navigateToDoList(){
    this.router.navigate(['/ToDoList'])
  }

  handleError(error:any){
    console.log(error.error);
    
  }

  navigateToCalculator(){
    this.router.navigate(['/calculator'])
  }

  backToHome(){
    this.router.navigate(['/dashboard'])
  }
  sendRequest(){
    this.apiService.getCompletion(this.userPrompt).subscribe({next: (response)=>{response}
  })


  }}








   
    
  
    
  


