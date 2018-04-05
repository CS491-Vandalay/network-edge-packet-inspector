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

  getDevices(): Observable<any> {
    console.log("Getting devices");
    return this.http.get("http://localhost:8090/api/pcap/getDevices")
  }

  getLocations(): Observable<any> {
    console.log("Getting locations");
    return this.http.get("http://localhost:8090/api/pcap/getLocations")
  }

  getLocationByDeviceId(id: string){
    console.log("Getting location of device: ", id);
    return this.http.get("http://localhost:8090/api/pcap/getDeviceLocation/"+encodeURIComponent(id))
  }

  getTypes(): Observable<any> {
    console.log("Getting locations");
    return this.http.get("http://localhost:8090/api/pcap/getTypes")
  }
}
