import { API_CONFIG, handleResponse } from '../api-config';

export const authService = {
  login: async (email: string, pass: string) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({ email, pass }), // Coincide con LoginUseCase
    });
    return handleResponse(response);
  },

  register: async (data: any) => {
    // Mapeamos los campos del formulario a lo que espera RegisterUseCase
    const payload = {
      name: data.name,
      last_name: data.last_name,
      nickname: data.nickname,
      born_date: data.born_date,
      email: data.email,
      password: data.password,
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  }
};
