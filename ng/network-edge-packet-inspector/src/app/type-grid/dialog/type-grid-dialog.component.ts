import {Component, OnInit, Inject} from '@angular/core';
import {DataServiceService} from "../../data-service.service";
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'type-type-grid-dialog',
  templateUrl: 'type-grid-dialog.component.html',
  styleUrls: ['type-grid-dialog.component.css']
})
export class TypeGridDialogComponent implements OnInit {

  private type: any;
  private tiles: any[] = [];

  constructor(private dataService: DataServiceService,
              public dialogRef: MatDialogRef<TypeGridDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.type = this.data["data"][0]["data"];

    this.tiles.push(
      {label: "Id", data: this.type["id"]},
      {label: "Type", data: this.type["name"]});
    console.log("tiles done")
  }


}
