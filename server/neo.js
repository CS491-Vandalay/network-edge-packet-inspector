'use strict';

let config = require('config');

const neo4j = require('neo4j-driver').v1;

module.exports = class Neo {

    constructor() {
        let uri = config.get("neo4jDb");
        // TODO: Encrypt/Decrypt password
        console.log(config.get("neoLogin"), config.get("neoPass"))
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
                .run('MATCH (n:Type) RETURN n.id, n.name')
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({"id": record.get("n.id"), "name": record.get("n.name")});
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

    getTypeByName(name) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Type) WHERE n.name=$name RETURN n.id, n.name', {"name": name})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({"id": record.get("n.id"), "name": record.get("n.name")});
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

    getTypeById(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Type) WHERE n.id=$id RETURN n.id, n.name', {"id": "" + id})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({"id": record.get("n.id"), "name": record.get("n.name")});
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

    addType(body) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
            // Get the next id
                .run('MATCH (n:Type) RETURN n.id ORDER BY n.id DESC LIMIT 1')
                .then((data) => {
                    let lastId = parseInt(data["records"][0].get("n.id"));
                    return lastId + 1;
                }).then((id) => {
                session.run('CREATE (n:Type {id: $id, name: $name}) RETURN n.id, n.name',
                    {"id": id + "", "name": body.name}).then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({"id": record.get("n.id"), "type": record.get("n.name"),});
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
            }).catch((err) => {
                session.close();
                reject({"success": false, "msg": "failed to save type", "err": err})
            });
        })
    }

    removeTypeById(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Type) WHERE n.id=$id DETACH DELETE n', {"id": id})
                .then(() => {
                    session.close();
                    resolve({"success": true, "results": {}})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to delete type", "err": err})
                });
        })
    }

    getNumOfTypes() {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Type) RETURN toFloat(COUNT(n)) as c')
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "count": record.get('c')
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body[0]})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getNumTypesPerDevice(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('Match (d:Device)-[]-(p:Packet)-[:typeOf]-(t:Type) where d.id=$id return t.name, toFloat(count(t)) as c', {'id': "" + id})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "name": record.get("t.name"),
                            "count": record.get('c')
                        });
                    });
                    console.log("body:", body);
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get type count", "err": err})
                });
        })
    }

    getPacketsByType() {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (t:Type)<-[:typeOf]-(p) WHERE t.name="text" return p.id, p.sourceIp, p.destinationIp, p.port')
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("p.id"),
                            "sourceIp": record.get("p.sourceIp"),
                            "destinationIp": record.get("p.destinationIp"),
                            "port": record.get("p.port")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
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
                        body.push({"id": record.get("n.id"), "name": record.get("n.name"), "ip": record.get("n.ip")});
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
                .run('MATCH (n:Device) WHERE n.id=$id RETURN n.id, n.name, n.ip', {"id": "" + id})
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

    getDeviceLocation(deviceId) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Device)-[]-(l:Location) WHERE n.id=$id RETURN l.id, l.country', {"id": "" + deviceId})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("l.id"),
                            "country": record.get("l.country")
                        });
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

    saveDevice(body) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
            // Get the next id
                .run('MATCH (n:Device) RETURN n.id ORDER BY n.id DESC LIMIT 1')
                .then((data) => {
                    let lastId = parseInt(data["records"][0].get("n.id"));
                    return lastId + 1;
                }).then((id) => {
                session.run('CREATE (n:Device {id: $id, name: $name, ip: $ip}) RETURN n.id, n.name, n.ip',
                    {"id": id + "", "name": body.name, "ip": body.ip}).then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({"id": record.get("n.id"), "type": record.get("n.name"), "ip": record.get("n.ip")});
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
            }).catch((err) => {
                session.close();
                reject({"success": false, "msg": "failed to save device", "err": err})
            });
        })
    }

    deleteDevice(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Device) WHERE n.id=$id DETACH DELETE n', {"id": id})
                .then(() => {
                    session.close();
                    resolve({"success": true, "results": {}})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to delete device", "err": err})
                });
        })
    }

    getNumOfDevices() {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Device) RETURN toFloat(COUNT(n)) as c')
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "count": record.get('c')
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body[0]})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getPacketsFromDevice(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Device)-[:comingFrom]->(p) WHERE n.id=$id RETURN p.id, p.sourceIp, p.destinationIp, p.port', {"id": id + ""})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("p.id"),
                            "sourceIp": record.get("p.sourceIp"),
                            "destinationIp": record.get("p.destinationIp"),
                            "port": record.get("p.port"),
                            "direction": "From"
                        });
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

    getPacketsToDevice(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (p)-[:goingTo]->(d:Device) WHERE d.id=$id RETURN p.id, p.sourceIp, p.destinationIp, p.port', {"id": id + ""})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("p.id"),
                            "sourceIp": record.get("p.sourceIp"),
                            "destinationIp": record.get("p.destinationIp"),
                            "port": record.get("p.port"),
                            "direction": "To"
                        });
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

    getOriginDeviceForPacket(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (p:Packet)-[:goingTo]->(d:Device) WHERE p.id=$id return d.id, d.ip, d.name', {"id": id + ""})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("d.id"),
                            "ip": record.get("d.ip"),
                            "name": record.get("d.name")
                        });
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

    getDestinationDeviceForPacket(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (p:Packet)<-[:comingFrom]-(d:Device) WHERE p.id=$id return d.id, d.ip, d.name', {"id": id + ""})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("d.id"),
                            "ip": record.get("d.ip"),
                            "name": record.get("d.name")
                        });
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
     *          PCAP PACKETS
     *
     ***********************************************************/

    getPackets() {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Packet) RETURN n.id, n.sourceIp, n.destinationIp, n.port')
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("n.id"),
                            "sourceIp": record.get("n.sourceIp"),
                            "destinationIp": record.get("n.destinationIp"),
                            "port": record.get("n.port")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getPacketsBySourceIp(ip) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Packet) WHERE n.sourceIp=$ip RETURN n.id, n.sourceIp, n.destinationIp, n.port', {"ip": ip})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("n.id"),
                            "sourceIp": record.get("n.sourceIp"),
                            "destinationIp": record.get("n.destinationIp"),
                            "port": record.get("n.port")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getPacketsByDestinationIp(ip) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Packet) WHERE n.destinationIp=$ip RETURN n.id, n.sourceIp, n.destinationIp, n.port', {"ip": ip})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("n.id"),
                            "sourceIp": record.get("n.sourceIp"),
                            "destinationIp": record.get("n.destinationIp"),
                            "port": record.get("n.port")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getPacketsByPort(port) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Packet) WHERE n.port=$port RETURN n.id, n.sourceIp, n.destinationIp, n.port', {"port": prt})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("n.id"),
                            "sourceIp": record.get("n.sourceIp"),
                            "destinationIp": record.get("n.destinationIp"),
                            "port": record.get("n.port")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getPacketType(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (p:Packet)-[:typeOf]->(t:Type) WHERE p.id=$id RETURN t.id, t.name', {"id": id})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("t.id"),
                            "name": record.get("t.name")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    savePacket(body) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
            // Get the next id
                .run('MATCH (n:Packet) RETURN n.id ORDER BY n.id DESC LIMIT 1')
                .then((data) => {
                    let lastId = parseInt(data["records"][0].get("n.id"));
                    return lastId + 1;
                }).then((id) => {
                session.run('CREATE (n:Packet {id: $id, sourceIp: $sourceIp, destinationIp: $destinationIp, sourcePort: $sourcePort, destPort: $destPort}) RETURN n.id, n.name, n.sourceIp, n.destinationIp, n.sourcePort, n.destPort',
                    {
                        "id": id + "",
                        "sourceIp": body.sourceIp + "",
                        "destinationIp": body.destinationIp + "",
                        "sourcePort": body.sPort + "",
                        "destPort": body.dPort + "",
                    }).then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("n.id"),
                            "sourceIp": record.get("n.sourceIp"),
                            "destinationIp": record.get("n.destinationIp"),
                            "sourcePort": record.get("n.sourcePort"),
                            "destinationPort": record.get("n.destPort")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
            }).catch((err) => {
                session.close();
                reject({"success": false, "msg": "failed to save packet", "err": err})
            });
        })
    }

    // TODO: FIX THIS
    savePacketBulk(packets) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
            // Get the next id
                .run('MATCH (n:Packet) RETURN n.id ORDER BY n.id DESC LIMIT 1')
                .then((data) => {
                    let lastId = parseInt(data["records"][0].get("n.id"));
                    return lastId + 1;
                }).then((id) => {
                session.run('UNWIND {packets} AS n CREATE (:Packet {id: $id, sourceIp: n.sourceIp, destinationIp: n.destinationIp, port: n.port})',
                    {
                        "id": (id += 1) + "",
                        "packets": packets
                    }).then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("n.id"),
                            "sourceIp": record.get("n.sourceIp"),
                            "destinationIp": record.get("n.destinationIp"),
                            "port": record.get("n.port")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
            }).catch((err) => {
                session.close();
                reject({"success": false, "msg": "failed to save packet", "err": err})
            });
        })
    }

    deletePacket(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Packet) WHERE n.id=$id DETACH DELETE n', {"id": id})
                .then((data) => {
                    session.close();
                    resolve({"success": true, "results": {}})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to delete device", "err": err})
                });
        })
    }

    deletePacketBySourceIp(ip) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Packet) WHERE n.sourceIp=$ip DETACH DELETE n', {"ip": ip})
                .then((data) => {
                    session.close();
                    resolve({"success": true, "results": {}})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to delete packet", "err": err})
                });
        })
    }

    deletePacketByDestinationIp(ip) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Packet) WHERE n.destinationIp=$ip DETACH DELETE n', {"ip": ip})
                .then(() => {
                    session.close();
                    resolve({"success": true, "results": {}})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to delete packet", "err": err})
                });
        })
    }

    deletePacketByPort(port) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Packet) WHERE n.port=$port DETACH DELETE n', {"port": port})
                .then(() => {
                    session.close();
                    resolve({"success": true, "results": {}})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to delete packet", "err": err})
                });
        })
    }

    getNumOfPackets() {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Packet) RETURN toFloat(COUNT(n)) as c')
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "count": record.get('c')
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body[0]})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getNumOfPacketsTypeToLocation(tid, lid) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (t:Type)<-[:typeOf]-(p)-[:goingTo]->()-[:locatedIn]->(l) WHERE l.id=$lid AND t.id=$tid return toFloat(count(p)) as c', {
                    "lid": "" + lid,
                    "tid": "" + tid
                })
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "count": record.get('c')
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body[0]})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getPacketsFromLocation(lid) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (l:Location)<-[r:locatedIn]-()<-[:goingTo]-(p) WHERE l.id=$id RETURN p.id, p.sourceIp, p.destinationIp, p.port', {"id": lid})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("p.id"),
                            "sourceIp": record.get("p.sourceIp"),
                            "destinationIp": record.get("p.destinationIp"),
                            "port": record.get("p.port")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getPacketsToLocation(lid) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (l:Location)<-[r:locatedIn]-()-[:comingFrom]->(p) WHERE l.id=$id RETURN p.id, p.sourceIp, p.destinationIp, p.port', {"id": lid})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("p.id"),
                            "sourceIp": record.get("p.sourceIp"),
                            "destinationIp": record.get("p.destinationIp"),
                            "port": record.get("p.port")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getSourceLocationOfPacket(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (p:Packet)<-[:comingFrom]-()-[:locatedIn]->(l) WHERE p.id=$id RETURN l.id, l.country', {"id": id})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("l.id"),
                            "country": record.get("l.country")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getDevicesForPacketId(packetID) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Device)-[r]-(p:Packet) WHERE p.id=$id RETURN TYPE(r) as direction, n.id, n.name, n.ip', {"id": "" + packetID})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("n.id"),
                            "type": record.get("n.name"),
                            "ip": record.get("n.ip"),
                            "direction": record.get("direction")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get origin device", "err": err})
                });
        })
    }

    /************************************************************
     *
     *          PCAP LOCATIONS
     *
     ***********************************************************/

    getLocations() {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Location) RETURN n.id, n.country')
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("n.id"),
                            "country": record.get("n.country")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getLocationByCountry(country) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Location) WHERE n.country=$country RETURN n.id, n.country', {"country": country})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("n.id"),
                            "country": record.get("n.country")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getLocationById(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Location) WHERE n.id=$id RETURN n.id, n.country', {"id": id})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("n.id"),
                            "country": record.get("n.country")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getNumDeviceFromLocationId(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Location)<-[r:locatedIn]-() WHERE n.id=$id RETURN toFloat(COUNT(r)) as c', {"id": id})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "count": record.get('c')
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body[0]})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getNumDeviceFromLocationCountry(country) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Location)<-[r:locatedIn]-() WHERE n.country=$country RETURN toFloat(COUNT(r)) as c', {"country": country})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "count": record.get('c')
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body[0]})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getNumOfLocations() {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (n:Location) RETURN toFloat(COUNT(n)) as c')
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "count": record.get('c')
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body[0]})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get packets", "err": err})
                });
        })
    }

    getDestinationLocationOfPacket(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (p:Packet)-[:goingTo]-()-[:locatedIn]->(l) WHERE p.id=$id RETURN l.id, l.country', {"id": id})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("l.id"),
                            "country": record.get("l.country")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get Location", "err": err})
                });
        })
    }

    getSourceLocationOfPacket(id) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session
                .run('MATCH (p:Packet)-[:comingFrom]-()-[:locatedIn]->(l) WHERE p.id=$id RETURN l.id, l.country', {"id": id})
                .then((data) => {
                    let body = [];
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("l.id"),
                            "country": record.get("l.country")
                        });
                    });
                    session.close();
                    resolve({"success": true, "results": body})
                })
                .catch((err) => {
                    session.close();
                    reject({"success": false, "msg": "failed to get Location", "err": err})
                });
        })
    }

    /************************************************************
     *
     *          PCAP RELATIONSHIPS
     *
     ***********************************************************/

    createComingFrom(packetId, deviceId) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session.run('MATCH (p:Packet) WHERE p.id=$pid return p.id,p.sourceIp', {"pid": packetId + ""}).then((data) => {
                // Expecting one record
                if (data["records"].length !== 1) {
                    reject({"success": false, "msg": "failed to create relationship", "err": "packet doesn't exist"})
                }
                return data["records"][0]
            }).then((packet) => {
                session.run('MATCH (d:Device) WHERE d.id=$did return d.id,d.ip', {"did": deviceId + ""}).then((data) => {
                    // Expecting one record
                    if (data["records"].length !== 1) {
                        reject({
                            "success": false,
                            "msg": "failed to create relationship",
                            "err": "device doesn't exist"
                        })
                    } else if (packet.get("p.sourceIp") !== data["records"][0].get("d.ip")) {
                        reject({
                            "success": false,
                            "msg": "failed to create relationship",
                            "err": "packet source ip does not match device ip"
                        })
                    }
                }).then(() => {
                    session.run('MATCH (p:Packet),(d:Device) WHERE p.id=$pid AND d.id=$did CREATE (p)<-[r:comingFrom]-(d)',
                        {
                            "pid": packetId + "",
                            "did": deviceId + ""
                        }).then(() => {
                        session.close();
                        resolve({"success": true})
                    })
                })
            });
        }).catch((err) => {
            session.close();
            throw err
        });
    }

    createGoingTo(packetId, deviceId) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session.run('MATCH (p:Packet) WHERE p.id=$pid return p.id,p.destinationIp', {"pid": packetId + ""}).then((data) => {
                // Expecting one record
                if (data["records"].length !== 1) {
                    reject({"success": false, "msg": "failed to create relationship", "err": "packet doesn't exist"})
                }
                return data["records"][0]
            }).then((packet) => {
                session.run('MATCH (d:Device) WHERE d.id=$did return d.id,d.ip', {"did": deviceId + ""}).then((data) => {
                    // Expecting one record
                    if (data["records"].length !== 1) {
                        reject({
                            "success": false,
                            "msg": "failed to create relationship",
                            "err": "device doesn't exist"
                        })
                    } else if (packet.get("p.destinationIp") !== data["records"][0].get("d.ip")) {
                        reject({
                            "success": false,
                            "msg": "failed to create relationship",
                            "err": "packet destination ip does not match device ip"
                        })
                    }
                }).then(() => {
                    session.run('MATCH (p:Packet),(d:Device) WHERE p.id=$pid AND d.id=$did CREATE (p)-[r:goingTo]->(d)',
                        {
                            "pid": packetId + "",
                            "did": deviceId + ""
                        }).then(() => {
                        session.close();
                        resolve({"success": true})
                    })
                })
            });
        }).catch((err) => {
            session.close();
            throw err
        });
    }

    createTypeOf(packetId, typeId) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session.run('MATCH (p:Packet) WHERE p.id=$pid return p.id', {"pid": packetId + ""}).then((data) => {
                // Expecting one record
                if (data["records"].length !== 1) {
                    reject({"success": false, "msg": "failed to create relationship", "err": "packet doesn't exist"})
                }
            }).then(() => {
                session.run('MATCH (t:Type) WHERE t.id=$tid return t.id', {"tid": typeId + ""}).then((data) => {
                    // Expecting one record
                    if (data["records"].length !== 1) {
                        reject({
                            "success": false,
                            "msg": "failed to create relationship",
                            "err": "type doesn't exist"
                        })
                    }
                }).then(() => {
                    session.run('MATCH (p:Packet),(t:Type) WHERE p.id=$pid AND t.id=$tid CREATE (p)-[r:typeOf]->(t)',
                        {
                            "pid": packetId + "",
                            "tid": typeId + ""
                        }).then(() => {
                        session.close();
                        resolve({"success": true})
                    })
                })
            });
        }).catch((err) => {
            session.close();
            throw err
        });
    }

    createLocatedIn(deviceId, locationId) {
        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            session.run('MATCH (d:Device) WHERE d.id=$did return d.id', {"did": deviceId + ""}).then((data) => {
                // Expecting one record
                if (data["records"].length !== 1) {
                    reject({"success": false, "msg": "failed to create relationship", "err": "device doesn't exist"})
                }
            }).then(() => {
                session.run('MATCH (l:Location) WHERE l.id=$lid return l.id', {"lid": locationId + ""}).then((data) => {
                    // Expecting one record
                    if (data["records"].length !== 1) {
                        reject({
                            "success": false,
                            "msg": "failed to create relationship",
                            "err": "location doesn't exist"
                        })
                    }
                }).then(() => {
                    session.run('MATCH (d:Device),(l:Location) WHERE d.id=$did AND l.id=$lid CREATE (d)-[r:locatedIn]->(l)',
                        {
                            "did": deviceId + "",
                            "lid": locationId + ""
                        }).then(() => {
                        session.close();
                        resolve({"success": true})
                    })
                })
            });
        }).catch((err) => {
            session.close();
            throw err
        });
    }

    /************************************************************
     *
     *          PCAP SAVE
     *
     ***********************************************************/
    savePcapFile(packetData) {
        console.log(packetData);
        let packet = {};
        if (packetData.hasOwnProperty('IP')) {
            packet["sourceIp"] = packetData["IP"]["src"];
            packet["destinationIp"] = packetData["IP"]["dst"];
            let protocol = packetData["IP"]["proto"];
            if (packetData.hasOwnProperty(protocol)) {
                if (packetData[protocol].hasOwnProperty("sport")) {
                    packet["sPort"] = packetData[protocol]["sport"];
                    packet["dPort"] = packetData[protocol]["dport"];
                }
            }
        }
        if (packetData.hasOwnProperty("HTTPLOAD")) {
            packet["typeName"] = packetData["HTTPLOAD"].hasOwnProperty("Content-Type") ? packetData["HTTPLOAD"]["Content-Type"] : "";
        } else {
            packet["typeName"] = "Unkown";
        }

        packet["DESTINATION"] = packetData.hasOwnProperty("DESTINATION") ? this.extractLocation(packetData["DESTINATION"]) : this.setEmptyLocation();
        packet["SOURCE"] = packetData.hasOwnProperty("SOURCE") ? this.extractLocation(packetData["SOURCE"]) : this.setEmptyLocation();
        let ids = {};

        let session = this.driver.session();
        return new Promise((resolve, reject) => {
            console.log("SOURCE: ", packet["SOURCE"]);
            return session.run(`
               MERGE (np:Packet {destinationIp:$destinationIp, sport:$sport, dport:$dport, sourceIp:$sourceIp})
               MERGE (nt:Type {name:$typeName})
               MERGE (nsl:Location {city:$sCity,regionCode:$sRegionCode,areaCode:$sAreaCode,timeZone:$sTimeZone,dmaCode:$sDmaCode,
               metroCode:$sMetroCode,countryCode3:$sCountryCodeThree,countryName:$sCountryName,postalCode:$sPostalCode,longitude:$sLong,countryCode:$sCountryCode,
               latitude:$sLat,continent:$sContinent})
               MERGE (nsd:Device {ip:$sourceIp})
               RETURN toFloat(ID(np)) as np, toFloat(ID(nt)) as nt, toFloat(ID(nsl)) as nsl, toFloat(ID(nsd)) as nsd`, {
                "destinationIp": packet["destinationIp"],
                "sourceIp": packet["sourceIp"],
                "sport": packet["sPort"],
                "dport": packet["dPort"],
                "typeName": packet["typeName"],
                "sCity": packet["SOURCE"]["city"],
                "sRegionCode": packet["SOURCE"]["regionCode"],
                "sAreaCode": packet["SOURCE"]["areaCode"],
                "sTimeZone": packet["SOURCE"]["timeZone"],
                "sDmaCode": packet["SOURCE"]["dmaCode"],
                "sMetroCode": packet["SOURCE"]["metroCode"],
                "sCountryCodeThree": packet["SOURCE"]["countryCode3"],
                "sCountryName": packet["SOURCE"]["countryName"],
                "sPostalCode": packet["SOURCE"]["postalCode"],
                "sLong": packet["SOURCE"]["longitude"],
                "sCountryCode": packet["SOURCE"]["countryCode"],
                "sLat": packet["SOURCE"]["latitude"],
                "sContinent": packet["SOURCE"]["continent"]
            }).then((data) => {
                if (data["records"].length !== 1) {
                    console.log("here");
                    reject({
                        "success": false,
                        "msg": "failed to create relationship",
                        "err": "location doesn't exist"
                    })
                } else {
                    ids["np.id"] = data["records"][0].get("np");
                    ids["nt.id"] = data["records"][0].get("nt");
                    ids["nsl.id"] = data["records"][0].get("nsl");
                    ids["nsd.id"] = data["records"][0].get("nsd");
                    console.log("Dest: ", packet["DESTINATION"]);
                    return session.run(`
                        MERGE (ndl:Location {city:$dCity,regionCode:$dRegionCode,areaCode:$dAreaCode,timeZone:$dTimeZone,dmaCode:$dDmaCode,
                           metroCode:$dMetroCode,countryCode3:$dCountryCodeThree,countryName:$dCountryName,postalCode:$dPostalCode,longitude:$dLong,countryCode:$dCountryCode,
                           latitude:$dLat,continent:$dContinent})
                        MERGE (ndd:Device {ip:$destinationIp})
                        RETURN toFloat(ID(ndd)) as ndd, toFloat(ID(ndl)) as ndl`, {
                        "destinationIp": packet["destinationIp"],
                        "dCity": packet["DESTINATION"]["city"],
                        "dRegionCode": packet["DESTINATION"]["regionCode"],
                        "dAreaCode": packet["DESTINATION"]["areaCode"],
                        "dTimeZone": packet["DESTINATION"]["timeZone"],
                        "dDmaCode": packet["DESTINATION"]["dmaCode"],
                        "dMetroCode": packet["DESTINATION"]["metroCode"],
                        "dCountryCodeThree": packet["DESTINATION"]["countryCode3"],
                        "dCountryName": packet["DESTINATION"]["countryName"],
                        "dPostalCode": packet["DESTINATION"]["postalCode"],
                        "dLong": packet["DESTINATION"]["longitude"],
                        "dCountryCode": packet["DESTINATION"]["countryCode"],
                        "dLat": packet["DESTINATION"]["latitude"],
                        "dContinent": packet["DESTINATION"]["continent"]
                    }).then((data) => {
                        if (data["records"].length !== 1) {
                            console.log("here2");
                            reject({
                                "success": false,
                                "msg": "failed to create relationship",
                                "err": "location doesn't exist"
                            })
                        } else {
                            ids["ndd.id"] = data["records"][0].get("ndd");
                            ids["ndl.id"] = data["records"][0].get("ndl");

                            console.log("IDS: ", ids);

                            return session.run(`MATCH (p:Packet) WHERE ID(p)=$np WITH p
                                MATCH (t:Type) WHERE ID(t)=$nt WITH p,t  
                                MATCH (sl:Location) WHERE ID(sl)=$nsl WITH p,t,sl
                                MATCH (dl:Location) WHERE ID(dl)=$ndl WITH p,t,sl,dl
                                MATCH (sd:Device) WHERE ID(sd)=$nsd WITH p,t,sl,dl,sd
                                MATCH (dd:Device) WHERE ID(dd)=$ndd WITH p,t,sl,dl,sd,dd
                                
                                CREATE (p)-[:goingTo]->(dd)
                                CREATE (p)<-[:comingFrom]-(sd)
                                CREATE (p)-[:typeOf]->(t)
                                CREATE (sd)-[:locatedIn]->(sl)
                                CREATE (dd)-[:locatedIn]->(dl)`, {
                                "np": ids["np.id"],
                                "nt": ids["nt.id"],
                                "nsl": ids["nsl.id"],
                                "ndl": ids["ndl.id"],
                                "nsd": ids["nsd.id"],
                                "ndd": ids["ndd.id"]
                            }).then(() => {
                                console.log("Finished");
                                session.close();
                                resolve({"success": true})
                            }).catch((err) => {
                                session.close();
                                console.log("Error: ", err);
                                reject({"success": false, "msg": "failed to save packet file", "err": err})
                            })
                        }
                    }).catch((err) => {
                        session.close();
                        console.log("Error: ", err);
                        reject({"success": false, "msg": "failed to save packet file", "err": err})
                    });
                }
            }).catch((err) => {
                session.close();
                console.log("Error: ", err);
                reject({"success": false, "msg": "failed to save packet file", "err": err})
            })
        }).catch((err) => {
            session.close();
            console.log("Error: ", err);
            return ({"success": false, "msg": "failed to save packet file", "err": err})
        })
    }

    extractLocation(data) {
        if (!data) {
            return this.setEmptyLocation();
        }
        let res = {};
        res["city"] = data.hasOwnProperty("city") && data["city"] ? data["city"] : "";
        res["regionCode"] = data.hasOwnProperty("region_code") && data["region_code"] ? data["region_code"] : "";
        res["areaCode"] = data.hasOwnProperty("area_code") && data["area_code"] ? data["area_code"] : "";
        res["timeZone"] = data.hasOwnProperty("time_zone") && data["time_zone"] ? data["time_zone"] : "";
        res["dmaCode"] = data.hasOwnProperty("dma_code") && data["dma_code"] ? data["dma_code"] : "";
        res["metroCode"] = data.hasOwnProperty("metro_code") && data["metro_code"] ? data["metro_code"] : "";
        res["countryCode3"] = data.hasOwnProperty("country_code3") && data["country_code3"] ? data["country_code3"] : "";
        res["countryName"] = data.hasOwnProperty("country_name") && data["country_name"] ? data["country_name"] : "";
        res["postalCode"] = data.hasOwnProperty("postal_code") && data["postal_code"] ? data["postal_code"] : "";
        res["longitude"] = data.hasOwnProperty("longitude") && data["longitude"] ? data["longitude"] : "";
        res["countryCode"] = data.hasOwnProperty("country_code") && data["country_code"] ? data["country_code"] : "";
        res["latitude"] = data.hasOwnProperty("latitude") && data["latitude"] ? data["latitude"] : "";
        res["continent"] = data.hasOwnProperty("continent") && data["continent"] ? data["continent"] : "";
        return res;
    }

    setEmptyLocation() {
        let res = {};
        res["city"] = "";
        res["regionCode"] = "";
        res["areaCode"] = "";
        res["timeZone"] = "";
        res["dmaCode"] = "";
        res["metroCode"] = "";
        res["countryCode3"] = "";
        res["countryName"] = "";
        res["postalCode"] = "";
        res["longitude"] = "";
        res["countryCode"] = "";
        res["latitude"] = "";
        res["continent"] = "";
        return res;
    }
};

