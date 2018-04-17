import {Component, OnInit} from "@angular/core";
import {DataServiceService} from "../data-service.service";
import {GridOptions} from "ag-grid/main";
import {MatDialog} from "@angular/material";
import {DeviceGridDialogComponent} from "./dialog/device-grid-dialog.component";

@Component({
  selector: 'app-device-grid',
  templateUrl: 'device-grid.component.html',
  styleUrls: ['device-grid.component.css']
})
export class DeviceGridComponent implements OnInit {

  loaded = false;
  rowSelected = false;
  private deviceData: any[];
  private deviceColumns: any[];
  private gridOptions: GridOptions;
  private dialogRef: any;

  constructor(private dataService: DataServiceService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.gridOptions = <GridOptions>{
      rowSelection: 'single',
      enableColResize: true
    };
    this.deviceData = [];

    // Columns for the ag grid
    this.deviceColumns = [{headerName: "Id", field: "id"},
      {headerName: "IP", field: "ip"}];


    this.dataService.getDevices().subscribe((data) => {
      // Push the packet results into data
      if(data["results"]) {
        for (let v of data["results"]) {
          this.deviceData.push(v);
        }
      }

      // Update the ag-grid
      this.gridOptions.api.setRowData(this.deviceData);


      // Done loading
      this.loaded = true;
    });
  }

  openDialog(button: string) {
    let selected = this.gridOptions.api.getSelectedNodes();
    this.dialogRef = this.dialog.open(DeviceGridDialogComponent, {
      width: "90%",
      height: "80%",
      data: {data: selected, mode: button}
    });
  }

  enableButtons() {
    this.rowSelected = true;
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }

}
