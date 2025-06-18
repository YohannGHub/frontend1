const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface AuthFetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function authFetch(
  endpoint: string,
  options: AuthFetchOptions = {}
): Promise<Response> {
  const { requireAuth = true, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (requireAuth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('🔒 Aucun token trouvé, redirection vers /login');
      window.location.href = '/login';
    }
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (response.status === 401) {
      console.warn("⚠ Token invalide ou expiré, suppression et redirection");
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    return response;
  } catch (error) {
    console.error('❌ Erreur authFetch:', error);
    throw error;
  }
}

export const useAuth = () => {
  const login = async ({ username, password }: { username: string; password: string }) => {
    try {
      const response = await authFetch('/api/auth/login', {
        method: 'POST',
        requireAuth: false,
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      const token = data.token || data.access_token;

      if (!response.ok || !token) {
        return {
          success: false,
          error: data.message || 'Identifiants incorrects',
        };
      }

      localStorage.setItem('auth_token', token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Erreur de communication avec le serveur',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp && payload.exp > now;
    } catch {
      localStorage.removeItem('auth_token');
      return false;
    }
  };

  return { login, logout, isAuthenticated };
};
