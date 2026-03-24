export const API_CONFIG = {
    // URL base de tu backend NestJS. Cámbiala según tu entorno.
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    HEADERS: {
        'Content-Type': 'application/json',
    },
};

export const handleResponse = async (response: Response) => {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        // El backend suele devolver el error en { message: "..." }
        const error = data?.message || response.statusText;
        throw new Error(error);
    }

    return data;
};
