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
  // eslint-disable-next-line no-var
  var _mongoDbInstance: Db | undefined
}

function createClientPromise(): Promise<MongoClient> {
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 60000,
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 3000,
  })
  return client.connect()
}

export async function getDb(): Promise<Db> {
  if (global._mongoDbInstance) {
    return global._mongoDbInstance
  }

  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientPromise().catch((err) => {
      global._mongoClientPromise = undefined
      throw err
    })
  }

  const client = await global._mongoClientPromise
  const db = client.db(dbName)
  global._mongoDbInstance = db
  return db
}

export default getDb
