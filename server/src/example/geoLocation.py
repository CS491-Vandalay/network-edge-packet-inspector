def get_locs():
    """Return locations (latitude, longitude) for anonymous users."""
    # All IP addresses from anonymous users
    locs = []
    if current_app.config['GEO']:
        sql = '''SELECT DISTINCT(user_ip) FROM task_run
                 WHERE user_ip IS NOT NULL;'''
        results = session.execute(sql)

        geolite = current_app.root_path + '/../dat/GeoLiteCity.dat'
        gic = pygeoip.GeoIP(geolite)
        for row in results:
            loc = gic.record_by_addr(row.user_ip)
            if loc is None:
                loc = {}
            if (len(loc.keys()) == 0):
                loc['latitude'] = 0
                loc['longitude'] = 0
            locs.append(dict(loc=loc))
    return locs 