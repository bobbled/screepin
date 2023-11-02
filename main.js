var roleGatherer = require('role.gatherer');
var roleBuilder = require('role.builder');
var roleSpawner = require('role.spawner');
var libs = require('lib');
var targetClaims = {};
var energyClaims = {};

module.exports.loop = function () {

    var baseName = 'booba';
    var workerInfo = {
        "counts": {
            "upgrader": 1,
            "gatherer": 4,
            "builder": 1
        },
        "templates": [
            // 300, 550, 800, 1300, 1800, 2300
            {[WORK]: 9, [CARRY]: 9, [MOVE]: 9},
            {[WORK]: 7, [CARRY]: 7, [MOVE]: 7},
            {[WORK]: 6, [CARRY]: 6, [MOVE]: 6},
            {[WORK]: 5, [CARRY]: 5, [MOVE]: 5},
            {[WORK]: 4, [CARRY]: 4, [MOVE]: 4},
            {[WORK]: 3, [CARRY]: 3, [MOVE]: 3},
            {[WORK]: 2, [CARRY]: 2, [MOVE]: 2},
            {[WORK]: 1, [CARRY]: 2, [MOVE]: 2}
        ]
    }

    var roads = [
        [
            [39, 38],
            [39, 37],
            [39, 36],
            [39, 35],
            [39, 34],
            [38, 35],
            [38, 36],
            [38, 34],
            [37, 34],
            [36, 34],
            [37, 35],
            [40, 34],
            [38, 33]
        ], [
            [38, 37],
            [37, 36],
            [36, 35],
            [35, 34],
            [34, 33],
            [34, 32],
            [35, 31],
            [31, 35],
            [32, 34],
            [33, 33],
            [33, 34],
            [34, 34],
            [35, 29],
            [34, 30],
            [34, 31],
            [35, 30],
            [35, 35]
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
            [27, 36],
            [26, 35],
            [25, 34],
            [25, 33],
            [25, 32],
            [24, 31],
            [23, 30],
            [22, 29],
            [21, 28],
            [20, 27],
            [19, 26],
            [18, 25],
            [17, 24],
            [16, 23],
            [34, 37],
            [33, 38],
            [32, 38],
            [31, 38],
            [30, 38],
            [29, 38],
            [28, 38],
            [27, 38],
            [26, 37],
            [31, 37],
            [28, 37]
        ]
    ]

    var extensions = [
        [29, 35],
        [30, 34],
        [31, 33],
        [32, 32],
        [33, 39],
        [31, 39],
        [29, 39],
        [27, 39],

        [35, 37],
        [36, 37],
        [30, 35],
        [32, 35],
        [33, 35],
        [34, 35],
        [33, 37],
        [32, 37],
        [30, 37],
        [29, 37],
        [26, 36],
        [27, 37],
        [25, 35],
        [24, 34],
        [24, 32],
        [23, 31],
        [25, 31],
        [24, 30],
        [23, 29],
        [22, 28],
        [32, 39],
        [31, 34]
    ]
    console.log('yeah ' + JSON.stringify(energyClaims['worker 536989']));
    for (var road of roads) {
        libs.buildThing(Game.spawns['booba'].room, road, STRUCTURE_ROAD);
    }
    libs.buildThing(Game.spawns['booba'].room, extensions, STRUCTURE_EXTENSION);

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

    roleSpawner.run(baseName, workerInfo, [WORK,WORK,CARRY,MOVE]);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        if(creep.memory.role == 'gatherer' || creep.memory.role == 'upgrader') {
            roleGatherer.run(creep, targetClaims, energyClaims);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep, energyClaims);
        }
    }

}