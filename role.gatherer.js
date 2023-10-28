var libs = require('lib');

var roleGatherer = {

    run: function(creep) {

        if (creep.store[RESOURCE_ENERGY] == 0) {
            if (creep.memory.energySource === undefined) {
                creep.memory.energySource = libs.getEnergySource(creep.room);
            }
            if (creep.memory.upgrading) {
                creep.memory.upgrading = false;
            }
            if (creep.harvest(creep.room.find(FIND_SOURCES)[creep.memory.energySource]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.find(FIND_SOURCES)[creep.memory.energySource], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if (creep.store.getFreeCapacity() == 0) {
            delete creep.memory.energySource;
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0 && creep.memory.role != 'upgrader') {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    creep.memory.upgrading = true;
                }
            } else {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    creep.memory.upgrading = true;
                }
            }
        } else {
            if (creep.memory.energySource === undefined) {
                creep.memory.energySource = libs.getEnergySource(creep.room);
            }
            if (creep.memory.upgrading) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.memory.upgrading = false;
                    }
                }
            } else {
                if (creep.harvest(creep.room.find(FIND_SOURCES)[creep.memory.energySource]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.find(FIND_SOURCES)[creep.memory.energySource], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleGatherer;