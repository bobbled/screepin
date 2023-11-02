var roleGatherer = require('role.gatherer');
var roleBuilder = require('role.builder');
var roleSpawner = require('role.spawner');
var libs = require('lib');
var targetClaims = {};
var energyClaims = {};
const { rooms } = require('rooms');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    for (var name of Object.keys(energyClaims)) {
        if (!Game.creeps[name]) {
            delete energyClaims[name];
        }
    }
    for (let name of Object.keys(targetClaims)) {
        if (!Game.creeps[name]) {
            delete targetClaims[name];
        }
    }

    for (var [roomName, room] of Object.entries(rooms)) {}
        libs.buildThing(Game.rooms[roomName], room['roads'], STRUCTURE_ROAD);
        libs.buildThing(Game.rooms[roomName], room['extensions'], STRUCTURE_EXTENSION);

        roleSpawner.run(room['baseName'], room['workerInfo']);

        for (var creep of Game.rooms[roomName].find(FIND_MY_CREEPS)) {
            if(creep.memory.role == 'gatherer' || creep.memory.role == 'upgrader') {
                roleGatherer.run(creep, targetClaims, energyClaims);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep, energyClaims);
            }
        }
}