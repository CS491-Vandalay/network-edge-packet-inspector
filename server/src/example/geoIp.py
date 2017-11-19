from scapy.all import *
from geoip import *

packets = rdpcap("pcap1.pcap")

count = 10
i = 0

while i < count:
    ipv6 = IPv6 in packets[i]
    ipv4 = IP in packets[i]
    print "------------------------------------------------\n"
    if (ipv4):
        type = "IPv4"
        src = packets[i][IP].src
        dst = packets[i][IP].dst
        print "src: " + src + ' dst: ' + dst
        match = geolite2.lookup(src)
        if(match is not None):
            print "SRC Country: " + match.country
            print "SRC Continent: " + match.continent
            print "SRC TimeZone: " + match.timezone

        match = geolite2.lookup(dst)
        if (match is not None):
            print "DST Country: " + match.country
            print "DST Continent: " + match.continent
            print "DST TimeZone: " + match.timezone

    elif(ipv6):
        src = packets[i][IPv6].src
        dst = packets[i][IPv6].dst
        print "src: " + src + ' dst: ' + dst
        match = geolite2.lookup(src)
        if (match is not None):
            print "SRC Country: " + match.country
            print "SRC Continent: " + match.continent
            print "SRC TimeZone: " + match.timezone

        match = geolite2.lookup(dst)
        if (match is not None):
            print "DST Country: " + match.country
            print "DST Continent: " + match.continent
            print "DST TimeZone: " + match.timezone


    i+=1