import {Component, OnInit} from "@angular/core";
import {DataServiceService} from "../data-service.service";
import {GridOptions} from "ag-grid/main";
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-type-grid',
  templateUrl: 'type-grid.component.html',
  styleUrls: ['type-grid.component.css']
})
export class TypeGridComponent implements OnInit {

  loaded = false;
  private typeData: any[];
  private typeColumns: any[];
  private gridOptions: GridOptions;

  constructor(private dataService: DataServiceService) { }

  ngOnInit() {
    this.gridOptions= <GridOptions>{};
    this.typeData = [];

    // Columns for the ag grid
    this.typeColumns = [{headerName: "Id", field: "id"},
      {headerName: "Name", field: "name"}];


    this.dataService.getTypes().subscribe((data)=>{
      // Push the packet results into data
      for (let v of data["results"]) {
        this.typeData.push(v);
      }

      // Update the ag-grid
      this.gridOptions.api.setRowData(this.typeData);

      // Done loading
      this.loaded = true;
    });
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }

}
