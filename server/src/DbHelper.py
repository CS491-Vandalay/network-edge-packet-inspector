import ConfigParser
from neo4j.v1 import GraphDatabase, basic_auth

class DbHelper(object):


    def __init__(self):
        config = ConfigParser.RawConfigParser()
        config.read('Server.properties')
        self.__driver = GraphDatabase.driver(config.get('DatabaseSection','database.dbname'), auth=basic_auth(config.get('DatabaseSection','database.user'), config.get('DatabaseSection','database.password')))
        self.__session = self.__driver.session()

    def testConn(self):
        success = False
        qry = "CREATE (a:testConn {name:'test'})"
        self.__session.run(qry)
        result = self.__session.run("MATCH (a:testConn) return a")
        for record in result:
            if(record['a'].properties['name'] is not None):
                success = record['a'].properties['name'] == 'test'
        qry = "MATCH (a:testConn) detach delete a"
        self.__session.run(qry)
        return success

