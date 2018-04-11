import {Component, OnInit, Inject} from '@angular/core';
import {DataServiceService} from "../../data-service.service";
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {GridOptions} from "ag-grid";
import {forkJoin} from "rxjs/observable/forkJoin";

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
              public dialogRef: MatDialogRef<DeviceGridDialogComponent>,
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
      {label: "Name", data: this.device["name"]},
      {label: "IP", data: this.device["ip"]});

    this.gridOptions = <GridOptions>{};
    this.gridData = [];
    this.gridTwoOptions = <GridOptions>{};
    this.gridTwoData = [];

  }

  onGridReady(params) {
    console.log("grid ready");
    if (this.packetsFlag) {
      this.gridColumns = [{headerName: "Id", field: "id"},
        {headerName: "Source IP", field: "sourceIp"},
        {headerName: "Destination IP", field: "destinationIp"},
        {headerName: "Port", field: "port"},
        {headerName: "Direction", field: "direction"}];

      forkJoin(
        this.dataService.getPacketsFromDevice(this.device["id"]),
        this.dataService.getPacketsToDevice(this.device["id"]))
        .subscribe((res: any[]) => {
          let fromPackets = res[0]["results"];
          let toPackets = res[1]["results"];

          for (let p of fromPackets) {
            this.gridData.push(p);
          }
          for (let p of toPackets) {
            this.gridData.push(p);
          }
          console.log("set row data");
          this.gridOptions.api.setRowData(this.gridData);
          console.log("Finished loading");
          this.loaded = true;
        });
    }
    else if (this.deviceFlag) {
      this.gridColumns = [{headerName: "Id", field: "id"},
        {headerName: "Country", field: "country"}];
      this.dataService.getLocationByDeviceId(this.device["id"]).subscribe((data) => {
        // Push the packet results into data
        for (let v of data["results"]) {
          this.gridData.push(v);
        }

        // Update the ag-grid
        this.gridOptions.api.setRowData(this.gridData);

        // Done loading
        this.loaded = true;
      });
    }
    params.api.sizeColumnsToFit();
  }


  onGridTwoReady(params) {
    console.log("grid ready");
    if (this.deviceFlag) {
      this.gridTwoColumns = [{headerName: "Type", field: "name"},
        {headerName: "Count", field: "count"}];
      this.dataService.getTypesForDevice(this.device["id"]).subscribe((data) => {
        // Push the packet results into data
        for (let v of data["results"]) {
          this.gridTwoData.push(v);
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
