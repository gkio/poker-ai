class HandIndexer {
    SUITS: number = 4;
    RANKS: number = 13;
    CARDS: number = 52;
    MAX_GROUP_INDEX: number = 0x1000000;
    ROUND_SHIFT: number = 4;
    ROUND_MASK: number = 0xf;

    nthUnset: Array<number> = [1 << this.RANKS, this.RANKS];
    equal: Array<boolean> = [!!(1 << (this.SUITS - 1)), !!(this.SUITS)];
    nCrRanks: Array<number> = [this.RANKS + 1,this.RANKS + 1];
    rankSetToIndex: Array<number> = [1 << this.RANKS];
    indexToRankSet: Array<number> = [this.RANKS + 1,1 << this.RANKS];
    suitPermutations: Array<number>;
    nCrGroups: Array<number> = [this.MAX_GROUP_INDEX, this.SUITS + 1];

    rounds: number;
    cardsPerRound: Array<number>;
    configurations: Array<number>;
    permutations: Array<number>;
    roundSize: Array<number>;
    roundStart: Array<number>;
    permutationToConfiguration: Array<Array<number>>;
    permutationToPi: Array<Array<number>>;
    configurationToEqual: Array<Array<number>>;
    configuration: Array<Array<Array<number>>>;
    configurationToSuitSize: Array<Array<Array<number>>>;
    configurationToOffset: Array<Array<number>>;

    publicFlopHands: Array<number>;

    /**
     * Construct and initialize a hand indexer. This generates a number of lookup tables and is
     * relatively expensive compared to indexing a hand.
     * @param cardsPerRound number of cards in each round
     */
    constructor(cardsPerRound: Array<number>) {
        this.cardsPerRound = cardsPerRound;
        this.rounds = cardsPerRound.length;
        this.permutationToConfiguration = [[this.rounds]];
        this.permutationToPi = [[ this.rounds ]];
        this.configurationToEqual = [[ this.rounds ]];
        this.configuration = [[[ this.rounds ]]];
        this.configurationToSuitSize = [[[ this.rounds ]]];
        this.configurationToOffset = [[ this.rounds ]];

        for(let i: number = 0, count: number = 0; i < this.rounds; ++i) {
            count += this.cardsPerRound[i];
            if (count > this.CARDS) {
                throw new Error("Too many cards!");
            }
        }

        this.roundStart = [ this.rounds ];

        for (let i: number = 0, j: number = 0; i < this.rounds; ++i) {
            this.roundStart[i] = j;
            j += this.cardsPerRound[i];
        }

        this.configurations = [ this.rounds ];
    }

    enumerateConfigurations(tabulate: boolean) {
        const used: Array<number> = [ this.SUITS ];
        const configuration: Array<number> = [ this.SUITS ];

        this.enumerateConfigurationsRecursive(
            0, this.cardsPerRound[0], 0, ((1 << this.SUITS) - 2), used, configuration, tabulate
        );
    }

    enumerateConfigurationsRecursive(round: number, remaining: number, suit: number, equal: number, used: Array<number>, configuration: Array<number>, tabulate: boolean) {
        if (suit === this.SUITS) {
            if (tabulate) {
                this.tabulateConfigurations(round, configuration);
            } else {
                ++this.configurations[round]
            }

            if (round + 1 < this.rounds) {
                this.enumerateConfigurationsRecursive(round + 1, this.cardsPerRound[round + 1], 0, equal, used, configuration, tabulate)
            }
        } else {
            let min: number = 0;
            if(suit === this.SUITS - 1) {
                min = remaining;
            }

            let max: number = this.RANKS - used[suit];
            if (remaining < max) {
                max = remaining
            }

            let previous: number = this.RANKS + 1;
            const wasEqual: boolean = (equal & 1 << suit) != 0;
            if (wasEqual) {
                previous = configuration[suit - 1] >> (this.ROUND_SHIFT * (this.rounds - round - 1)) && this.ROUND_MASK;

                if (previous < max) {
                    max = previous
                }
            }

            const oldConfiguration: number = configuration[suit];
            const oldUsed: number = used[suit];
            for (let i = min; i <= max; ++i) {
                const newConfiguration: number = oldConfiguration | i << (this.ROUND_SHIFT * (this.rounds - round - 1));
                const newEqual: number = ((equal & ~(1 << suit)) | (wasEqual && (i == previous) ? 1 : 0) << suit);

                used[suit] = oldUsed + i;
                configuration[suit] = newConfiguration;
                this.enumerateConfigurationsRecursive(round, remaining - i, suit + 1, newEqual, used, configuration, tabulate);
                configuration[suit] = oldConfiguration;
                used[suit] = oldUsed;
            }
        }
    }

    tabulateConfigurations(round: number, configuration: Array<number>) {
        let id: number = configuration[round]++;
        let continueLoop: boolean = true;
        for (; id > 0; --id) {
            if (!continueLoop) {
                break;
            }
            for (let i: number = 0; i < this.SUITS; ++i) {
                if (configuration[i] < this.configuration[round][id - 1][i]) {
                    break;
                }
                else if (configuration[i] > this.configuration[round][id - 1][i]) {
                    continueLoop = false;
                }
            }

            for (let i: number = 0; i < this.SUITS; ++i) {
                this.configuration[round][id][i] = this.configuration[round][id - 1][i];
                this.configurationToSuitSize[round][id][i] = this.configurationToSuitSize[round][id - 1][i];
            }

            this.configurationToOffset[round][id] = this.configurationToOffset[round][id - 1];
            this.configurationToEqual[round][id] = this.configurationToEqual[round][id - 1];
        }

        OUT:

        this.configurationToOffset[round][id] = 1;
    }
}