import {Component} from '@angular/core';
import {MatDialog} from "@angular/material";
import {UploadComponent} from "./upload/upload.component"

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private dialogRef: any;
  private title = 'Network Edge Packet Inspector';
  private routeList = [
    "Packets",
    "Devices",
    "Locations",
    "Types",
    "Upload"
  ];

  constructor(private dialog: MatDialog){}

  openDialog() {
    this.dialogRef = this.dialog.open(UploadComponent, {
      width: "90%",
      height: "80%",
      data: {}
    });
  }
}
