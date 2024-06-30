declare namespace NodeJS {
    interface Global {
        _mongoClientPromise: Promise<import("mongodb").MongoClient>;
    }
}

declare var global: NodeJS.Global & typeof globalThis;