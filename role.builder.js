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
            let wallTargets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < 50000 && object.structureType == STRUCTURE_WALL
            });

            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            let bestTargets = [];

            if (wallTargets.length > 0) {
                //console.log(JSON.stringify(wallTargets, null, 2));
                let bestClosest = creep.pos.findClosestByPath(wallTargets);
                if(creep.repair(bestClosest) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(bestClosest);
                }
            } else if (targets.length) {
                let cheapestTarget;
                for (let site of targets) {
                    if (cheapestTarget === undefined || (site.progressTotal - site.progress) < (cheapestTarget.progressTotal - cheapestTarget.progress)) {
                        cheapestTarget = site;
                    }
                }
                for (let site of targets) {
                    if (site.progressTotal - site.progress <= cheapestTarget.progressTotal - cheapestTarget.progress) {
                        bestTargets.push(site);
                    }
                }
                let bestClosest = creep.pos.findClosestByPath(bestTargets);
                if(creep.build(bestClosest) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(bestClosest, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            energyClaims[creep.name] = libs.getEnergySource(creep, energyClaims);
            if (energyClaims[creep.name]['energy'] == 0 && creep.store[RESOURCE_ENERGY] != 0) {
                creep.memory.building = true;
                delete energyClaims[creep.name];
            } else {
                let rc = creep.harvest(energyClaims[creep.name]);
                if (rc== ERR_NOT_IN_RANGE || rc == ERR_NOT_ENOUGH_RESOURCES) {
                    creep.moveTo(energyClaims[creep.name], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;