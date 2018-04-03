import {Component, OnInit} from "@angular/core";
import {DataServiceService} from "../data-service.service";
import {GridOptions} from "ag-grid/main";

@Component({
  selector: 'app-device-grid',
  templateUrl: 'device-grid.component.html',
  styleUrls: ['device-grid.component.css']
})
export class DeviceGridComponent implements OnInit {

  loaded = false;
  private deviceData: any[];
  private deviceColumns: any[];
  private gridOptions: GridOptions;

  constructor(private dataService: DataServiceService) { }

  ngOnInit() {
    this.gridOptions= <GridOptions>{};
    this.deviceData = [];

    // Columns for the ag grid
    this.deviceColumns = [{headerName: "Id", field: "id"},
      {headerName: "IP", field: "ip"},
      {headerName: "Name", field: "name"}];


    this.dataService.getDevices().subscribe((data)=>{
      // Push the packet results into data
      for (let v of data["results"]) {
        this.deviceData.push(v);
      }

      // Update the ag-grid
      this.gridOptions.api.setRowData(this.deviceData);

      // Done loading
      this.loaded = true;
    });
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }

}
