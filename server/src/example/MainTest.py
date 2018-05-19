import json, analyser, geoLocation, requests, time
from scapy.layers.dns import DNS

from scapy.layers.inet import TCP, IP

from scapy.all import *


counter = 0

# rdpcap comes from scapy and loads in our pcap file
packets = rdpcap('/home/mrodger4/workspaces/CS491/network-edge-packet-inspector/server/src/example/pcap1.pcap')
pcapHelp = analyser.Analyser()
# create a for loop for all packets
for pkt in packets:
    counter += 1
    data = pcapHelp.analyse(pkt)
    json.loads(data)
    print data
    break
# total = len(packets)
# current = 0
# start_time = time.time()
# for pkt in packets:
#     current += 1
#     data = analyser.analyse(pkt)
#     temp = json.loads(data)
#     requests.post('http://localhost:8090/api/pcap/save', json=temp)
#     print "Uploading: %d/%d" % (current,total)
#
# print "===================================="
# print "| RUN-TIME: %s seconds" % (time.time() - start_time)
# print "===================================="
