import json

from scapy.all import *
from scapy.layers.dns import DNS
from scapy.layers.inet6 import IPv6, IP, TCP, UDP

# class Analyser(object):
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


# Helper function for extracting packets IP header.
# Return | Json Object with the extracted information.
def getIPHeaders(pkt):
    data = {
        "version": pkt['IP'].version,
        "ihl": pkt['IP'].ihl,
        "tos": pkt['IP'].tos,
        "len": pkt['IP'].len,
        "id": pkt['IP'].id,
        "flags": ip_flags_list[pkt['IP'].flags],
        "frag": pkt['IP'].frag,
        "ttl": pkt['IP'].ttl,
        "proto": proto_list[pkt['IP'].proto],
        "src": pkt['IP'].src,
        "dst": pkt['IP'].dst
    }

    json_str = json.dumps(data)

    return json_str


# Helper function for extracting packets TCP header.
# Return | Json Object with the extracted information.
def getTCPHeaders(pkt):
    data = {
        "sport": pkt['TCP'].sport,
        "dport": pkt['TCP'].dport,
        "seq": pkt['TCP'].seq,
        "ack": pkt['TCP'].ack,
        "dataofs": pkt['TCP'].dataofs,
        "reserved": pkt['TCP'].reserved,
        "flags": pkt['TCP'].flags,
        "window": pkt['TCP'].window,
        "chksum": pkt['TCP'].chksum,
        "urgptr": pkt['TCP'].urgptr,
        "options": pkt['TCP'].options
    }

    json_str = json.dumps(data)

    return json_str


# Helper function for extracting packets IPv6 header.
# Return | Json Object with the extracted information.
def getIPv6Headers(pkt):
    data = {
        "version": pkt['IPv6'].version,
        "tc": pkt['IPv6'].tc,
        "fl": pkt['IPv6'].fl,
        "plen": pkt['IPv6'].plen,
        "nh": pkt['IPv6'].nh,
        "hlim": pkt['IPv6'].hlim,
        "src": pkt['IPv6'].src,
        "dst": pkt['IPv6'].dst
    }

    json_str = json.dumps(data)

    return json_str


# Helper function for extracting packets DNS header.
# Return | Json Object with the extracted information.
def getDNSHeaders(pkt):

    if pkt['DNS'].qdcount != 0:
        qd = getDNSQR(pkt)
    else:
        qd = pkt['DNS'].qd

    if pkt['DNS'].ancount != 0:
        an = getDNSAN(pkt)
    else:
        an = pkt['DNS'].an

    if pkt['DNS'].nscount != 0:
        ns = getDNSNS(pkt)
    else:
        ns = pkt['DNS'].ns

    if pkt['DNS'].arcount != 0:
        ar = getDNSAR(pkt)

    else:
        ar = pkt['DNS'].ar

    data = {
       "id": pkt['DNS'].id,
       "qr": pkt['DNS'].qr,
       "opcode": pkt['DNS'].opcode,
       "aa": pkt['DNS'].aa,
        "tc": pkt['DNS'].tc,
        "rd": pkt['DNS'].rd,
        "ra": pkt['DNS'].ra,
        "z": pkt['DNS'].z,
        "rcode": pkt['DNS'].rcode,
        "qdcount": pkt['DNS'].qdcount,
        "ancount": pkt['DNS'].ancount,
        "nscount": pkt['DNS'].nscount,
        "arcount": pkt['DNS'].arcount,
        "qd": qd,
        "an": an,
        "ns": ns,
        "ar": ar
   }

    json_str = json.dumps(data)

    return json_str


def getDNSQR(pkt):
    data = {
        "qname": pkt['DNSQR'].qname,
        "qtype": pkt['DNSQR'].qtype,
        "qclass": pkt['DNSQR'].qclass
    }

    return data

def getDNSAN(pkt):
    dns = pkt['DNS']

    data = {}

    for i in range(dns.ancount):
        name = "an" + str(i)
        answer = {
            "rrname": dns.an[i].rrname,
            "type": dns.an[i].type,
            "rclass": dns.an[i].rclass,
            "ttl": dns.an[i].ttl,
            "rdata": unicode(dns.an[i].rdata, errors='ignore')
        }
        data.update({name: answer})

    return data

def getDNSNS(pkt):
    dns = pkt['DNS']

    data = {}

    for i in range(dns.nscount):
        name = "ns" + str(i)
        answer = {
            "rrname": dns.ns[i].rrname,
            "type": dns.ns[i].type,
            "rclass": dns.ns[i].rclass,
            "ttl": dns.ns[i].ttl,
            "rdata": unicode(dns.ns[i].rdata, errors='ignore')
        }
        data.update({name: answer})

    return data

def getDNSAR(pkt):

    dns = pkt['DNS']

    data = {}

    for i in range(dns.arcount):
        name = "ar" + str(i)
        answer = {
            "rrname": dns.ar[i].rrname,
            "type": dns.ar[i].type,
            "rclass": dns.ar[i].rclass,
            "ttl": dns.ar[i].ttl,
            "rdata": unicode(dns.ar[i].rdata, errors='ignore')
        }
        data.update({name: answer})

    return data


def getRaw(pkt):

    data = str(pkt[Raw])
    data = unicode(data, errors='ignore')
    json_str = json.dumps(data)
    return json_str


def getUDPHeaders(pkt):
    try:
        data = {
            "sport": pkt['UDP'].sport,
            "dport": pkt['UDP'].dport,
            "len": pkt['UDP'].len,
            "chksum": pkt['UDP'].chksum
        }

    except Exception, e:
        data = {"error when extracting UDP layer": e}

    json_str = json.dumps(data)

    return json_str


def getHttpLoad(pkt):
    if TCP in pkt:
        json_str = getTCPHeaders(pkt)
        temp = json.loads(json_str)
        sport = temp["sport"]
        dport = temp["dport"]

        if 80 == sport:
            http_payload = str(pkt[TCP].payload)
            headers = HTTPHeaders(http_payload)

            if headers is not None:
                json_str = json.dumps(headers)
                return json_str

        if 80 == dport:
            http_payload = str(pkt[TCP].payload)
            headers = HTTPHeaders(http_payload)

            if headers is not None:
                json_str = json.dumps(headers)
                return json_str


def analyse(pkt):
    data = {}

    if IP in pkt:
        json_str = getIPHeaders(pkt)
        data.update({"IP": json.loads(json_str)})

    if TCP in pkt:
        json_str = getTCPHeaders(pkt)
        data.update({"TCP": json.loads(json_str)})

    if IPv6 in pkt:
        json_str = getIPv6Headers(pkt)
        data.update({"IPv6": json.loads(json_str)})

    if UDP in pkt:
        json_str = getUDPHeaders(pkt)
        data.update({"UDP": json.loads(json_str)})

    if Raw in pkt:
        json_str = getRaw(pkt)
        data.update({"raw": json.loads(json_str)})

    if DNS in pkt:
        json_str = getDNSHeaders(pkt)
        data.update({"DNS": json.loads(json_str)})

    httpLoad = getHttpLoad(pkt)

    if httpLoad is not None:
        data.update({"HTTPLOAD": json.loads(httpLoad)})

    json_str = json.dumps(data)

    return json_str


def HTTPHeaders(http_payload):
    try:
        # isolate headers
        headers_raw = http_payload[:http_payload.index("\r\n\r\n") + 2]
        regex = ur"(?:[\r\n]{0,1})(\w+\-\w+|\w+)(?:\ *:\ *)([^\r\n]*)(?:[\r\n]{0,1})"
        headers = dict(re.findall(regex, headers_raw, re.UNICODE))
        return headers
    except:
        return None
