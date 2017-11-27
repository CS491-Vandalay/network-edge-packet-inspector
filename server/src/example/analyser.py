from scapy.all import *
import json


class Analyser(object):
    # list to look up protocols
    global ip_flags_list
    global proto_list

    ip_flags_list = ["0", "MF", "DF"]
    proto_list = ["HOPOPT", "CMP", "IGMP", "GGP", "IP-in-IP", "ST", "TCP", "CBT", "EGP", "IGP", "BBN-RCC-MON", "NVP-II",
                  "PUP", "ARGUS", "EMCON", "XNET", "CHAOS", "UDP", "MUX", "DCN-MEAS", "HMP", "PRM", "XNS-IDP",
                  "TRUNK-1", "TRUNK-2", "LEAF-1", "LEAF-2", "RDP", "IRTP", "ISO-TP4", "NETBLT", "MFE-NSP",
                  "MERIT-INP", "DCCP", "3PC", "IDPR", "XTP", "DDP", "IDPR-CMTP", "TP++", "IL", "IPv6", "SDRP",
                  "IPv6-Route", "IPv6-Frag", "IDRP", "RSVP", "GREs", "DSR", "BNA", "ESP", "AH", "I-NLSP", "SWIPE",
                  "NARP", "MOBILE", "TLSP", "SKIP", "IPv6-ICMP", "IPv6-NoNxt", "IPv6-Opts",
                  "Any host internal protocol", "CFTP", "Any local network", "SAT-EXPAK", "KRYPTOLAN", "RVD", "IPPC",
                  "Any distributed file system", "SAT-MON", "VISA", "IPCU,CPNX", "CPHB", "WSN", "PVP", "BR-SAT-MON",
                  "SUN-ND", "WB-MON", "WB-EXPAK", "ISO-IP", "VMTP", "SECURE-VMTP", "VINES", "TTP", "IPTM", "NSFNET-IGP",
                  "DGP", "TCF", "EIGRP,OSPF", "Sprite-RPC,LARP", "MTP", "AX.25", "OS", "MICP", "SCC-SP", "ETHERIP",
                  "ENCAP", "Any private encryption scheme", "GMTP", "IFMP", "PNNI", "PIM", "ARIS", "SCPS", "QNX",
                  "A/N", "IPComp", "SNP, Compaq-Peer", "IPX-in-IP", "VRRP", "PGM", "Any 0-hop protocol", "L2TP", "DDX",
                  "IATP", "STP", "SRP", "UTI", "SMP", "SM", "PTP", "IS-IS over IPv4", "FIRE", "CRTP", "CRUDP",
                  "SSCOPMCE", "IPLT", "SPS", "PIPE", "SCTP", "FC", "RSVP-E2E-IGNORE", "Mobility Header", "UDPLite",
                  "MPLS-in-IP", "manet", "HIP", "Shim6", "WESP", "ROHC"]

    def getIPheaders(self, pkt):

        try:
            data = {
                "version": pkt[IP].version,
                "ihl": pkt[IP].ihl,
                "tos": pkt[IP].tos,
                "len": pkt[IP].len,
                "id": pkt[IP].id,
                "flags": ip_flags_list[pkt[IP].flags],
                "frag": pkt[IP].frag,
                "ttl": pkt[IP].ttl,
                "proto": proto_list[pkt[IP].proto],
                "src": pkt[IP].src,
                "dst": pkt[IP].dst
            }
        except Exception, e:
            data = {"error when extracting IP layer": e}

        json_str = json.dumps(data)

        return json_str

    def getTCPheaders(self, pkt):
        try:
            data = {
                "sport": pkt[TCP].sport,
                "dport": pkt[TCP].dport,
                "seq": pkt[TCP].seq,
                "ack": pkt[TCP].ack,
                "dataofs": pkt[TCP].dataofs,
                "reserved": pkt[TCP].reserved,
                "flags": pkt[TCP].flags,
                "window": pkt[TCP].window,
                "chksum": pkt[TCP].chksum,
                "urgptr": pkt[TCP].urgptr,
                "options": pkt[TCP].options
            }
        except Exception, e:
            data = {"error when extracting TCP layer": e}

        json_str = json.dumps(data)

        return json_str

    def getIPv6headers(self, pkt):
        try:
            data = {
                "version": pkt[IPv6].version,
                "tc": pkt[IPv6].tc,
                "fl": pkt[IPv6].fl,
                "plen": pkt[IPv6].plen,
                "nh": pkt[IPv6].nh,
                "hlim": pkt[IPv6].hlim,
                "src": pkt[IPv6].src,
                "dst": pkt[IPv6].dst
            }
        except Exception, e:
            data = {"error when extracting IPv6 layer": e}

        json_str = json.dumps(data)

        return json_str

    def getDNS(self, pkt):
        try:
            data = {
                "id": pkt[DNS].id,
                "qr": pkt[DNS].qr,
                "opcode": pkt[DNS].opcode,
                "aa": pkt[DNS].aa,
                "tc": pkt[DNS].tc,
                "rd": pkt[DNS].rd,
                "ra": pkt[DNS].ra,
                "z": pkt[DNS].z,
                "rcode": pkt[DNS].rcode,
                "qdcount": pkt[DNS].qdcount,
                "ancount": pkt[DNS].ancount,
                "nscount": pkt[DNS].nscount,
                "arcount": pkt[DNS].arcount,
                "an": pkt[DNS].an,
                "ns": pkt[DNS].ns,
                "ar": pkt[DNS].ar
            }

            print pkt[DNS].an

        except Exception, e:
            data = {"error when extracting DNS layer": e}

        json_str = json.dumps(data)

        return json_str

    def getDNSQR(self, pkt):
        try:
            data = {
                "qname": pkt[DNSQR].qname,
                "qtype": pkt[DNSQR].qtype,
                "qclass": pkt[DNSQR].qclass
            }

        except Exception, e:
            data = {"error when extracting DNS layer": e}

        json_str = json.dumps(data)

        return json_str

    def getRaw(self, pkt):
        try:
            temp = pkt[Raw].load
            # temp = " ".join(hex(ord(n)) for n in pkt[Raw].load)
            # data = {"raw": temp.encode("hex")}
        except Exception, e:
            data = {"error when extracting Raw layer": e}
            json_str = json.dumps(data)
            return json_str

        return temp

        # counter = 0;
        #
        # rdpcap comes from scapy and loads in our pcap file
        # packets = rdpcap('/home/jhohan/CS491/network-edge-packet-inspector/server/src/example/pcap1.pcap')
        #
        #
        # Let's iterate through every packet
        # for packet in packets:
        #     counter = counter+1
        # packet.display()
        #
        #     if IP in packet:
        #     #     packet.summary()
        #          counter = counter + 1
        #     else:
        #         packet.display()
        #     #
        #     # # elif  DNS in packet:
        #     #    packet.display()
        #     #    counter = counter + 1
        #     #
        #     # We're only interested packets with a DNS Round Robin layer
        #     #if packet.haslayer(DNSRR):
        #
        #        # packet.display();
        #
        #         # If the an(swer) is a DNSRR, print the name it replied with.
        #        # if isinstance(packet.an, DNSRR):
        #           #  print(packet.an.rrname)
        #
        # print("total packets = ");
        # print(counter);
