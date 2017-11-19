from scapy.all import *
from neo4j.v1 import GraphDatabase, basic_auth
from datetime import datetime, timedelta

driver = GraphDatabase.driver("bolt://localhost:7687", auth=basic_auth("neo4j", "Mrodg#42043"))
session = driver.session()

packets = rdpcap("pcap1.pcap")

# print ls(IPv6)

count = 100
i = 0

session.run("MATCH (a:ipData) detach delete a")

uploadStart = datetime.now()
while i < count:
    ipv6 = IPv6 in packets[i]
    ipv4 = IP in packets[i]
    tcp = TCP in packets[i]
    udp = UDP in packets[i]
    type = ""
    src = ""
    dst = ""
    protocol = ""
    dport = ""
    sport = ""
    qry = "CREATE (a:ipData {type:{type}, src:{src}, dst:{dst}, protocol:{protocol}, sport:{sport}, dport: {dport}})"

    if (ipv6):
        type = "IPv6"
        src = packets[i][IPv6].src
        dst = packets[i][IPv6].src
    elif (ipv4):
        type = "IPv4"
        src = packets[i][IP].src
        dst = packets[i][IP].src
    if (tcp):
        protocol = "TCP"
        sport = packets[i][TCP].sport
        dport = packets[i][TCP].dport
    elif (udp):
        protocol = "UDP"
        sport = packets[i][UDP].sport
        dport = packets[i][UDP].dport

    session.run(qry, {"type":type,"src":src,"dst":dst,"protocol":protocol,"sport":sport,"dport":dport })
    i += 1
uploadEnd = datetime.now()

readStart = datetime.now()
result = session.run("MATCH (a:ipData) return a")
readEnd = datetime.now()

for record in result:
    print "--------------------------------------------"
    print "type: ", record['a'].properties['type']
    print "src: ", record['a'].properties['src']
    print "dst: ", record['a'].properties['dst']
    print "protocol:", record['a'].properties['protocol']
    print "sport: ", record['a'].properties['sport']
    print "dport: ", record['a'].properties['dport']

print "--------------------------------------------"
tdelta = uploadEnd - uploadStart
print "Upload start: ", uploadStart
print "Upload end:   ", uploadEnd
print "Upload duration: ", tdelta
print "--------------------------------------------"
tdelta = readEnd - readStart
print "Read start: ", readStart
print "Read end:   ", readEnd
print "Read duration: ", tdelta


    # print "-----------------------------------------------------------------------------------"
    # if IPv6 in packet:
    # print "IPv6 src: ", packet[IPv6].src
    # print "IPv6 dst: ", packet[IPv6].dst
    # if IP in packet:
    # print "IPv4 src: ", packet[IP].src
    # print "IPv4 dst: ", packet[IP].dst
    # if TCP in packet:
    # print "tcp sport: ", packet[TCP].sport
    # print "tcp dport: ", packet[TCP].dport
    # if UDP in packet:
    # print "udp sport: ", packet[UDP].sport
    # print "udp dport: ", packet[UDP].dport
    # print packet.summary()
