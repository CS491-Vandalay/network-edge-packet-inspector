import pytest

from server.src.DbHelper import DbHelper
import ConfigParser
from neo4j.v1 import GraphDatabase, basic_auth

class TestDbHelper():

    def setUp(self):
        self.dbHelper = DbHelper()

        config = ConfigParser.RawConfigParser()
        config.read('Server.properties')
        driver = GraphDatabase.driver(config.get('DatabaseSection', 'database.dbname'),
                                      auth=basic_auth(config.get('DatabaseSection', 'database.user'),
                                                      config.get('DatabaseSection', 'database.password')))
        self.session = driver.session()


    def test_SaveTest(self):
        self.setUp()
        data = {"name":"test"}
        res = self.dbHelper.saveTypes(data)
        if(res['success']):
            qry = "MATCH (a:Type {name:{name}}) return a"
            result = self.session.run(qry, {"name": "test"})
            for record in result:
                assert record['a']['name'] == 'test'


    def test_UniqueType(self):
        self.setUp()
        data = {"name":"test"}
        res = self.dbHelper.saveTypes(data)

        if(res['success']):
            with pytest.raises(Exception):
                res = self.dbHelper.saveTypes(data)

