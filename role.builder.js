var libs = require('lib');

var roleBuilder = {

    run: function(creep) {

        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length == 0) {
            creep.memory.role = 'gatherer';
        }

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            delete creep.memory.energySource;
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            if (creep.memory.energySource === undefined) {
                creep.memory.energySource = libs.getEnergySource(creep.room);
            }
            if(creep.harvest(creep.room.find(FIND_SOURCES)[creep.memory.energySource]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.find(FIND_SOURCES)[creep.memory.energySource], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;