var roleGatherer = require('role.gatherer');
var roleBuilder = require('role.builder');
var roleSpawner = require('role.spawner');
var libs = require('lib');

module.exports.loop = function () {

    var baseName = 'booba';
    var workerInfo = {
        "upgrader": 0.3,
        "numBuilder": 3,
        "templates": [
            [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
            [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
            [WORK,CARRY,CARRY,MOVE,MOVE]
        ]
    }

    var roads = [
        [
            [39, 38],
            [39, 37],
            [39, 36],
            [39, 35],
            [39, 34]
        ], [
            [38, 37],
            [37, 36],
            [36, 35],
            [35, 34],
            [34, 33],
            [34, 32],
            [35, 31]
        ], [
            [36, 36],
            [35, 36],
            [34, 36],
            [33, 36],
            [32, 36],
            [31, 36],
            [30, 36],
            [29, 36],
            [28, 36],
            [27, 36]
        ]
    ]

    var extensions = [
        [45, 33],
        [45, 34],
        [45, 35],
        [45, 36],
        [44, 37],
        [42, 39],
        [35, 39],
        [36, 40],
        [36, 41],
        [36, 42],
        [42, 37],
        [39, 43],
        [40, 43],
        [41, 43],
        [42, 43],
        [29, 35],
        [30, 34],
        [31, 33],
        [32, 32],
        [32, 30],
        [33, 39],
        [31, 39],
        [29, 39],
        [27, 39],
        [25, 39],
        [24, 38],
        [23, 37],
        [22, 36],
        [21, 35],
        [20, 34]
    ]

    for (var road of roads) {
        libs.buildThing(Game.spawns['booba'].room, road, STRUCTURE_ROAD);
    }
    libs.buildThing(Game.spawns['booba'].room, extensions, STRUCTURE_EXTENSION);

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    roleSpawner.run(baseName, workerInfo, [WORK,WORK,CARRY,MOVE]);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        if(creep.memory.role == 'gatherer' || creep.memory.role == 'upgrader') {
            roleGatherer.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }

}