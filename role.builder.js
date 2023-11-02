var libs = require('lib');

var roleBuilder = {

    run: function(creep, energyClaims) {

        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length == 0) {
            creep.memory.role = 'gatherer';
        }

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            energyClaims[creep.name] = libs.getEnergySource(creep, energyClaims);
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            delete energyClaims[creep.name];
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            var cheapestTarget;
            if(targets.length) {
                for (var site of targets) {
                    if (cheapestTarget === undefined || (site.progressTotal - site.progress) < (cheapestTarget.progressTotal - cheapestTarget.progress)) {
                        cheapestTarget = site;
                    }
                }
                if(creep.build(cheapestTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(cheapestTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            if (energyClaims[creep.name] === undefined) {
                energyClaims[creep.name] = libs.getEnergySource(creep, energyClaims);
            }
            var rc = creep.harvest(energyClaims[creep.name]);
            if(rc == ERR_NOT_IN_RANGE || rc == ERR_NOT_ENOUGH_RESOURCES) {
                creep.moveTo(energyClaims[creep.name], {visualizePathStyle: {stroke: '#ffaa00'}});
            } else if (rc == ERR_NOT_ENOUGH_RESOURCES && creep.store[RESOURCE_ENERGY] > 0) {
                creep.memory.building = true;
            }
        }
    }
};

module.exports = roleBuilder;