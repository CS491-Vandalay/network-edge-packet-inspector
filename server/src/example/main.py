import os
from scapy.all import *

from getHTTPHeaders import HTTPHeaders, extractText

data = "pcap1.pcap"
a = rdpcap(data)


sessions = a.sessions()
carved_texts = 1
for session in sessions:
    http_payload = ""
    for packet in sessions[session]:
        try:
            if packet[TCP].dport == 80 or packet[TCP].sport == 80:
                http_payload += str(packet[TCP].payload)
        except:
            pass
        headers = HTTPHeaders(http_payload)
    if headers is None:
        continue
    text = extractText(headers,http_payload)
    if text is not None:
         print (text)