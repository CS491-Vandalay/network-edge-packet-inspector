import json
from scapy.all import *

from analyser import Analyser

counter = 0

Analyser_test = Analyser()

# rdpcap comes from scapy and loads in our pcap file
packets = rdpcap('/home/jhohan/CS491/network-edge-packet-inspector/server/src/example/pcap1.pcap')

# create a for loop for all packets
for packet in packets:
    pkt = packet
    # if IP in pkt:
    #     # Analyser_test.getIPheader(pkt)
    #     json_str = Analyser_test.getIPheaders(pkt)
    #     data = json.loads(json_str)
    #
    # if TCP in pkt:
    #     json_str = Analyser_test.getTCPheaders(pkt)
    #     data = json.loads(json_str)
    #     print data["sport"]
    #
    # if IPv6 in pkt:
    #     json_str = Analyser_test.getIPv6headers(pkt)
    #     data = json.loads(json_str)
    #
    # if Raw in pkt:
    #     raw = Analyser_test.getRaw(pkt)
    #     print raw

    if DNS in pkt:
        json_str = Analyser_test.getDNS(pkt)
        data = json.loads(json_str)
        print data["an"]

    counter += 1

print("counter = ", counter)
