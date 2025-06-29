import { createClient } from './supabase';
import crypto from 'crypto';

// Hash password using first 5 characters of username as salt
export function hashPassword(username: string, password: string): string {
  const salt = username.substring(0, 5).padEnd(5, 'x'); // Ensure we always have 5 chars
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return hash;
}

// Create new user
export async function createUser(username: string, password: string, displayName?: string) {
  const supabase = createClient();
  const passwordHash = hashPassword(username, password);
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      username,
      password_hash: passwordHash,
      display_name: displayName || username,
    })
    .select()
    .single();
    
  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('Username already exists');
    }
    throw error;
  }
  
  return data;
}

// Authenticate user
export async function authenticateUser(username: string, password: string) {
  const supabase = createClient();
  const passwordHash = hashPassword(username, password);
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password_hash', passwordHash)
    .single();
    
  if (error || !data) {
    throw new Error('Invalid username or password');
  }
  
  return data;
}

// Get user by ID
export async function getUserById(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
}

// Simple session management using localStorage
export function saveUserSession(user: { id: string; username: string; display_name: string }) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('priceguessr_user', JSON.stringify(user));
  }
}

export function getUserSession() {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('priceguessr_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function clearUserSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('priceguessr_user');
  }
}