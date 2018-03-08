import {Component, OnInit} from "@angular/core";
import {DataServiceService} from "./data-service.service";
import {GridOptions} from "ag-grid/main"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  results: string;
  loaded = false;
  private packetData: any[];
  private packetColumns: any[];
  private deviceData: any[];
  private deviceColumns: any[];
  pGridOptions: GridOptions;
  dGridOptions: GridOptions;


  constructor(private dataService: DataServiceService) {
    this.pGridOptions = <GridOptions>{};
    this.dGridOptions = <GridOptions>{};
    this.packetData = [];
    // Columns for the ag grid
    this.packetColumns = [{headerName: "Id", field: "id"},
      {headerName: "Source IP", field: "sourceIp"},
      {headerName: "Destination IP", field: "destinationIp"},
      {headerName: "Port", field: "port"}];

    this.deviceData = [];
    // Columns for the ag grid
    this.deviceColumns = [{headerName: "Id", field: "id"},
      {headerName: "IP", field: "ip"},
      {headerName: "Name", field: "name"}];
  }

  // When page is init'd load the data
  ngOnInit() {
    this.getPackets();
    this.getDevices();
  }

  getPackets() {
    // Reset row data
    this.packetData = [];
    // Call data service to get packets
    this.dataService.getPackets().subscribe((data) => {
      // Push the packet results into data
      for (let v of data["results"]) {
        this.packetData.push(v);
      }
      // Update the ag-grid
      this.pGridOptions.api.setRowData(this.packetData);
    });
  }

  getDevices() {
    // Reset row data
    this.deviceData = [];
    // Call data service to get packets
    this.dataService.getDevices().subscribe((data) => {
      // Push the packet results into data
      for (let v of data["results"]) {
        this.deviceData.push(v);
      }
      console.log(this.deviceData);
      // Update the ag-grid
      this.dGridOptions.api.setRowData(this.deviceData);
      // Finished loading so toggle the flag
      this.loaded = true;
    });
  }


  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }

  selectAllRows() {
    this.pGridOptions.api.selectAll();
  }

}
