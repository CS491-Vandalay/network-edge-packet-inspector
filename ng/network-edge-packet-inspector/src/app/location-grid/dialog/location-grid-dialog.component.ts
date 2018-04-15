import {Component, OnInit, Inject} from '@angular/core';
import {DataServiceService} from "../../data-service.service";
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {GridOptions} from "ag-grid";

@Component({
  selector: 'app-location-grid-dialog',
  templateUrl: 'location-grid-dialog.component.html',
  styleUrls: ['location-grid-dialog.component.css']
})
export class LocationGridDialogComponent implements OnInit {
  private loaded: boolean = false;
  private location: any;
  private gridData: any[];
  private gridColumns: any[];
  private gridOptions: GridOptions;
  private detailsFlag: boolean = false;
  private devicesFlag: boolean = false;
  private packetsFlag: boolean = false;
  private locationTiles: any[] = [];

  constructor(private dataService: DataServiceService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.location = this.data["data"][0]["data"];
    this.detailsFlag = this.data["mode"] == 'details';
    this.packetsFlag = this.data["mode"] == 'packets';
    this.devicesFlag = this.data["mode"] == 'devices';
    this.gridData = [];
    this.gridOptions = <GridOptions>{
      enableColResize: true
    };
  }

  onGridReady(params) {
    if (this.detailsFlag) {
      this.locationTiles = [{label: "Id", data: this.location["id"]},
        {label: "City", data: this.location["city"]},
        {label: "Region Code", data: this.location["regionCode"]},
        {label: "Area Code", data: this.location["areaCode"]},
        {label: "Postal Code", data: this.location["postalCode"]},
        {label: "Country Name", data: this.location["countryName"]},
        {label: "Country", data: this.location["country"]},
        {label: "Country Code 3", data: this.location["countryCode3"]},
        {label: "Country Code", data: this.location["countryCode"]},
        {label: "Continent", data: this.location["continent"]},
        {label: "Latitude", data: this.location["latitude"]},
        {label: "Longitude", data: this.location["longitude"]},
        {label: "DMA Code", data: this.location["dmaCode"]},
        {label: "Time Zone", data: this.location["Europe/timeZone"]},
        {label: "Metro Code", data: this.location["metroCode"]}];

      this.gridColumns = [{headerName: "Type", field: "type"}, {headerName:"Count", field:"count"}];

      this.dataService.getTypesCountForLocation(this.location["id"]).subscribe((data)=>{
        this.gridData = [];
        console.log("data['results']: ", data["results"])
        if (data["results"]) {
          for (let v of data["results"]) {
            this.gridData.push(v);
          }
        }

        // Update the ag-grid
        this.gridOptions.api.setRowData(this.gridData);

        // Done loading
        this.loaded = true;
      })

    } else if (this.packetsFlag) {
      this.gridColumns = [{headerName: "Id", field: "id", width: 80, suppressSizeToFit:true},
        {headerName: "Source IP", field: "sourceIp"},
        {headerName: "Destination IP", field: "destinationIp"},
        {headerName: "Source Port", field: "sport"},
        {headerName: "Destination Port", field: "dport"}];
      this.dataService.getPacketsFromLocation(this.location["id"]).subscribe((data) => {
        if (data["success"]) {
          for (let v of data["results"]) {
            this.gridData.push(v)
          }
        } else {
          this.gridData = [];
        }
        // Update the ag-grid
        this.gridOptions.api.setRowData(this.gridData);

        // Done loading
        this.loaded = true;
        params.api.sizeColumnsToFit();

      });
    } else if (this.devicesFlag) {
      this.gridColumns = [{headerName: "Id", field: "id"},
        {headerName: "Ip", field: "ip"}];
      this.dataService.getDevicesWithLocation(this.location["id"]).subscribe((data) => {
        if (data["success"]) {
          for (let v of data["results"]) {
            this.gridData.push(v)
          }
        } else {
          this.gridData = [];
        }
        // Update the ag-grid
        this.gridOptions.api.setRowData(this.gridData);

        // Done loading
        this.loaded = true;
        params.api.sizeColumnsToFit();

        let allColumnIds = [];
        this.gridOptions.columnApi.getAllColumns().forEach(function (column) {
          allColumnIds.push(column.getColId());
        });
        this.gridOptions.columnApi.autoSizeColumns(allColumnIds, null);

      });
    }

  }

}
