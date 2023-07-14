SeedMaker = {
    HOURS: [
        600,  610,  620,  630,  640,  650,
        700,  710,  720,  730,  740,  750,
        800,  810,  820,  830,  840,  850,
        900,  910,  920,  930,  940,  950,
        1000, 1010, 1020, 1030, 1040, 1050,
        1100, 1110, 1120, 1130, 1140, 1150,
        1200, 1210, 1220, 1230, 1240, 1250,
        1300, 1310, 1320, 1330, 1340, 1350,
        1400, 1410, 1420, 1430, 1440, 1450,
        1500, 1510, 1520, 1530, 1540, 1550,
        1600, 1610, 1620, 1630, 1640, 1650,
        1700, 1710, 1720, 1730, 1740, 1750,
        1800, 1810, 1820, 1830, 1840, 1850,
        1900, 1910, 1920, 1930, 1940, 1950,
        2000, 2010, 2020, 2030, 2040, 2050,
        2100, 2110, 2120, 2130, 2140, 2150,
        2200, 2210, 2220, 2230, 2240, 2250,
        2300, 2310, 2320, 2330, 2340, 2350,
           0,   10,   20,   30,   40,   50,
         100,  110,  120,  130,  140,  150
    ]
};

SeedMaker.calcSeedMakers = function (coordinates) {
    const seedMakers = []

    for (let i = 0; i < coordinates.length; i++) {
        seedMakers.push({
            index: i,
            x: coordinates[i][0],
            y: coordinates[i][1]
        })
    }

    return seedMakers;
}

SeedMaker.makeSeed = function (gameID, daysPlayed, timeOfDay, x, y) {
    Random.Random(daysPlayed + Math.floor(gameID / 2) + x + y * 77 + timeOfDay);
    let qty = Random.Next(1, 4);

    if (Random.NextDouble() < 0.005) return { type: 2, amount: 1 };
    else if (Random.NextDouble() < 0.02) return { type: 1, amount: Random.Next(1, 5) };
    else return { type: 0, amount: qty };
}

SeedMaker.calcSeeds = function (gameID, daysPlayed, timeOfDay, coordinates) {
    const seeds = [];

    for (let i = 0; i < coordinates.length; i++) {
        const tileX = coordinates[i][0];
        const tileY = coordinates[i][1];

        let seed = this.makeSeed(gameID, daysPlayed, timeOfDay, tileX, tileY);
        let seedmaker = {
            type: seed.type,
            amount: seed.amount
        };
        seeds.push(seedmaker);
    }

    return seeds;
}

SeedMaker.daySchedule = function (gameID, daysPlayed, coordinates, onCalculationProgress = null) {
    const schedule = {
        gameID: gameID,
        daysPlayed: daysPlayed,
        seedMakers: this.calcSeedMakers(coordinates),
        hours: []
    };

    for (let iDay = 0; iDay < this.HOURS.length; iDay++) {
        const timeOfDay = this.HOURS[iDay];
        schedule.hours.push(
            {
                timeOfDay: timeOfDay,
                seeds: this.calcSeeds(gameID, daysPlayed, timeOfDay, coordinates)
            }
        );

        if (onCalculationProgress) {
            onCalculationProgress(iDay / this.HOURS.length);
        }
    }

    return schedule;
}