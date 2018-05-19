import {Component, OnInit, Inject} from '@angular/core';
import {DataServiceService} from "../../data-service.service";
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {GridOptions} from "ag-grid";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-device-grid-dialog',
  templateUrl: 'device-grid-dialog.component.html',
  styleUrls: ['device-grid-dialog.component.css']
})
export class DeviceGridDialogComponent implements OnInit {

  private device: any;
  private tiles: any[] = [];
  private loaded = false;
  private deviceFlag = false;
  private packetsFlag = false;
  private gridData: any[];
  private gridColumns: any[];
  private gridOptions: GridOptions;
  private gridTwoData: any[];
  private gridTwoColumns: any[];
  private gridTwoOptions: GridOptions;

  constructor(private dataService: DataServiceService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.gridOptions = <GridOptions>{
      rowSelection: 'single'
    };

    this.device = this.data["data"][0]["data"];

    this.deviceFlag = this.data["mode"] == 'device';
    this.packetsFlag = this.data["mode"] == 'packets';

    console.log("packetsFlag", this.packetsFlag);

    this.tiles.push(
      {label: "IP", data: this.device["ip"]});

    this.gridOptions = <GridOptions>{
      enableColResize: true
    };
    this.gridData = [];
    this.gridTwoOptions = <GridOptions>{
      enableColResize: true
    };
    this.gridTwoData = [];

  }

  onGridReady(params) {
    console.log("grid ready");
    if (this.packetsFlag) {
      this.gridColumns = [{headerName: "Id", field: "id", width: 80, suppressSizeToFit: true},
        {headerName: "Source IP", field: "sourceIp"},
        {headerName: "Destination IP", field: "destinationIp"},
        {headerName: "Source Port", field: "sport"},
        {headerName: "Destination Port", field: "dport"},
        {headerName: "Direction", field: "direction"}];
      this.gridData = [];
      forkJoin(
        [this.dataService.getPacketsFromDevice(this.device["id"]),
          this.dataService.getPacketsToDevice(this.device["id"])])
        .subscribe((res: any[]) => {
          let fromPackets = [];
          if (res[0]["results"]) {
            fromPackets = res[0]["results"];
          }
          let toPackets = [];
          if (res[1]["results"]) {
            toPackets = res[1]["results"];
          }

          for (let p of fromPackets) {
            this.gridData.push(p);
          }
          for (let p of toPackets) {
            this.gridData.push(p);
          }
          this.gridOptions.api.setRowData(this.gridData);
          this.loaded = true;
          // params.api.sizeColumnsToFit();

          let allColumnIds = [];
          this.gridOptions.columnApi.getAllColumns().forEach(function (column) {
            allColumnIds.push(column.getColId());
          });
          this.gridOptions.columnApi.autoSizeColumns(allColumnIds);
        });
    }
    else if (this.deviceFlag) {
      this.gridColumns = [{headerName: "Id", field: "id", width: 80, suppressSizeToFit: true},
        {headerName: "City", field: "city"},
        {headerName: "Region Code", field: "regionCode"},
        {headerName: "Area Code", field: "areaCode"},
        {headerName: "Postal Code", field: "postalCode"},
        {headerName: "Country Name", field: "countryName"},
        {headerName: "Country", field: "country"},
        {headerName: "Country Code 3", field: "countryCode3"},
        {headerName: "Country Code", field: "countryCode"},
        {headerName: "Continent", field: "continent"},
        {headerName: "Latitude", field: "latitude"},
        {headerName: "Longitude", field: "longitude"},
        {headerName: "DMA Code", field: "dmaCode"},
        {headerName: "Time Zone", field: "Europe/timeZone"},
        {headerName: "Metro Code", field: "metroCode"}];
      this.dataService.getLocationByDeviceId(this.device["id"]).subscribe((data) => {
        // Push the packet results into data
        this.gridData = [];
        console.log("results:", data["results"]);
        if (data["results"]) {
          for (let v of data["results"]) {
            this.gridData.push(v);
          }
        }

        // Update the ag-grid
        this.gridOptions.api.setRowData(this.gridData);

        // Done loading
        this.loaded = true;
      });
    }
  }


  onGridTwoReady(params) {
    console.log("grid ready");
    if (this.deviceFlag) {
      this.gridTwoColumns = [{headerName: "Type", field: "type"},
        {headerName: "Count", field: "count"}];
      this.dataService.getTypesCountForDevice(this.device["id"]).subscribe((data) => {
        // Push the packet results into data
        this.gridTwoData = [];
        if (data["results"]) {
          for (let v of data["results"]) {
            this.gridTwoData.push(v);
          }
        }

        // Update the ag-grid
        this.gridTwoOptions.api.setRowData(this.gridTwoData);

        // Done loading
        this.loaded = true;
      });
    }
    params.api.sizeColumnsToFit();
  }
}
