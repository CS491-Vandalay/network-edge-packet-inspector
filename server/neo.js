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
                .then((data) => {
                    console.log(data);
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
                    console.log(data);
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
                .then((data) => {
                    console.log(data);
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
                    console.log(data);
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
                    console.log(data);
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
                    console.log(data);
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
                    console.log(data);
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
                session.run('CREATE (n:Packet {id: $id, sourceIp: $sourceIp, destinationIp: $destinationIp, port: $port}) RETURN n.id, n.name, n.ip',
                    {
                        "id": id + "",
                        "sourceIp": body.sourceIp,
                        "destinationIp": body.destinationIp,
                        "port": body.port
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
                    console.log(data);
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
                    console.log(data);
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
                .then((data) => {
                    console.log(data);
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
                .then((data) => {
                    console.log(data);
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
                    console.log(data);
                    data["records"].forEach((record) => {
                        body.push({
                            "id": record.get("n.id"),
                            "port": record.get("n.country")
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
                    console.log(data);
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
                    console.log(data);
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
                    // console.log("r",data["records"][0][["keys"][0]][0]);
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

    getNumOfCountries() {
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

};