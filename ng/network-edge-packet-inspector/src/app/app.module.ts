import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from "@angular/core";
import {MatButtonModule, MatSidenavModule, MatDialogModule} from "@angular/material";
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {AppComponent} from "./app.component";
import {PacketGridComponent} from "./packet-grid/packet-grid.component";
import {PacketGridDialogComponent} from "./packet-grid/dialog/packet-grid-dialog.component";
import {DeviceGridComponent} from "./device-grid/device-grid.component";
import {DeviceGridDialogComponent} from "./device-grid/dialog/device-grid-dialog.component";
import {TypeGridComponent} from "./type-grid/type-grid.component";
import {TypeGridDialogComponent} from "./type-grid/dialog/type-grid-dialog.component";
import {LocationGridComponent} from "./location-grid/location-grid.component";
import {LocationGridDialogComponent} from "./location-grid/dialog/location-grid-dialog.component";
import {HttpClientModule} from "@angular/common/http";
import {AgGridModule} from "ag-grid-angular";
import {DataServiceService} from "./data-service.service";
import {RouterModule, Routes} from "@angular/router";

const appRoutes: Routes = [
  {path: 'Packets', component: PacketGridComponent},
  {path: 'Devices', component: DeviceGridComponent},
  {path: 'Locations', component: LocationGridComponent},
  {path: 'Types', component: TypeGridComponent},
  {path: '', redirectTo: 'Packets', pathMatch: "full"}
];

@NgModule({
  declarations: [
    AppComponent,
    PacketGridComponent,
    PacketGridDialogComponent,
    DeviceGridComponent,
    DeviceGridDialogComponent,
    TypeGridComponent,
    TypeGridDialogComponent,
    LocationGridComponent,
    LocationGridDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatSidenavModule,
    MatDividerModule,
    MatDialogModule,
    MatGridListModule,
    AgGridModule.withComponents([]),
    RouterModule.forRoot(appRoutes, {})
  ],
  providers: [DataServiceService],
  bootstrap: [AppComponent],
  entryComponents:[
    DeviceGridDialogComponent,
    LocationGridDialogComponent,
    PacketGridDialogComponent,
    TypeGridDialogComponent
  ]
})

export class AppModule {
}
