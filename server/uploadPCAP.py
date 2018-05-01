import json, requests, time, argparse
from src import PcapHelper as pcapHelper
from scapy.all import *


def is_valid_file(parser, arg):
    if not os.path.exists(arg):
        parser.error("The file %s does not exist!" % arg)
    else:
        return arg


argParser = argparse.ArgumentParser(description="Uploads given pcap file to neo4j")
argParser.add_argument("-filePath", metavar="FILE", required=True,
                       type=lambda x: is_valid_file(argParser, x), nargs=1, help="Location of pcap file")

args = argParser.parse_args()

print("parsing file:", args.filePath[0])

counter = 0  # rdpcap comes from scapy and loads in our pcap file
packets = rdpcap(args.filePath[0])

total = len(packets)
current = 0
start_time = time.time()
analyzer = pcapHelper.Analyser()
for pkt in packets:
    current += 1
    data = analyzer.analyse(pkt)
    temp = json.loads(data)
    requests.post('http://localhost:8090/api/pcap/save', json=temp)
    print "Uploading: %d/%d" % (current, total)

print "===================================="
print "| RUN-TIME: %s seconds" % (time.time() - start_time)
print "===================================="
