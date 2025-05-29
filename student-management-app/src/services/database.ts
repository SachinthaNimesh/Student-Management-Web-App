import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export interface QueuedRequest {
  id?: number;
  endpoint: string;
  method: string;
  headers: string;
  body: string;
  type: 'attendance' | 'mood';
  createdAt: string;
}

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('worky.db');
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS queued_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint TEXT NOT NULL,
        method TEXT NOT NULL,
        headers TEXT NOT NULL,
        body TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const queueRequest = async (request: Omit<QueuedRequest, 'id'>) => {
  try {
    await db.runAsync(
      `INSERT INTO queued_requests (endpoint, method, headers, body, type, created_at)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        request.endpoint,
        request.method,
        request.headers,
        request.body,
        request.type,
        request.createdAt,
      ]
    );
    console.log('Request queued successfully');
  } catch (error) {
    console.error('Error queuing request:', error);
    throw error;
  }
};

export const getQueuedRequests = async (): Promise<QueuedRequest[]> => {
  try {
    return await db.getAllAsync<QueuedRequest>(
      'SELECT * FROM queued_requests ORDER BY created_at ASC;'
    );
  } catch (error) {
    console.error('Error getting queued requests:', error);
    throw error;
  }
};

export const deleteQueuedRequest = async (id: number) => {
  try {
    await db.runAsync('DELETE FROM queued_requests WHERE id = ?;', [id]);
  } catch (error) {
    console.error('Error deleting queued request:', error);
    throw error;
  }
}; 