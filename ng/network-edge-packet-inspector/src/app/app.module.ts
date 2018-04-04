import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from "@angular/core";
import {MatButtonModule, MatSidenavModule} from "@angular/material";
import {MatDividerModule} from '@angular/material/divider';
import {AppComponent} from "./app.component";
import {MenuComponent} from "./menu/menu.component";
import {PacketGridComponent} from "./packet-grid/packet-grid.component";
import {DeviceGridComponent} from "./device-grid/device-grid.component";
import {TypeGridComponent} from "./type-grid/type-grid.component";
import {LocationGridComponent} from "./location-grid/location-grid.component";
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
    MenuComponent,
    PacketGridComponent,
    DeviceGridComponent,
    TypeGridComponent,
    LocationGridComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatSidenavModule,
    MatDividerModule,
    AgGridModule.withComponents([]),
    RouterModule.forRoot(appRoutes, {enableTracing: true})
  ],
  providers: [DataServiceService],
  bootstrap: [AppComponent]
})

export class AppModule {
}
