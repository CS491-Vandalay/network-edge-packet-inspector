import ConfigParser
from neo4j.v1 import GraphDatabase, basic_auth

config = ConfigParser.RawConfigParser()
config.read('Server.properties')
driver = GraphDatabase.driver(config.get('DatabaseSection','database.dbname'), auth=basic_auth(config.get('DatabaseSection','database.user'), config.get('DatabaseSection','database.password')))
session = driver.session()

#######################################
#
# CONSTRAINTS
#
#######################################
constraints = []

constraints.append("CREATE CONSTRAINT ON (type:Type) ASSERT type.name IS UNIQUE")

for constraint in constraints:
    try:
        session.run(constraint)
    except Exception as e:
        print str(e)

#######################################
#
# INDEXES
#
#######################################
indexes = []

