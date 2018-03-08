import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class DataServiceService {

  constructor(private http: HttpClient) { }

  getPackets(): Observable<any>{
    console.log("Getting packets");
    return this.http.get("http://localhost:8090/api/pcap/getPackets")
  }

  getDevices(): Observable<any>{
    console.log("Getting devices");
    return this.http.get("http://localhost:8090/api/pcap/getDevices")
  }

}
