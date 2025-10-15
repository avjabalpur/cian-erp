// Utility functions to safely access localStorage with SSR support

export const getLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

export const setLocalStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
};

export const removeLocalStorage = (key: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

export const clearLocalStorage = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}; 