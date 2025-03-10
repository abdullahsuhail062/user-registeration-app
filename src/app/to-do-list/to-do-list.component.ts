import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, inject, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
 import{MatToolbarModule} from '@angular/material/toolbar'
 import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiServiceService } from '../api-service.service';
import { MatList, MatListItem, MatListModule } from '@angular/material/list';
import { title } from 'node:process';
import { AuthService } from '../auth.service';
import { error } from 'node:console';
import { Route } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';


 
@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [NgIf,MatToolbarModule, MatDialogContent,FormsModule,NgClass,NgFor,MatListItem,MatList],
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.scss'
})
export class ToDoListComponent implements OnInit{
titleErrorChecking: boolean=false
titleError: string = ''
isDisabled: boolean = true 
isEditing: boolean = false
title:any
isChecked:boolean =false
description:any
taskTitleInput: string = ''
taskDescriptionInput: string = ''
isDeactive: boolean = true
isActive: boolean = false
items: { title: string; description: string, isEditing: boolean, completed: boolean }[] =[]
dialogRef: any
listItem:any
taskId: any
isLoading: boolean =true
isTaskExist: boolean= false
  constructor(private cdr: ChangeDetectorRef,private router: Router,private authService: AuthService,private dialog: MatDialog, private apiService: ApiServiceService ){}
 ngOnInit(): void {
  const token =this.authService.getToken()
    this.apiService.getTasks(token).subscribe({next:(tasks)=>{
    
      if (tasks) { 
      this.items = tasks
        this.isLoadingStatus()
        this.isTaskExistStatus()
      } if (!tasks){
        this.items = []; // Assign empty array if tasks is null/undefined
        this.isLoadingStatus()
        this.isTaskExistStatus()
      }
      this.cdr.detectChanges();
    },
    error:(
      error)=>{this.handleTaskFetchingError(error)}})
  
 }
 handleTaskFetchingError(error: any){
  console.error(error.error.error);
  
  
 }

  openDialog(templateRef: TemplateRef<any>): void{
     this.dialogRef = this.dialog.open(templateRef,{position:{top:'4%', left: '11%'},height: '250px'})
     
  }

  createTaskTittle(){
    
     if (this.taskTitleInput.trim().length>0 &&this.taskDescriptionInput.trim().length>0 ) {
      this.isDisabled = false
      this.isActive = true

  }else {this.isDeactive =true
        this.isActive = false
  }
    
  }

  createTaskDescription(){
    if (this.taskDescriptionInput.trim().length>0 && this.taskTitleInput.trim().length>0) {
      this.isDisabled = false
      this.isActive = true

  }else {this.isDeactive =true
        this.isActive = false
  }
  }

  onCreateList(){
    const token = this.authService.getToken()
    this.apiService.addTask(this.taskTitleInput,this.taskDescriptionInput,token).subscribe({next: (item)=>{console.log(item);
      this.items.push({title: item.title,description: item.description, isEditing: false, completed: item.completed});this.isTaskExistStatus();       
      localStorage.setItem('taskId',item.id);
      console.log(item.id);
      
      
    },error: (error)=>{this.titleErrorCheckingFn(error);
    }})
    this.dialogRef.close()
    this.taskTitleInput = ''
    this.taskDescriptionInput = ''

     }


     editItem(index: number) {
      this.items[index].isEditing = true
     }

     deleteItem(dialogRef:TemplateRef<any>){
     const dialogReferrence = this.dialog.open(dialogRef,{position:{top:'10%', left: '50%'},height: '250px'})
      

    }
     

     saveItem(index: number,title: any, description:any){
      this.items[index].isEditing = false;
      const taskId =this.authService.getTaskId()
      this.apiService.saveTask(title,description,taskId
      ).subscribe({next:(update)=>{
      },error:(error)=>{this.handleError(error)}})

     }

     cancelEdit(index: number){
      this.items[index].isEditing = false;


     }
     onTaskChange(event:Event,title: string){
      
      this.isChecked = !this.isChecked    
      const taskTitle = title      
      this.apiService.taskCompeletion(this.isChecked,taskTitle).subscribe({next:(data)=>{console.log(data);
      },error:(error)=>{this.handleError(error)}})
     }

          
     isLoadingStatus(){
      this.isLoading = !this.isLoading
     }
     isTaskExistStatus() {
      this.isTaskExist = this.items.length === 0;
    }
    

     navigateToHome(){
      this.router.navigate(['/dashboard'])
      
     }
     deleteAccount(index: number, title: string, dialogRef: TemplateRef<any>): void {
      const taskTitle = title
      console.log(taskTitle);
      
      
      // Close the dialog immediately
      this.dialog.closeAll();
      
      // Proceed with the delete task request
      this.apiService.deleteTask(taskTitle).subscribe({
        next: (task) => {
          this.items.splice(index, 1);
          this.isTaskExistStatus();
          
        },
        error: (error) => {this.handleError(error)},
      });
    }
    handleError(error:any){
      console.error(error.error.error);
      
    }

    cancelDeletion(dialogRef: TemplateRef<any>){
      this.dialog.closeAll()
    }
    titleErrorCheckingFn(error:any){
      if (error.error.error) {
        this.titleErrorChecking = true
        this.titleError = error.error.error  
      }
      

    }
    
}



