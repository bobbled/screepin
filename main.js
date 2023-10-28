var roleGatherer = require('role.gatherer');
var roleBuilder = require('role.builder');
var roleSpawner = require('role.spawner');
var libs = require('lib');

module.exports.loop = function () {

    var baseName = 'booba';
    console.log(libs.getOpenSpots(Game.spawns[baseName].room, Game.spawns[baseName].room.find(FIND_SOURCES)[0]));
    console.log(libs.getOpenSpots(Game.spawns[baseName].room, Game.spawns[baseName].room.find(FIND_SOURCES)[1]));

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    roleSpawner.run(baseName, 'gatherer', 8, [WORK,CARRY,MOVE]);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var energySources = creep.room.find(FIND_SOURCES);
        if(creep.memory.job == 'gatherer' || creep.memory.job == 'upgrader') {
            roleGatherer.run(creep);
        }
        if(creep.memory.job == 'builder') {
            roleBuilder.run(creep);
        }
    }



    libs.buildExtensions(Game.spawns[baseName].room, Game.spawns[baseName].pos);
}