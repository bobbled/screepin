var libs = require('lib');

var roleGatherer = {

    run: function(creep, targetClaims, energyClaims) {

        //console.log(JSON.stringify(energyClaims, null, 1));

        if (creep.store[RESOURCE_ENERGY] == 0) {
            energyClaims[creep.name] = libs.getEnergySource(creep, energyClaims);
            if (targetClaims !== undefined) {
                delete targetClaims[creep.name];
            }

            if (creep.memory.upgrading) {
                creep.memory.upgrading = false;
            }
            var rc = creep.harvest(energyClaims[creep.name]);
            if (rc == ERR_NOT_IN_RANGE || rc == ERR_NOT_ENOUGH_RESOURCES) {
                creep.moveTo(energyClaims[creep.name], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if (creep.store.getFreeCapacity() == 0) {
            if (energyClaims !== undefined) {
                delete energyClaims[creep.name];
            }
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
            if (creep.memory.upgrading) {
                delete energyClaims[creep.name];
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
                    }
                }
            } else {
                if (energyClaims[creep.name] === undefined) {
                    energyClaims[creep.name] = libs.getEnergySource(creep, energyClaims);
                }
                var rc = creep.harvest(energyClaims[creep.name]);
//                console.log('rc: ' + rc + ' ' + creep.name);
//                console.log(JSON.stringify(energyClaims[creep.name]));
                if (rc == ERR_NOT_ENOUGH_RESOURCES) {
                    console.log('got here');
                    delete energyClaims[creep.name];
                    creep.memory.upgrading = true;
                } else if (rc == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energyClaims[creep.name], {visualizePathStyle: {stroke: '#ffaa00'}});
                } else if (rc == OK) {
                    console.log('worker OK: ' + creep.name);
                }
            }
        }
    }
};

module.exports = roleGatherer;