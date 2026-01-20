import { v4 as uuidv4 } from 'uuid';

const SESSION_ID_KEY = 'tajeats_session_id';

/**
 * Get existing session ID from localStorage or create new one
 */
export const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  
  return sessionId;
};

/**
 * Clear current session ID (useful for logout or cart reset)
 */
export const clearSessionId = (): void => {
  localStorage.removeItem(SESSION_ID_KEY);
};

/**
 * Get session ID without creating new one
 */
export const getSessionId = (): string | null => {
  return localStorage.getItem(SESSION_ID_KEY);
};
