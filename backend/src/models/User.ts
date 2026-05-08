import { Pool, QueryResult } from 'pg';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'student' | 'parent' | 'professor' | 'counselor' | 'admin';
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel {
  constructor(private pool: Pool) {}

  async create(userData: Partial<User>): Promise<User> {
    const { email, password, role, firstName, lastName } = userData;
    const hashedPassword = await bcrypt.hash(password || '', 10);

    const query = `
      INSERT INTO users (email, password, role, first_name, last_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await this.pool.query(query, [email, hashedPassword, role, firstName, lastName]);
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
