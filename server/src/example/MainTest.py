import json, analyser, geoLocation
from scapy.layers.dns import DNS

from scapy.layers.inet import TCP, IP

from scapy.all import *


counter = 0

# rdpcap comes from scapy and loads in our pcap file
packets = rdpcap('/home/jhohan/CS491/network-edge-packet-inspector/server/src/example/pcap1.pcap')

# create a for loop for all packets
# for pkt in packets:
#     counter += 1
#     data = analyser.analyse(pkt)
#     json.loads(data)
#     print data
for pkt in packets:
    data = analyser.analyse(pkt)
    temp = json.loads(data)
    print temp
