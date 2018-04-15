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
  private packetTiles: any[] = [];
  private deviceTiles: any[] = [];
  private locationTiles: any[] = [];
  private typeTiles: any[] = [];

  constructor(private dataService: DataServiceService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.packet = this.data["data"][0]["data"];

    this.packetTiles.push({label: "Id", data: this.packet["id"]},
      {label: "Source IP", data: this.packet["sourceIp"]},
      {label: "Destination IP", data: this.packet["destinationIp"]},
      {label: "Source Port", data: this.packet["sport"]},
      {label: "Destination Port", data: this.packet["dport"]});

    this.dataService.getDeviceForPacket(this.packet["id"]).subscribe((data) => {
      if (data["results"] && data["results"].length > 0) {
        let device = data["results"][0];
        this.deviceTiles.push({label: "Id", data: device["id"]},
          {label: "Ip", data: device["ip"]});

        this.dataService.getLocationByDeviceId(device["id"]).subscribe((data) => {
          if (data["results"] && data["results"].length > 0) {
            let loc = data["results"][0];
            this.locationTiles.push({label: "Id", data: loc["id"]},
              {label: "City", data: loc["city"]},
              {label: "Area Code", data: loc["areaCode"]},
              {label: "Region Code", data: loc["regionCode"]},
              {label: "Postal Code", data: loc["postalCode"]},
              {label: "Metro Code", data: loc["metroCode"]},
              {label: "Country Name", data: loc["countryName"]},
              {label: "Country Code", data: loc["countryCode"]},
              {label: "Country Code 3", data: loc["countryCode3"]},
              {label: "Time Zone", data: loc["timeZone"]},
              {label: "Continent", data: loc["continent"]},
              {label: "Latitude", data: loc["latitude"]},
              {label: "Longitude", data: loc["longitude"]},
              {label: "Dma Code", data: loc["dmaCode"]})
          } else {
            this.locationTiles.push({label: "Id", data: ""},
              {label: "City", data: ""},
              {label: "Area Code", data: ""},
              {label: "Region Code", data: ""},
              {label: "Postal Code", data: ""},
              {label: "Metro Code", data: ""},
              {label: "Country Name", data: ""},
              {label: "Country Code", data: ""},
              {label: "Country Code 3", data: ""},
              {label: "Time Zone", data: ""},
              {label: "Continent", data: ""},
              {label: "Latitude", data: ""},
              {label: "Longitude", data: ""},
              {label: "Dma Code", data: ""})
          }
        });
      } else {
        this.deviceTiles.push({label: "Id", data: ""},
          {label: "Ip", data: ""});


        this.locationTiles.push({label: "Id", data: ""},
          {label: "City", data: ""},
          {label: "Area Code", data: ""},
          {label: "Region Code", data: ""},
          {label: "Postal Code", data: ""},
          {label: "Metro Code", data: ""},
          {label: "Country Name", data: ""},
          {label: "Country Code", data: ""},
          {label: "Country Code 3", data: ""},
          {label: "Time Zone", data: ""},
          {label: "Continent", data: ""},
          {label: "Latitude", data: ""},
          {label: "Longitude", data: ""},
          {label: "Dma Code", data: ""})
      }

    });

    this.dataService.getPacketType(this.packet["id"]).subscribe((data) => {
      if (data["results"] && data["results"].length > 0) {
        let type = data["results"][0];
        this.typeTiles.push({label: "Id", data: type["id"]},
          {label: "Type", data: type["type"]}
        )
      } else {
        this.typeTiles.push({label: "Id", data: ""},
          {label: "Type", data: ""}
        )
      }
    });


    console.log("tiles done")
  }


}
