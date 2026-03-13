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
  allFiles: string = '';
  finalFiles: File[] = [];
  navLoading = false;

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
    this.msg = '';
    this.middle.getFiles(this.currentdir).subscribe({
      next : (result) => {
        this.files = result;
        if(this.files.length == 0){
          this.msg = "This directory is empty.";
        }
        this.navLoading = false;
      },
      error: (err) => {
        this.msg = "Failed to load files. Please try again.";
        this.navLoading = false;
      }
    });
  }

  openDir(dirname: string) {
    if (this.navLoading) return;
    this.navLoading = true;
    this.currentdir = `${this.currentdir}/${dirname}`;
    this.loadFiles();
  }

  goBack() {
    if (this.navLoading) return;
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const userHome = `/home/${user.username}`;

    const parts = this.currentdir.split('/');
    parts.pop();
    const newDir = parts.join('/') || userHome;
    this.currentdir = newDir.startsWith(userHome) ? newDir : userHome;

    this.navLoading = true;
    this.loadFiles();
  }

  fileSelected(event: any) {
    this.finalFiles = [];
    const files: FileList = event.target.files;

    for (let file of Array.from(files)) {

      let sizeInMb = Number((file.size / (1024*1024)).toFixed(2));
      let text = file.name + ":" + sizeInMb;
      if (sizeInMb > 140) {
        text += ":" + "File size too big, not accepted!";
      }
      else {
        this.finalFiles.push(file);
      }
      this.allFiles += text + "\n";
    }
    this.loadFiles();
    this.uploadFile();
  }
  
  async uploadFile() {
  const chunkSize = 40*1024*1024;

  for (let file of this.finalFiles) {
    const totalChunks = Math.ceil(file.size / chunkSize);
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('chunkIndex', chunkIndex.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('filename', file.name);

      try {
        await this.middle.uploadFileWithProgress(formData).toPromise();
        // per-file progress
        this.uploadProgress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
      } catch (err) {
        console.error(err);
        return;
      }
    }
    this.uploadProgress = 0;
  }
  this.loadFiles(); 
}

  downloadFile(filename:string){
    const token = sessionStorage.getItem('token');
    const url = `${this.middle.api}/download?token=${token}&path=${encodeURIComponent(this.currentdir + '/' + filename)}`;
    window.location.href = url;
  }

  createFolder(){
    const token = sessionStorage.getItem('token');
    this.showfolder = true;
    this.middle.createDir(token,this.currentdir,this.foldername).subscribe({
      next: (result) => {
        this.msg = "Folder created.";
        this.loadFiles();
      },
      error: (err) => {
        this.msg = "Could not create folder.";
        this.loadFiles();
      }
    });
  }

  getName(){
    if (this.showfolder) {
      this.showfolder = false;
    }
    else{ 
      this.showfolder = true;
    }
  }
}
