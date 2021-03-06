import {Component, OnInit} from "@angular/core";
import {DataServiceService} from "../data-service.service";
import {GridOptions} from "ag-grid/main";
import {MatButtonModule} from '@angular/material/button';
import {MatDialog} from "@angular/material";
import {LocationGridDialogComponent} from "./dialog/location-grid-dialog.component";

@Component({
  selector: 'location-packet-grid',
  templateUrl: 'location-grid.component.html',
  styleUrls: ['location-grid.component.css']
})
export class LocationGridComponent implements OnInit {

  loaded = false;
  rowSelected = false;
  private locationData: any[];
  private locationColumns: any[];
  private gridOptions: GridOptions;
  private dialogRef: any;

  constructor(private dataService: DataServiceService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.gridOptions = <GridOptions>{
      rowSelection: 'single',
      enableColResize: true
    };
    this.locationData = [];

    // Columns for the ag grid
    this.locationColumns = [{headerName: "Id", field: "id"},
      {headerName: "City", field: "city"},
      {headerName: "Region Code", field: "regionCode"},
      {headerName: "Area Code", field: "areaCode"},
      {headerName: "Postal Code", field: "postalCode"},
      {headerName: "Country Name", field: "countryName"},
      {headerName: "Country", field: "country"},
      {headerName: "Country Code 3", field: "countryCode3"},
      {headerName: "Country Code", field: "countryCode"},
      {headerName: "Continent", field:"continent"},
      {headerName: "Latitude", field: "latitude"},
      {headerName: "Longitude", field: "longitude"},
      {headerName: "DMA Code", field: "dmaCode"},
      {headerName: "Time Zone", field: "Europe/timeZone"},
      {headerName: "Metro Code", field: "metroCode"}];


    this.dataService.getLocations().subscribe((data) => {
      // Push the packet results into data
      for (let v of data["results"]) {
        this.locationData.push(v);
      }

      // Update the ag-grid
      this.gridOptions.api.setRowData(this.locationData);

      // Done loading
      this.loaded = true;
    });
  }

  openDialog(mode: string) {
    let selected = this.gridOptions.api.getSelectedNodes();
    this.dialogRef = this.dialog.open(LocationGridDialogComponent, {
      width: "90%",
      height: "80%",
      data: {data: selected, mode: mode}
    });
  }

  enableButtons() {
    this.rowSelected = true;
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();

    let allColumnIds = [];
    this.gridOptions.columnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.getColId());
    });
    this.gridOptions.columnApi.autoSizeColumns(allColumnIds);
  }

}
