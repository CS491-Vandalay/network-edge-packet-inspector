import { Component, Inject } from '@angular/core';
import {DataServiceService} from "../data-service.service";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

  constructor(private dataService: DataServiceService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

}
