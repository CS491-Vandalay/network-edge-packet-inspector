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
  private title: string;
  private tiles: any[] = [];
  private loaded: boolean = false;
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
    this.title = this.data["title"];
    this.type = this.data["data"][0]["data"];

    this.typeFlag = this.data["mode"] == 'type';
    this.deviceFlag = this.data["mode"] == 'devices';
    this.packetsFlag = this.data["mode"] == 'packets';
    this.gridOptions = <GridOptions>{};
    this.gridData = [];
    this.gridColumns = [];

    this.tiles.push(
      {label: "Id", data: this.type["id"]},
      {label: "Type", data: this.type["type"]});
    console.log("tiles done")
  }

  onGridReady(params) {

    if (this.deviceFlag) {
      this.dataService.getDevicesForType(this.type["id"]).subscribe((data) => {
        this.gridColumns = [{headerName: "Id", field: "id"},
          {headerName: "IP", field: "ip"}];
        console.log("results:", data["results"]);
        if (data["results"]) {
          for (let v of data["results"]) {
            this.gridData.push(v);
          }
        }

        // Update the ag-grid
        this.gridOptions.api.setRowData(this.gridData);

        params.api.sizeColumnsToFit();

        // Done loading
        this.loaded = true;
      })
    } else if (this.packetsFlag) {
      this.dataService.getPacketsForType(this.type["id"]).subscribe((data)=>{
        // Columns for the ag grid
        this.gridColumns = [{headerName: "Id", field: "id"},
          {headerName: "Source IP", field: "sourceIp"},
          {headerName: "Destination IP", field: "destinationIp"},
          {headerName: "Source Port", field: "sport"},
          {headerName: "Destination Port", field: "dport"}];

          // Push the packet results into data
          for (let v of data["results"]) {
            this.gridData.push(v);
          }

          // Update the ag-grid
          this.gridOptions.api.setRowData(this.gridData);

          // Done loading
          this.loaded = true;
      })
    }
  }


}
