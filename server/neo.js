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

    readTest(sCallback, fCallback) {
        let session = this.driver.session();
        session
            .run('MATCH (n:Person) RETURN n.name')
            .then(sCallback, fCallback)
    }


    /************************************************************
     *
     *          PCAP TYPES
     *
     ***********************************************************/
    getTypes() {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Type) RETURN n.id, n.type')
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({"id": record.get("n.id"), "type": record.get("n.type")});
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get types", "err": err})
                });
        })
    }

    /************************************************************
     *
     *          PCAP DEVICES
     *
     ***********************************************************/
    getAllDevices() {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Device) RETURN n.id, n.name, n.ip')
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({"id": record.get("n.id"), "type": record.get("n.name"), "ip": record.get("n.ip")});
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get types", "err": err})
                });
        })
    }

    getDeviceByIp(ip) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Device) WHERE n.ip=$ip RETURN n.id, n.name, n.ip', {"ip": ip})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({"id": record.get("n.id"), "type": record.get("n.name"), "ip": record.get("n.ip")});
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get types", "err": err})
                });
        })
    }

    getDeviceByName(name) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Device) WHERE n.name=$name RETURN n.id, n.name, n.ip', {"name": name})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({"id": record.get("n.id"), "type": record.get("n.name"), "ip": record.get("n.ip")});
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get types", "err": err})
                });
        })
    }

    getDeviceById(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Device) WHERE n.id=$id RETURN n.id, n.name, n.ip', {"id": id})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({"id": record.get("n.id"), "type": record.get("n.name"), "ip": record.get("n.ip")});
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get types", "err": err})
                });
        })
    }
};