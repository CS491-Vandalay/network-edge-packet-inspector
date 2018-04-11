import pygeoip

#gi = pygeoip.GeoIP('GeoLiteCity.dat')
#print gi.country_code_by_addr('64.233.161.99')
#print gi.region_by_addr('14.139.61.12')
#print gi.region_by_name('apple.com')
#print gi.record_by_addr('14.139.61.12')
# I don't know why this one does work
#print gi.org_by_name('dell.com')

def lookUpIP(ip):
    gi = pygeoip.GeoIP('GeoLiteCity.dat')
    return gi.record_by_addr(ip)
