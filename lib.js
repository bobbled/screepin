function getEnergySource(room) {
    var sources = room.find(FIND_SOURCES).length;
    var energySources = {};
    var lowestIndex = 0;
    var lowestValue = 9999;

    for (var creep of room.find(FIND_CREEPS)) {
        if (creep.memory.energySource !== undefined) {
            if (creep.memory.energySource in energySources) {
                energySources[creep.memory.energySource]++;
            } else {
                energySources[creep.memory.energySource] = 1;
            }
        }
    }

    for (let i = 0; i < sources; i++) {
        if (i.toString() in energySources ) {
            if (energySources[i] < lowestValue) {
                lowestIndex = i;
                lowestValue = energySources[i];
            }
        } else {
            lowestIndex = i;
            lowestValue = 0;
        }
    }
    console.log('lowindex: ' + lowestIndex);
    return lowestIndex;
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

function getOpenSpots(room, source) {

    var spots = 0;
    var myX = source.pos.x;
    var myY = source.pos.y;

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
            console.log('undef to ' + toRole);
            flipped = true;
            break;
        }
    }

    if (!flipped) {
        for (var creep of room.find(FIND_CREEPS)) {
            if (creep.memory.role == fromRole) {
                creep.memory.role = toRole;
                console.log(fromRole + ' to ' + toRole);
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
    console.log(JSON.stringify(existingRoles));

    var desiredGatherers = creepCap - Math.floor(creepCap * workerInfo['upgrader']);

    if (existingRoles['gatherer'] < desiredGatherers && (existingRoles['upgrader'] !== undefined || existingRoles['undefined'] !== undefined)) {
        flipRole(room, 'upgrader', 'gatherer');
    } else if ((existingRoles['upgrader'] < creepCap - desiredGatherers || existingRoles['upgrader'] === undefined ) && (existingRoles['gatherer'] > desiredGatherers || existingRoles['undefined'] !== undefined)) {
        flipRole(room, 'gatherer', 'upgrader');
    } else if (workerInfo['numBuilder'] > 0 && (existingRoles['builder'] < workerInfo['numBuilder'] || existingRoles['builder'] === undefined)) {
        if (room.find(FIND_CONSTRUCTION_SITES).length == 0) {
            flipRole(room, 'builder', 'gatherer');
        } else if (existingRoles['upgrader'] > creepCap - desiredGatherers || existingRoles['undefined'] > 0) {
            flipRole(room, 'upgrader', 'builder');
        } else if (existingRoles['gatherer'] > desiredGatherers) {
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
module.exports = { getEnergySource, buildExtensions, getOpenSpots, assignJobs, getCreepCost, buildThing };
