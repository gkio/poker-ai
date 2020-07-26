class Program {
    constructor() {
        
    }

    private CreateIndexers() {
        console.log("Creating 2 card index... ");
        Global.indexer_2 = new HandIndexer(new int[1] { 2 });
        console.log(Global.indexer_2.roundSize[0] + " non-isomorphic hands found");

        console.log("Creating 2 & 3 card index... ");
        Global.indexer_2_3 = new HandIndexer(new int[2] { 2, 3 });
        console.log(Global.indexer_2_3.roundSize[1] + " non-isomorphic hands found");

        console.log("Creating 2 & 4 card index... ");
        Global.indexer_2_4 = new HandIndexer(new int[2] { 2, 4 });
        console.log(Global.indexer_2_4.roundSize[1] + " non-isomorphic hands found");

        console.log("Creating 2 & 5 card index... ");
        Global.indexer_2_5 = new HandIndexer(new int[2] { 2, 5 });
        console.log(Global.indexer_2_5.roundSize[1] + " non-isomorphic hands found");

        console.log("Creating 2 & 5 & 2 card index... ");
        Global.indexer_2_5_2 = new HandIndexer(new int[3] { 2, 5, 2 });
        console.log(Global.indexer_2_5_2.roundSize[2] + " non-isomorphic hands found");

        console.log("Creating 2 & 3 & 1 card index... ");
        Global.indexer_2_3_1 = new HandIndexer(new int[3] { 2, 3, 1 });
        console.log(Global.indexer_2_3_1.roundSize[2] + " non-isomorphic hands found");

        console.log("Creating 2 & 3 & 1 & 1 card index... ");
        Global.indexer_2_3_1_1 = new HandIndexer(new int[4] { 2, 3, 1, 1 });
        console.log(Global.indexer_2_3_1_1.roundSize[3] + " non-isomorphic hands found");
    }
}