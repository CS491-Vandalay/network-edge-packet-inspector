import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class DataServiceService {

  private basePcap = "http://localhost:8090/api/pcap/";

  constructor(private http: HttpClient) {
  }

  getPackets(): Observable<any> {
    console.log("Getting packets");
    return this.http.get(this.basePcap + "getPackets")
  }

  getPacketsFromDevice(id: number): Observable<any> {
    console.log("Getting packets for device id: ", id);
    return this.http.get(this.basePcap + "getPacketsFromDevice/" + id)
  }

  getPacketsToDevice(id: number): Observable<any> {
    console.log("Getting packets for device id: ", id);
    return this.http.get(this.basePcap + "getPacketsToDevice/" + id)
  }

  getDevices(): Observable<any> {
    console.log("Getting devices");
    return this.http.get(this.basePcap + "getDevices")
  }

  getLocations(): Observable<any> {
    console.log("Getting locations");
    return this.http.get(this.basePcap + "getLocations")
  }

  getLocationByDeviceId(id: number) {
    console.log("Getting location of device: ", id);
    return this.http.get(this.basePcap + "getDeviceLocation/" + id)
  }

  getTypes(): Observable<any> {
    console.log("Getting locations");
    return this.http.get(this.basePcap + "getTypes")
  }

  getTypesCountForDevice(id: number) {
    console.log("Getting types for device: ", id);
    return this.http.get(this.basePcap + "getTypeCountForDevice/" + id);
  }

  getDeviceForPacket(id: number) {
    console.log("Getting device for packet: ", id);
    return this.http.get(this.basePcap + "getDeviceByPacket/" + id);
  }

  getPacketType(id: number){
    console.log("Getting type for packet: ", id);
    return this.http.get(this.basePcap + "getPacketType/" + id);
  }

  getDevicesWithLocation(id: number){
    console.log("Getting devices for location: ", id);
    return this.http.get(this.basePcap + "getDevicesWithLocation/" + id);
  }

  getPacketsFromLocation(id: number){
    console.log("Getting devices for location: ", id);
    return this.http.get(this.basePcap + "getPacketsFromLocation/" + id);
  }

  getTypesCountForLocation(id: number){
    console.log("Getting type counts for location: ", id);
    return this.http.get(this.basePcap + "getTypeCountForLocation/" + id);
  }
}
