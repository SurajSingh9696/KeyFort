import { MongoClient, Db, ObjectId, Document } from "mongodb";

if (!process.env.DATABASE_URL) {
  throw new Error('Invalid/Missing environment variable: "DATABASE_URL"');
}

const uri = process.env.DATABASE_URL;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Helper to get database
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("password_vault");
}

// Helper to get collection
export async function getCollection<T extends Document = Document>(name: string) {
  const db = await getDb();
  return db.collection<T>(name);
}

export { ObjectId };

// Helper to serialize MongoDB document to JSON-friendly format
export function serializeDoc<T extends Document>(doc: T | any): any {
  if (!doc) return null;
  
  // Extract _id and rest of properties
  const { _id, ...rest } = doc;
  
  // If _id exists, convert it to id
  if (_id) {
    return {
      id: _id.toString(),
      ...rest,
    };
  }
  
  // If no _id but has id, keep it as is
  return doc;
}

// Helper to serialize array of MongoDB documents
export function serializeDocs<T extends Document>(docs: T[]): any[] {
  return docs.map(serializeDoc);
}
