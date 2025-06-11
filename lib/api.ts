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

export interface Notification {
  _id: string;
  recipient: string;
  title: string;
  message: string;
  type: 'welcome' | 'rental_created' | 'rental_request' | 'rental_confirmed' | 'rental_cancelled' | 'product_created' | 'product_rented' | 'system';
  read: boolean;
  relatedProduct?: {
    _id: string;
    title: string;
    images: string[];
  };
  relatedRental?: {
    _id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
  };
  relatedUser?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalNotifications: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  unreadCount: number;
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

    console.log('🔧 Headers generated:', headers);
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    console.log('🔧 API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    let data;
    
    try {
      const text = await response.text();
      console.log('🔧 Response text:', text);
      
      if (text) {
        data = JSON.parse(text);
        console.log('🔧 Parsed JSON:', data);
      } else {
        data = {};
        console.log('🔧 Empty response, using empty object');
      }
    } catch (error) {
      console.error('❌ Error parsing JSON response:', error);
      console.error('❌ Response was:', response);
      throw new Error('Respuesta inválida del servidor');
    }
    
    if (!response.ok) {
      console.error('❌ API Error:', data);
      throw new Error(data.message || `Error del servidor: ${response.status}`);
    }
    
    console.log('✅ API Success:', data);
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
    const url = `${API_URL}/auth/register`;
    console.log('🔧 Register URL:', url);
    console.log('🔧 Register data:', userData);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    console.log('🔧 Register response received:', response);
    return this.handleResponse<AuthResponse>(response);
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const url = `${API_URL}/auth/login`;
    console.log('🔧 Login URL:', url);
    console.log('🔧 Login credentials:', { email: credentials.email });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    console.log('🔧 Login response received:', response);
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
    const response = await fetch(`${API_URL}/rentals/my-listings`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ rentals: any[] }>(response);
  }

  // Actualizar estado de alquiler (confirmar, rechazar, etc.)
  async updateRentalStatus(rentalId: string, status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'): Promise<{ rental: any; message: string }> {
    const response = await fetch(`${API_URL}/rentals/${rentalId}/status`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify({ status }),
    });

    return this.handleResponse<{ rental: any; message: string }>(response);
  }

  // Cancelar alquiler
  async cancelRental(rentalId: string): Promise<{ rental: any; message: string }> {
    const response = await fetch(`${API_URL}/rentals/${rentalId}/cancel`, {
      method: 'PUT',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ rental: any; message: string }>(response);
  }

  // Obtener detalles de un alquiler específico
  async getRental(rentalId: string): Promise<{ rental: any }> {
    const response = await fetch(`${API_URL}/rentals/${rentalId}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ rental: any }>(response);
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

  // ===============================
  // MÉTODOS PARA NOTIFICACIONES
  // ===============================

  // Obtener notificaciones del usuario
  async getNotifications(page: number = 1, limit: number = 20, unreadOnly: boolean = false): Promise<NotificationsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      unreadOnly: unreadOnly.toString()
    });

    const response = await fetch(`${API_URL}/notifications?${params}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<NotificationsResponse>(response);
  }

  // Marcar notificación específica como leída
  async markNotificationAsRead(notificationId: string): Promise<{ message: string; notification: Notification }> {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ message: string; notification: Notification }>(response);
  }

  // Marcar todas las notificaciones como leídas
  async markAllNotificationsAsRead(): Promise<{ message: string; modifiedCount: number }> {
    const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: 'PUT',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ message: string; modifiedCount: number }>(response);
  }

  // Marcar notificaciones específicas como leídas
  async markNotificationsAsRead(notificationIds: string[]): Promise<{ message: string; modifiedCount: number }> {
    const response = await fetch(`${API_URL}/notifications/mark-read`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify({ notificationIds }),
    });

    return this.handleResponse<{ message: string; modifiedCount: number }>(response);
  }

  // Obtener conteo de notificaciones no leídas
  async getUnreadNotificationsCount(): Promise<{ unreadCount: number }> {
    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ unreadCount: number }>(response);
  }

  // Eliminar notificación específica
  async deleteNotification(notificationId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ message: string }>(response);
  }

  // Eliminar todas las notificaciones leídas
  async clearReadNotifications(): Promise<{ message: string; deletedCount: number }> {
    const response = await fetch(`${API_URL}/notifications/clear-read`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ message: string; deletedCount: number }>(response);
  }
}

export const apiService = new ApiService();
