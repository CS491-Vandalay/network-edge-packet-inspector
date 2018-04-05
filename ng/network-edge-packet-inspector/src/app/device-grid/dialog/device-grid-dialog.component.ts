import {Component, OnInit, Inject} from '@angular/core';
import {DataServiceService} from "../../data-service.service";
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-device-grid-dialog',
  templateUrl: 'device-grid-dialog.component.html',
  styleUrls: ['device-grid-dialog.component.css']
})
export class DeviceGridDialogComponent implements OnInit {

  private device: any;
  private tiles: any[] = [];

  constructor(private dataService: DataServiceService,
              public dialogRef: MatDialogRef<DeviceGridDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.device = this.data["data"][0]["data"];

    this.tiles.push(
      {label: "Id", data: this.device["id"]},
      {label: "Name", data: this.device["name"]},
      {label: "IP", data: this.device["ip"]});

    console.log("tiles done")
  }


}
