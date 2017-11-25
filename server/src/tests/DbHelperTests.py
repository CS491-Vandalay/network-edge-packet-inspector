import pytest

from server.src.DbHelper import DbHelper
import ConfigParser
from neo4j.v1 import GraphDatabase, basic_auth
from py2neo import Graph, Node, Relationship


class TestDbHelper():
    def setUp(self):
        self.dbHelper = DbHelper()

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


    def destroy(self):
        self._graph.data("MATCH(a) WHERE a.test='true' detach delete a")

    def test_SaveTest(self):
        self.setUp()
        data = {"name": "test", "test": "true"}
        res = self.dbHelper.saveTypes(data)
        if (res['success']):
            found = False
            qry = "MATCH (a:Type {name:{name}, test:{test}}) return a"
            result = self._graph.data(qry, {"name": "test", "test": "true"})
            for record in result:
                found = record['a']['name'] == 'test'
            self.destroy()
            assert found
        else:
            self.destroy()
            assert False

    def test_UniqueType(self):
        self.setUp()
        data = {"name": "test","test":"true"}
        res = self.dbHelper.saveTypes(data)

        if (res['success']):
            res = self.dbHelper.saveTypes(data)
            if not res['success']:
                if "already exists" in res['error']:
                    assert True
                else:
                    assert False
        self.destroy()

    def test_PacketsOfType(self):
        self.setUp()

        # Test Data
        typeData = Node("Type", name="test", test="true")
        packetOne = Node("Packet", src="127.0.0.1", dst="128.0.0.1", srcPort="1", dstPort="1", test="true")
        packetTwo = Node("Packet", src="127.0.0.2", dst="128.0.0.2", srcPort="2", dstPort="2", test="true")
        packetThree = Node("Packet", src="127.0.0.3", dst="128.0.0.3", srcPort="3", dstPort="3", test="true")
        typePacketOne = Relationship(typeData,"TypeOf",packetOne)
        typePacketTwo = Relationship(typeData, "TypeOf", packetTwo)

        # Create Type
        self._graph.create(typeData)

        # Create Packets
        self._graph.create(packetOne)
        self._graph.create(packetTwo)
        self._graph.create(packetThree)


        # Create TypeOf Relation
        self._graph.create(typePacketOne)
        self._graph.create(typePacketTwo)

        # Get Packets with TypeOf Relation to Type: 'test'
        results = self.dbHelper.getPacketsForType(typeData['name'])

        if results['success']:
            for record in results['results']:
                    assert record['a']['src'] == packetOne['src'] or record['a']['src'] == packetTwo['src']
        else:
            assert False

        self.destroy()

