function getEnergySource(creep, energyClaims) {

    var sourceMap = {};
    var availableSources = [];
    var roomSources = creep.room.find(FIND_SOURCES);

    for (var roomSource of roomSources) {
        sourceMap[roomSource.pos.x + ',' + roomSource.pos.y] = {
            "num": 0,
            "spots": getOpenSpots(creep.room, roomSource.pos),
            "source": roomSource
        };
    }

    if (energyClaims !== undefined) {
        for (var [creepName, claimPos] of Object.entries(energyClaims)) {
            if (creepName != creep.name) {
                sourceMap[claimPos.pos.x + ',' + claimPos.pos.y]['num']++;
            }
        }
    }

    for (var sourceInfo of Object.values(sourceMap)) {
        if (sourceInfo['num'] < sourceInfo['spots'] && sourceInfo['source']['energy'] > 0) {
            availableSources.push(sourceInfo['source']);
        }
    }

    if (availableSources.length == 0) {
        for (var roomSource of roomSources) {
            availableSources.push(roomSource);
        }
    }

    return(findShortestPath(creep, availableSources));
}

function buildExtensions(room, extensions) {
    room.createConstructionSite(x + 1, y, STRUCTURE_EXTENSION);
    room.createConstructionSite(x + 1, y + 1, STRUCTURE_EXTENSION);
    room.createConstructionSite(x, y + 1, STRUCTURE_EXTENSION);
    room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
}

function buildThing(room, coords, thing) {
    for (var coord of coords) {
        room.createConstructionSite(coord[0], coord[1], thing);
    }
}

function getOpenSpots(room, pos) {

    var spots = 0;
    var myX = pos.x;
    var myY = pos.y;

    var surroundingSpots = [
        [myX, myY + 1],
        [myX, myY - 1],
        [myX + 1, myY + 1],
        [myX + 1, myY - 1],
        [myX + 1, myY],
        [myX - 1, myY + 1],
        [myX - 1, myY - 1],
        [myX - 1, myY]
    ]

    for (var myPos of surroundingSpots) {
        for (var terrain of room.lookAt(myPos[0], myPos[1])) {
            if (terrain['type'] == 'terrain' && terrain['terrain'] != 'wall') {
                spots++;
            }
        }
    }
    return(spots);
}

function flipRole(room, fromRole, toRole) {

    var flipped = false;

    for (var creep of room.find(FIND_CREEPS)) {
        if (creep.memory.role === undefined) {
            creep.memory.role = toRole;
            flipped = true;
            break;
        }
    }

    if (!flipped) {
        for (var creep of room.find(FIND_CREEPS)) {
            if (creep.memory.role == fromRole) {
                creep.memory.role = toRole;
                break;
            }
        }
    }
}

function assignJobs(room, workerInfo, creepCap) {
    var existingRoles = {};

    for (var creep of room.find(FIND_CREEPS)) {
        if (existingRoles[creep.memory.role] === undefined) {
            existingRoles[creep.memory.role] = 1;
        } else {
            existingRoles[creep.memory.role]++;
        }
    }

    if ((existingRoles['gatherer'] < workerInfo['gatherer'] || existingRoles['gatherer'] === undefined) && (existingRoles['upgrader'] !== undefined || existingRoles['undefined'] !== undefined)) {
        flipRole(room, 'upgrader', 'gatherer');
    } else if ((existingRoles['upgrader'] < workerInfo['upgrader'] || existingRoles['upgrader'] === undefined ) && (existingRoles['gatherer'] > workerInfo['gatherer'] || existingRoles['undefined'] !== undefined)) {
        flipRole(room, 'gatherer', 'upgrader');
    } else if (workerInfo['builder'] > 0 && (existingRoles['builder'] < workerInfo['builder'] || existingRoles['builder'] === undefined)) {
        if (room.find(FIND_CONSTRUCTION_SITES).length == 0) {
            flipRole(room, 'builder', 'gatherer');
        } else if (existingRoles['upgrader'] > workerInfo['upgrader'] || existingRoles['undefined'] > 0) {
            flipRole(room, 'upgrader', 'builder');
        } else if (existingRoles['gatherer'] > workerInfo['gatherer']) {
            flipRole(room, 'gatherer', 'builder');
        }
    }
}

function getCreepCost(parts) {
    var totalCost = 0;
    for (part of parts) {
        totalCost += BODYPART_COST[part];
    }
    return(totalCost)
}

function buildParts(parts) {
    var finalParts = [];

    for (var type in parts) {
        for (let i = 0; i < parts[type]; i++) {
            finalParts.push(type);
        }
    }
    return(finalParts);
}

function getFreeTargets(creep, targetClaims, minDist) {
    var freeTargets = [];

    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });

    if (targetClaims === undefined) {
        return(targets);
    }

    for (var target of targets) {
        var claimed = false;
        for (var [creepName, creepPos] of Object.entries(targetClaims)) {
            if ((creep.name != creepName) && Math.abs(target.pos.x - creepPos.x) + Math.abs(target.pos.y - creepPos.y) <= minDist) {
                claimed = true;
                break;
            }
        }
        if (!claimed) {
            freeTargets.push(target);
        }
    }
    return(freeTargets);
}

function findShortestPath(creep, targets) {
    var shortestPath;

    for (var target of targets) {
        var steps = creep.pos.findPathTo(target);
        if  (shortestPath === undefined || steps.length < shortestPath) {
            shortestPath = steps.length;
            shortestTarget = target;
        }
    }
    return(shortestTarget);
}
module.exports = { getEnergySource, buildExtensions, getOpenSpots, assignJobs, getCreepCost, buildThing, buildParts, findShortestPath, getFreeTargets };
