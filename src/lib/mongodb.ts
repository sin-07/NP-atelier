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
  var _mongoClientInstance: MongoClient | undefined
}

let cachedClient: MongoClient | null = global._mongoClientInstance || null

export async function getDb(): Promise<Db> {
  if (cachedClient) {
    return cachedClient.db(dbName)
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 2500,
    connectTimeoutMS: 2500,
  })

  try {
    cachedClient = await client.connect()
    if (process.env.NODE_ENV === 'development') {
      global._mongoClientInstance = cachedClient
    }
    return cachedClient.db(dbName)
  } catch (err) {
    cachedClient = null
    throw err
  }
}

export default getDb
