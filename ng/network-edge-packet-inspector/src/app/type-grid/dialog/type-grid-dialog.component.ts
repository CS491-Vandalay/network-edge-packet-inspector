import {Component, OnInit, Inject} from '@angular/core';
import {DataServiceService} from "../../data-service.service";
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {GridOptions} from "ag-grid";

@Component({
  selector: 'type-type-grid-dialog',
  templateUrl: 'type-grid-dialog.component.html',
  styleUrls: ['type-grid-dialog.component.css']
})
export class TypeGridDialogComponent implements OnInit {

  private type: any;
  private tiles: any[] = [];
  private typeFlag: boolean = false;
  private deviceFlag: boolean = false;
  private packetsFlag: boolean = false;
  private gridData: any[];
  private gridColumns: any[];
  private gridOptions: GridOptions;

  constructor(private dataService: DataServiceService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.type = this.data["data"][0]["data"];

    this.typeFlag = this.data["mode"] == 'type';
    this.deviceFlag = this.data["mode"] == 'device';
    this.packetsFlag = this.data["mode"] == 'packets';
    this.gridOptions = <GridOptions>{};
    this.gridData = [];

    this.tiles.push(
      {label: "Id", data: this.type["id"]},
      {label: "Type", data: this.type["name"]});
    console.log("tiles done")
  }

  // onGridReady(params) {
  //   console.log("grid ready");
  //   if (this.packetsFlag) {
  //     this.gridColumns = [{headerName: "Id", field: "id"},
  //       {headerName: "Source IP", field: "sourceIp"},
  //       {headerName: "Destination IP", field: "destinationIp"},
  //       {headerName: "Port", field: "port"},
  //       {headerName: "Direction", field: "direction"}];
  //
  //     forkJoin(
  //       this.dataService.getPacketsFromDevice(this.device["id"]),
  //       this.dataService.getPacketsToDevice(this.device["id"]))
  //       .subscribe((res: any[]) => {
  //         let fromPackets = res[0]["results"];
  //         let toPackets = res[1]["results"];
  //
  //         for (let p of fromPackets) {
  //           this.gridData.push(p);
  //         }
  //         for (let p of toPackets) {
  //           this.gridData.push(p);
  //         }
  //         console.log("set row data");
  //         this.gridOptions.api.setRowData(this.gridData);
  //         console.log("Finished loading");
  //         this.loaded = true;
  //       });
  //   }
  //   else if (this.deviceFlag) {
  //     this.gridColumns = [{headerName: "Id", field: "id"},
  //       {headerName: "Country", field: "country"}];
  //     this.dataService.getLocationByDeviceId(this.device["id"]).subscribe((data) => {
  //       // Push the packet results into data
  //       for (let v of data["results"]) {
  //         this.gridData.push(v);
  //       }
  //
  //       // Update the ag-grid
  //       this.gridOptions.api.setRowData(this.gridData);
  //
  //       // Done loading
  //       this.loaded = true;
  //     });
  //   }
  //   params.api.sizeColumnsToFit();
  // }

}
