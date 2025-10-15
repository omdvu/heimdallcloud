import { Component } from '@angular/core';
import { Middle } from '../../service/middle';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [FormsModule,CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  constructor(private middle:Middle) {}
  uploadProgress:number = 0;
  currentdir: string = '';
  files : any[] = [];
  msg: string = '';
  showfolder: boolean = true;
  foldername:string = '';

  ngOnInit(){
    const user = sessionStorage.getItem('user');
    if(user){
      const user1 = JSON.parse(user);
      const username = user1.username;
      this.currentdir = "/home/"+username;
      this.loadFiles();
    }
  }

  loadFiles(){
    console.log("loading files")
    let files = this.middle.getFiles(this.currentdir).subscribe({
      next : (result) => {
        this.files = result;
        if(this.files.length == 0){
          this.msg = "This directory is empty!";
        }
      },
      error: (err) => {
        this.msg = "Failed to load files, please contact Om";
      }
    });
  }

  openDir(dirname:string) {
    this.currentdir = `${this.currentdir}/${dirname}`;
    this.loadFiles();
  }

  goBack(){
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const userHome = `/home/${user.username}`;

    const parts = this.currentdir.split('/');
    parts.pop();
    const newDir = parts.join('/') || userHome;
    this.currentdir = newDir.startsWith(userHome) ? newDir : userHome;

    this.loadFiles();
  }
  
  uploadFile(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetDir', this.currentdir);

    this.middle.uploadFileWithProgress(formData).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          console.log('Upload Progress: ' + percentDone + '%');
          this.uploadProgress = percentDone;
        } else if (event.type === HttpEventType.Response) {
          console.log('Upload complete!', event.body);
          this.uploadProgress = 0;
          this.loadFiles();
        }
      },
      error: (err) => {
        console.error('Upload failed', err);
      }
    });
  }
  downloadFile(filename:string){
    const token = sessionStorage.getItem('token');
    const url = `${this.middle.api}/download?token=${token}path=${encodeURIComponent(this.currentdir + '/' + filename)}`;
    window.location.href = url;
  }

  createFolder(){
    const token = sessionStorage.getItem('token');
    this.showfolder = true;
    this.middle.createDir(token,this.currentdir,this.foldername).subscribe({
      next: (result) => {
        this.msg = "Created Folder!";
        this.loadFiles();
      },
      error: (err) => {
        this.msg = "Unable to create a folder!";
        this.loadFiles();
      }
    });
  }

  getName(){
    this.showfolder = false;
  }
}
