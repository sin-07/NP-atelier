import dns from 'dns'
import { MongoClient, Db } from 'mongodb'

// Configure robust DNS resolution for SRV lookup on Windows/ISP networks
try {
  dns.setDefaultResultOrder?.('ipv4first')
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4'])
} catch {
  // Ignore in environments where setServers is restricted
}

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://aniketsingh9322_db_user:4gpjmXrjXmagSnfl@cluster0.fhmihhu.mongodb.net/atelier_db?retryWrites=true&w=majority&appName=Cluster0'

const dbName = process.env.MONGODB_DB || 'atelier_db'

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development, preserve MongoDB client across HMR hot module reloads
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production, instantiate client per standard pool
  const client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db(dbName)
}

export default clientPromise
