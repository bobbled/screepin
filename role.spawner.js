var libs = require('lib');

var roleSpawner = {

    run: function(baseName, workerInfo, stats) {

        var workers = _.filter(Game.creeps, (creep) => /worker/.test(creep.name));

        var room = Game.spawns[baseName].room;
        var openSpots = 0;
        var buildParts = [WORK,CARRY,MOVE];

        for (var source of room.find(FIND_SOURCES)) {
            openSpots += libs.getOpenSpots(room, source);
        }

        var creepCap = openSpots;

        if(workers.length < creepCap + workerInfo['numBuilder']) {
            var newName = 'worker ' + Game.time;
            for (var parts of workerInfo.templates) {
                if (libs.getCreepCost(parts) <= room.energyCapacityAvailable) {
                    buildParts = parts;
                    console.log('chose parts ' + buildParts);
                    break;
                }
            }
            if (Game.spawns[baseName].spawnCreep(buildParts, newName) == 0) {
                var creep = Game.creeps[newName];
            }
        } else if (workers.length > creepCap + workerInfo['numBuilder']) {
            for (var creep of workers) {
                creep.suicide();
                break;
            }
        }

        libs.assignJobs(room, workerInfo, creepCap);

        if(Game.spawns[baseName].spawning) {
            var spawningCreep = Game.creeps[Game.spawns[baseName].spawning.name];
            Game.spawns[baseName].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[baseName].pos.x + 1,
                Game.spawns[baseName].pos.y,
                {align: 'left', opacity: 0.8});
        }
    }
};

module.exports = roleSpawner;