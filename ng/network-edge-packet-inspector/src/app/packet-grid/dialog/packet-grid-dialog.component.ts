import {Component, OnInit, Inject} from '@angular/core';
import {DataServiceService} from "../../data-service.service";
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-packet-grid-dialog',
  templateUrl: 'packet-grid-dialog.component.html',
  styleUrls: ['packet-grid-dialog.component.css']
})
export class PacketGridDialogComponent implements OnInit {

  private packet: any;
  private tiles: any[] = [];

  constructor(private dataService: DataServiceService,
              public dialogRef: MatDialogRef<PacketGridDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.packet = this.data["data"][0]["data"];

    this.tiles.push({label: "Id", data: this.packet["id"]},
      {label: "Source IP", data: this.packet["sourceIp"]},
      {label: "Destination IP", data: this.packet["destinationIp"]},
      {label: "Port", data: this.packet["port"]});

    console.log("tiles done")
  }


}
