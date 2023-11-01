var libs = require('lib');

var roleGatherer = {

    run: function(creep, targetClaims) {

        if (creep.store[RESOURCE_ENERGY] == 0) {
            if (targetClaims !== undefined) {
                delete targetClaims[creep.name];
            }

            if (creep.memory.energySource === undefined) {
                creep.memory.energySource = libs.getEnergySource(creep.room);
            }
            if (creep.memory.upgrading) {
                creep.memory.upgrading = false;
            }

            if (creep.harvest(creep.room.find(FIND_SOURCES)[creep.memory.energySource]) == ERR_NOT_IN_RANGE || creep.harvest(creep.room.find(FIND_SOURCES)[creep.memory.energySource]) == ERR_NOT_ENOUGH_RESOURCES) {
                creep.moveTo(creep.room.find(FIND_SOURCES)[creep.memory.energySource], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if (creep.store.getFreeCapacity() == 0) {
            delete creep.memory.energySource;
            var targets = libs.getFreeTargets(creep, targetClaims, 2);

            if(targets.length > 0 && creep.memory.role != 'upgrader') {
                var target = libs.findShortestPath(creep, targets);

                targetClaims[creep.name] = target['pos'];
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    creep.memory.upgrading = true;
                }
            } else {
                if (targetClaims !== undefined) {
                    delete targetClaims[creep.name];
                }
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
                var targets = libs.getFreeTargets(creep, targetClaims, 2);

                if(targets.length > 0 && creep.memory.role != 'upgrader') {
                    var target = libs.findShortestPath(creep, targets);
                    targetClaims[creep.name] = target['pos'];
                    //console.log(JSON.stringify(target, null, 2));
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                        console.log('got here');
                    }
                }
            } else {
                if (creep.harvest(creep.room.find(FIND_SOURCES)[creep.memory.energySource]) == ERR_NOT_ENOUGH_RESOURCES	&& creep.store[RESOURCE_ENERGY] > 0) {
                    console.log(creep.name + ' store ' + creep.store[RESOURCE_ENERGY] + ' es ' + creep.harvest(creep.room.find(FIND_SOURCES)[creep.memory.energySource]));
                    creep.memory.upgrading = true;
                    console.log('energy depleted ' + creep.name);
                } else if (creep.harvest(creep.room.find(FIND_SOURCES)[creep.memory.energySource]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.find(FIND_SOURCES)[creep.memory.energySource], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleGatherer;