// Servicio API para conectar con el backend
const API_URL = 'http://localhost:3001/api';
console.log('🔧 API_URL configurada como:', API_URL);

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  university?: string;
  role: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  pricePerDay: number;
  images: string[];
  pickupAddress: string;
  returnAddress: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    location: string;
  };
  available: boolean;
  rating: number;
  totalReviews: number;
  specifications: any;
  reviews: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Rental {
  _id: string;
  product: Product;
  renter: {
    _id: string;
    name: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  days: number;
  totalAmount: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }
    
    return data;
  }

  // Métodos de autenticación
  async register(userData: {
    name: string;
    email: string;
    password: string;
    university: string;
    phone?: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  async getProfile(): Promise<{ user: User }> {
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ user: User }>(response);
  }

  async verifyToken(): Promise<{ user: User; message: string }> {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ user: User; message: string }>(response);
  }

  // Métodos de productos
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_URL}/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<ProductsResponse>(response);
  }

  async getProduct(id: string): Promise<{ product: Product }> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<{ product: Product }>(response);
  }

  async createProduct(formData: FormData): Promise<{ product: Product; message: string }> {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers,
      body: formData, // FormData para subir imágenes
    });

    return this.handleResponse<{ product: Product; message: string }>(response);
  }

  async updateProduct(id: string, formData: FormData): Promise<{ product: Product; message: string }> {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers,
      body: formData,
    });

    return this.handleResponse<{ product: Product; message: string }>(response);
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ message: string }>(response);
  }

  // Métodos de alquileres
  async createRental(rentalData: {
    product: string;  // Cambiado de productId a product
    startDate: string;
    endDate: string;
    deliveryMethod?: string;
    notes?: string;
    totalPrice?: number;
  }): Promise<{ rental: any; message: string }> {
    const response = await fetch(`${API_URL}/rentals`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(rentalData),
    });

    return this.handleResponse<{ rental: any; message: string }>(response);
  }

  async getMyRentals(): Promise<{ rentals: any[] }> {
    const response = await fetch(`${API_URL}/rentals/my`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ rentals: any[] }>(response);
  }

  async getOwnerRentals(): Promise<{ rentals: any[] }> {
    const response = await fetch(`${API_URL}/rentals/owner`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ rentals: any[] }>(response);
  }

  async getUserRentals(userId: string): Promise<Rental[]> {
    const response = await fetch(`${API_URL}/rentals/my-rentals`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    const data = await this.handleResponse<{ rentals: Rental[] }>(response);
    return data.rentals;
  }

  // Método para health check
  async healthCheck(): Promise<{ message: string; timestamp: string; environment: string }> {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
    });

    return this.handleResponse<{ message: string; timestamp: string; environment: string }>(response);
  }
}

export const apiService = new ApiService();
