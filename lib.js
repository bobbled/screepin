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

function buildExtensions(room, startPos) {
    room.createConstructionSite(startPos.x + 2, startPos.y + 2, STRUCTURE_EXTENSION);
    room.createConstructionSite(startPos.x + 2, startPos.y, STRUCTURE_EXTENSION);
    room.createConstructionSite(startPos.x + 2, startPos.y - 2, STRUCTURE_EXTENSION);
    room.createConstructionSite(startPos.x, startPos.y + 2, STRUCTURE_EXTENSION);
    room.createConstructionSite(startPos.x, startPos.y - 2, STRUCTURE_EXTENSION);
    room.createConstructionSite(startPos.x - 2, startPos.y + 2, STRUCTURE_EXTENSION);
    room.createConstructionSite(startPos.x - 2, startPos.y - 2, STRUCTURE_EXTENSION);
    room.createConstructionSite(startPos.x - 2, startPos.y, STRUCTURE_EXTENSION);
    room.createConstructionSite(startPos.x - 4, startPos.y - 4, STRUCTURE_EXTENSION);
    room.createConstructionSite(startPos.x - 4, startPos.y - 2, STRUCTURE_EXTENSION);
    room.createConstructionSite(startPos.x - 4, startPos.y, STRUCTURE_EXTENSION);
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

module.exports = { getEnergySource, buildExtensions, getOpenSpots };
