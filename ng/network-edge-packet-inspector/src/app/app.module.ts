import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {MenuComponent} from "./menu/menu.component";
import {PacketGridComponent} from "./packet-grid/packet-grid.component";
import {DeviceGridComponent} from "./device-grid/device-grid.component";
import {HttpClientModule} from "@angular/common/http";
import {AgGridModule} from "ag-grid-angular";
import {DataServiceService} from "./data-service.service";
import {RouterModule, Routes} from "@angular/router";

const appRoutes: Routes = [
  {path: 'Packets', component: PacketGridComponent},
  {path: 'Devices', component: DeviceGridComponent},
  {path: '', redirectTo: 'Packets', pathMatch: "full"}
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    PacketGridComponent,
    DeviceGridComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgGridModule.withComponents([]),
    RouterModule.forRoot(appRoutes, {enableTracing: true})
  ],
  providers: [DataServiceService],
  bootstrap: [AppComponent]
})

export class AppModule {
}
