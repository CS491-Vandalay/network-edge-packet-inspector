'use strict';

let config = require('config');

const neo4j = require('neo4j-driver').v1;

module.exports = class Neo {

    constructor() {
        let uri = config.get("neo4jDb");
        // TODO: Encrypt/Decrypt password
        this.driver = neo4j.driver(uri, neo4j.auth.basic(config.get('neoLogin'), config.get('neoPass')));
        this.session = this.driver.session();
    }

    free() {
        this.driver.close();
    }

    readTest(sCallback,fCallback) {
        let session = this.driver.session();
        session
            .run('MATCH (n:Person) RETURN n.name')
            .then(sCallback,fCallback)
    }


    /************************************************************
     *
     *          TYPES
     *
     ***********************************************************/
    getTypes(sCallBack, fCallback){
        let session = this.driver.session();
        session
            .run('MATCH (n:Type) RETURN n.id, n.type')
            .then(sCallBack,fCallback);
    }



};