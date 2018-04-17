import {Component, OnInit} from "@angular/core";
import {DataServiceService} from "../data-service.service";
import {GridOptions} from "ag-grid/main";
import {MatDialog} from "@angular/material";
import {PacketGridDialogComponent} from "./dialog/packet-grid-dialog.component";

@Component({
  selector: 'app-packet-grid',
  templateUrl: 'packet-grid.component.html',
  styleUrls: ['packet-grid.component.css']
})
export class PacketGridComponent implements OnInit {

  loaded = false;
  rowSelected = false;
  private packetData: any[];
  private packetColumns: any[];
  private gridOptions: GridOptions;
  private dialogRef: any;

  constructor(private dataService: DataServiceService, private dialog: MatDialog) { }

  ngOnInit() {
    this.gridOptions= <GridOptions>{
      rowSelection: 'single',
      enableColResize: true
    };
    this.packetData = [];

    // Columns for the ag grid
    this.packetColumns = [{headerName: "Id", field: "id"},
      {headerName: "Source IP", field: "sourceIp"},
      {headerName: "Destination IP", field: "destinationIp"},
      {headerName: "Source Port", field: "sport"},
      {headerName: "Destination Port", field: "dport"}];


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

  openDialog() {
    let selected = this.gridOptions.api.getSelectedNodes();
    this.dialogRef = this.dialog.open(PacketGridDialogComponent, {
      width: "90%",
      height: "80%",
      data: {data: selected}
    });
    console.log(selected);
  }

  enableButtons() {
    this.rowSelected = true;
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }

}
