import {Component, OnInit, Inject} from '@angular/core';
import {DataServiceService} from "../../data-service.service";
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-location-grid-dialog',
  templateUrl: 'location-grid-dialog.component.html',
  styleUrls: ['location-grid-dialog.component.css']
})
export class LocationGridDialogComponent implements OnInit {

  private location: any;
  private tiles: any[] = [];

  constructor(private dataService: DataServiceService,
              public dialogRef: MatDialogRef<LocationGridDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.location = this.data["data"][0]["data"];

    this.tiles.push(
      {label: "Id", data: this.location["id"]},
      {label: "Country", data: this.location["country"]});

    console.log("tiles done")
  }


}
