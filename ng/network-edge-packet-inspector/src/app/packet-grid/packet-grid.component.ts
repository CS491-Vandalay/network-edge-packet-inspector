import {Component, OnInit} from "@angular/core";
import {DataServiceService} from "../data-service.service";
import {GridOptions} from "ag-grid/main";
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-packet-grid',
  templateUrl: 'packet-grid.component.html',
  styleUrls: ['packet-grid.component.css']
})
export class PacketGridComponent implements OnInit {

  loaded = false;
  private packetData: any[];
  private packetColumns: any[];
  private gridOptions: GridOptions;

  constructor(private dataService: DataServiceService) { }

  ngOnInit() {
    this.gridOptions= <GridOptions>{
      rowSelection: 'single'
    };
    this.packetData = [];

    // Columns for the ag grid
    this.packetColumns = [{headerName: "Id", field: "id"},
      {headerName: "Source IP", field: "sourceIp"},
      {headerName: "Destination IP", field: "destinationIp"},
      {headerName: "Port", field: "port"}];


    this.dataService.getPackets().subscribe((data)=>{
      // Push the packet results into data
      for (let v of data["results"]) {
        this.packetData.push(v);
      }

      // Update the ag-grid
      this.gridOptions.api.setRowData(this.packetData);

      // Done loading
      this.loaded = true;
    });
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }

}
