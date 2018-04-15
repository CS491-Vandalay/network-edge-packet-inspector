import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class DataServiceService {

  constructor(private http: HttpClient) {
  }

  getPackets(): Observable<any> {
    console.log("Getting packets");
    return this.http.get("http://localhost:8090/api/pcap/getPackets")
  }

  getPacketsFromDevice(id: number): Observable<any>{
    console.log("Getting packets for device id: ", id);
    return this.http.get("http://localhost:8090/api/pcap/getPacketsFromDevice/"+id)
  }

  getPacketsToDevice(id: number): Observable<any>{
    console.log("Getting packets for device id: ", id);
    return this.http.get("http://localhost:8090/api/pcap/getPacketsToDevice/"+id)
  }

  getDevices(): Observable<any> {
    console.log("Getting devices");
    return this.http.get("http://localhost:8090/api/pcap/getDevices")
  }

  getLocations(): Observable<any> {
    console.log("Getting locations");
    return this.http.get("http://localhost:8090/api/pcap/getLocations")
  }

  getLocationByDeviceId(id: number){
    console.log("Getting location of device: ", id);
    return this.http.get("http://localhost:8090/api/pcap/getDeviceLocation/"+id)
  }

  getTypes(): Observable<any> {
    console.log("Getting locations");
    return this.http.get("http://localhost:8090/api/pcap/getTypes")
  }

  getTypesForDevice(id: number){
    console.log("Getting types for device: ", id);
    return this.http.get("http://localhost:8090/api/pcap/getTypeCountForDevice/"+id);
  }
}
