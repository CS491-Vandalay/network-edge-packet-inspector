import os
from DbHelper import DbHelper

dbHelper = DbHelper()

success = "Fail"
if(dbHelper.testConn()):
    success = "Success"
print "Testing Connection: " + success
