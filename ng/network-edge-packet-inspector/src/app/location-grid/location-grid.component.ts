import {Component, OnInit} from "@angular/core";
import {DataServiceService} from "../data-service.service";
import {GridOptions} from "ag-grid/main";
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'location-packet-grid',
  templateUrl: 'location-grid.component.html',
  styleUrls: ['location-grid.component.css']
})
export class LocationGridComponent implements OnInit {

  loaded = false;
  private locationData: any[];
  private locationColumns: any[];
  private gridOptions: GridOptions;

  constructor(private dataService: DataServiceService) { }

  ngOnInit() {
    this.gridOptions= <GridOptions>{};
    this.locationData = [];

    // Columns for the ag grid
    this.locationColumns = [{headerName: "Id", field: "id"},
      {headerName: "Country", field: "country"}];


    this.dataService.getLocations().subscribe((data)=>{
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

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }

}
