// Base de datos en memoria para testing
interface TestBusiness {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  phone?: string;
  whatsapp_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TestService {
  id: number;
  business_id: number;
  name: string;
  description?: string;
  duration_minutes: number;
  price?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Almacenamiento en memoria
let businesses: TestBusiness[] = [];
let services: TestService[] = [];
let nextBusinessId = 1;
let nextServiceId = 1;

export function getTestDatabase() {
  return {
    get: async (query: string, params: any[] = []) => {
      console.log('TEST DB GET:', query, params);
      
      if (query.includes('SELECT id FROM businesses WHERE email = ?')) {
        const email = params[0];
        return businesses.find(b => b.email === email) || null;
      }
      
      if (query.includes('SELECT id, name, email, password_hash, is_active FROM businesses WHERE email = ?')) {
        const email = params[0];
        return businesses.find(b => b.email === email) || null;
      }
      
      return null;
    },
    
    all: async (query: string, params: any[] = []) => {
      console.log('TEST DB ALL:', query, params);
      
      if (query.includes('SELECT id, name, description, duration_minutes, price, is_active')) {
        const businessId = params[0];
        return services.filter(s => s.business_id === businessId && s.is_active);
      }
      
      return [];
    },
    
    run: async (query: string, params: any[] = []) => {
      console.log('TEST DB RUN:', query, params);
      
      if (query.includes('INSERT INTO businesses')) {
        const [name, email, password_hash, phone, whatsapp_number, is_active] = params;
        const business: TestBusiness = {
          id: nextBusinessId++,
          name,
          email,
          password_hash,
          phone,
          whatsapp_number,
          is_active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        businesses.push(business);
        return { lastID: business.id, changes: 1 };
      }
      
      if (query.includes('INSERT INTO services')) {
        const [business_id, name, description, duration_minutes, price, is_active] = params;
        const service: TestService = {
          id: nextServiceId++,
          business_id,
          name,
          description,
          duration_minutes,
          price,
          is_active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        services.push(service);
        return { lastID: service.id, changes: 1 };
      }
      
      return { lastID: 1, changes: 1 };
    },
    
    exec: async (query: string) => {
      console.log('TEST DB EXEC:', query);
      return;
    },
    
    close: async () => {
      console.log('TEST DB CLOSE');
      return;
    }
  };
}

// Función para resetear la base de datos de testing
export function resetTestDatabase() {
  businesses = [];
  services = [];
  nextBusinessId = 1;
  nextServiceId = 1;
}

// Función para obtener datos de testing
export function getTestData() {
  return {
    businesses,
    services
  };
}