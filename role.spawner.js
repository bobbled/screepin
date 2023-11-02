var libs = require('lib');

var roleSpawner = {

    run: function(baseName, workerInfo, stats) {

        var room = Game.spawns[baseName].room;
        var workers = _.filter(Game.creeps, (creep) => /worker/.test(creep.name));

        var totalWorkers = 0;
        for (var workerCount of Object.values(workerInfo['counts'])) {
            totalWorkers += workerCount;
        }

        if(workers.length < totalWorkers) {
            var newName = 'worker ' + Game.time;
            for (var parts of workerInfo.templates) {
                var finalParts = libs.buildParts(parts);
                if (libs.getCreepCost(finalParts) <= room.energyCapacityAvailable) {
                    buildParts = finalParts;
                    buildPartsNice = parts;
                    break;
                }
            }
            if (Game.spawns[baseName].spawnCreep(buildParts, newName) == 0) {
                var creep = Game.creeps[newName];
            }
        } else if (workers.length > totalWorkers) {
            for (var creep of workers) {
                creep.suicide();
                break;
            }
        }

        libs.assignJobs(room, workerInfo['counts'], totalWorkers);

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