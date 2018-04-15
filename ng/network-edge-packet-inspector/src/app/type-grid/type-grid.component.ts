import {Component, OnInit} from "@angular/core";
import {DataServiceService} from "../data-service.service";
import {GridOptions} from "ag-grid/main";
import {MatButtonModule} from '@angular/material/button';
import {MatDialog} from "@angular/material";
import {TypeGridDialogComponent} from "./dialog/type-grid-dialog.component";

@Component({
  selector: 'app-type-grid',
  templateUrl: 'type-grid.component.html',
  styleUrls: ['type-grid.component.css']
})
export class TypeGridComponent implements OnInit {

  loaded = false;
  rowSelected = false;
  private typeData: any[];
  private typeColumns: any[];
  private gridOptions: GridOptions;
  private dialogRef: any;

  constructor(private dataService: DataServiceService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.gridOptions = <GridOptions>{
      rowSelection: 'single'
    };
    this.typeData = [];

    // Columns for the ag grid
    this.typeColumns = [{headerName: "Id", field: "id"},
      {headerName: "Type", field: "type"}];


    this.dataService.getTypes().subscribe((data) => {
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

  openDialog(option: string) {
    let selected = this.gridOptions.api.getSelectedNodes();
    this.dialogRef = this.dialog.open(TypeGridDialogComponent, {
      width: "90%",
      height: "80%",
      data: {data: selected, mode: option}
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
