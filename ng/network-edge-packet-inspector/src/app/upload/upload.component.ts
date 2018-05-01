import {Component, Inject, OnInit} from '@angular/core';
import {DataServiceService} from "../data-service.service";
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  private uploaded = false;

  constructor(private dataService: DataServiceService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  public uploader: FileUploader = new FileUploader({url: "http://localhost:8090/uploadPcap", itemAlias: 'pcap'});

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log("ImageUpload:uploaded:", item, status, response);
      this.uploaded = true;
    };
  }
}
