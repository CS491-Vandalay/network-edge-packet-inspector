import ConfigParser

from py2neo import Graph, Node


class DbHelper(object):
    def __init__(self):
        config = ConfigParser.RawConfigParser()
        config.read('Server.properties')
        self._graph = Graph(host=config.get('DatabaseSection', 'database.dbhost'),
                                            user=config.get('DatabaseSection', 'database.user'),
                                            password=config.get('DatabaseSection', 'database.password'))

        # self._graph = Graph(host=config.get('DatabaseSection', 'database.dbhost'),
        #                     bolt=True,
        #                     bolt_port=int(config.get('DatabaseSection','database.bolt-port')),
        #                     secure=True,
        #                     user=config.get('DatabaseSection', 'database.user'),
        #                     password=config.get('DatabaseSection', 'database.password'))

    #########################################
    #
    #   TEST
    #
    #########################################

    def testConn(self):
        success = False
        test = Node("TestConn", name="test")
        self._graph.create(test)
        result = self._graph.data("MATCH (a:testConn) return a")
        for record in result:
            if (record['a'].properties['name'] is not None):
                success = record['a'].properties['name'] == 'test'
        self._graph.data("MATCH (a:testConn) detach delete a")
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
            result = self._graph.data(qry)

            for record in result:
                res.append(record)

            return {"success": True, "results": res}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def getType(self, name):
        qry = "MATCH (a:Type {name:{name}})"

        try:
            res = self._graph.data(qry, {"name": name})

            results = []
            for record in res:
                results.append(record)

            return {"success": True, "results": results}

        except Exception as e:
            return {"success": False, "error": str(e)}

    def saveTypes(self, document):
        qry = "CREATE (a:Type {name:{name},test:{test})"

        try:
            typeNode = Node("Type", name=document['name'], test=document['test'])
            self._graph.create(typeNode)

            return {"success": True}

        except Exception as e:
            return {"success": False, "error": str(e)}

    def getPacketsForType(self, param):
        qry = "MATCH (b:Type)-[:TypeOf]->(a:Packet) return a"

        try:
            res = self._graph.data(qry)

            results = []

            for record in res:
                results.append(record)

            return {"success": True, "results": results}
        except Exception as e:
            return {"success": False, "error": str(e)}

        pass
