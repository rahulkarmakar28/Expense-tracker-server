import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
export const DB_Connect = () => {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is not defined in the environment variables');
        process.exit(1);
    }
    const sql = neon(process.env.DATABASE_URL!);
    return drizzle({ client: sql });
};

//make i async