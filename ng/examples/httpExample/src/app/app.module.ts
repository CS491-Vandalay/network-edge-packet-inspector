import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {DataServiceService} from "./data-service.service";
import {HttpClientModule} from "@angular/common/http";
import {AgGridModule} from "ag-grid-angular/main"

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgGridModule.withComponents([])
  ],
  providers: [DataServiceService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
