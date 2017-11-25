import ConfigParser
from neo4j.v1 import GraphDatabase, basic_auth
import json

class DbHelper(object):


    def __init__(self):
        config = ConfigParser.RawConfigParser()
        config.read('Server.properties')
        self.__driver = GraphDatabase.driver(config.get('DatabaseSection','database.dbname'), auth=basic_auth(config.get('DatabaseSection','database.user'), config.get('DatabaseSection','database.password')))
        self.__session = self.__driver.session()

    #########################################
    #
    #   TEST
    #
    #########################################

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

    #########################################
    #
    #   TYPES
    #
    #########################################

    def getTypes(self):
        qry = "MATCH (a: Type) return a"
        res = []
        try:
            result = self.__session.run(qry)

            for record in result:
                res.append(record)

            return {"success":True, "results":res}
        except Exception as e:
            return {"success":False, "error":str(e)}

    def getType(self,name):
        qry = "MATCH (a:Type {name:{name}})"

        try:
            res = self.__session.run(qry,{"name":name})
            return {"success":True}
        except Exception as e:
            return  {"success":False,"error":str(e)}

    def saveTypes(self, document):
        qry = "CREATE (a:Type {name:{name}})"

        try:
            self.__session.run(qry,{"name": document['name']})

            return {"success":True}

        except Exception as e:
            return {"success":False,"error":str(e)}