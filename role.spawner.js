var roleSpawner = {

    run: function(baseName, role, num, stats) {

        var workers = _.filter(Game.creeps, (creep) => /worker/.test(creep.name));

        if(workers.length < num) {
            var newName = 'worker ' + Game.time;
            if (Game.spawns[baseName].spawnCreep(stats, newName) == 0) {
                var creep = Game.creeps[newName];
            }
        } else if (workers.length > num) {
            creep.suicide();
        }

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