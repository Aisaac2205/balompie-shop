// ============= Validation Utilities =============
// Input validation for La Casa del Balompié

export const VALIDATION_RULES = {
  playerName: {
    maxLength: 12,
    minLength: 1,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  },
  playerNumber: {
    min: 1,
    max: 99,
    pattern: /^\d{1,2}$/,
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]{8,15}$/,
  },
  customerName: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  },
} as const;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePlayerName(name: string): ValidationResult {
  const errors: string[] = [];
  
  if (!name || name.trim().length === 0) {
    errors.push('El nombre es requerido');
  } else {
    if (name.trim().length < VALIDATION_RULES.playerName.minLength) {
      errors.push('El nombre debe tener al menos 1 carácter');
    }
    
    if (name.trim().length > VALIDATION_RULES.playerName.maxLength) {
      errors.push(`El nombre no puede tener más de ${VALIDATION_RULES.playerName.maxLength} caracteres`);
    }
    
    if (!VALIDATION_RULES.playerName.pattern.test(name.trim())) {
      errors.push('El nombre solo puede contener letras y espacios');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePlayerNumber(number: string): ValidationResult {
  const errors: string[] = [];
  
  if (!number || number.trim().length === 0) {
    errors.push('El número es requerido');
  } else {
    if (!VALIDATION_RULES.playerNumber.pattern.test(number)) {
      errors.push('El número debe ser entre 1 y 99');
    }
    
    const num = parseInt(number);
    if (num < VALIDATION_RULES.playerNumber.min || num > VALIDATION_RULES.playerNumber.max) {
      errors.push(`El número debe estar entre ${VALIDATION_RULES.playerNumber.min} y ${VALIDATION_RULES.playerNumber.max}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];
  
  if (!phone || phone.trim().length === 0) {
    errors.push('El teléfono es requerido');
  } else {
    if (!VALIDATION_RULES.phone.pattern.test(phone.trim())) {
      errors.push('Formato de teléfono inválido (ej: +1234567890)');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateCustomerName(name: string): ValidationResult {
  const errors: string[] = [];
  
  if (!name || name.trim().length === 0) {
    errors.push('El nombre es requerido');
  } else {
    if (name.trim().length < VALIDATION_RULES.customerName.minLength) {
      errors.push(`El nombre debe tener al menos ${VALIDATION_RULES.customerName.minLength} caracteres`);
    }
    
    if (name.trim().length > VALIDATION_RULES.customerName.maxLength) {
      errors.push(`El nombre no puede tener más de ${VALIDATION_RULES.customerName.maxLength} caracteres`);
    }
    
    if (!VALIDATION_RULES.customerName.pattern.test(name.trim())) {
      errors.push('El nombre solo puede contener letras y espacios');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Sanitize input to prevent XSS and injection attacks
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

// Sanitize entire customization object
export function sanitizeCustomization(customization: any): any {
  if (!customization || typeof customization !== 'object') {
    return {};
  }
  
  const sanitized: any = {};
  
  if (customization.playerName) {
    sanitized.playerName = sanitizeInput(customization.playerName);
  }
  
  if (customization.playerNumber) {
    sanitized.playerNumber = sanitizeInput(customization.playerNumber);
  }
  
  if (Array.isArray(customization.patches)) {
    sanitized.patches = customization.patches.filter(patch => 
      patch && typeof patch === 'object' && patch.id
    );
  }
  
  return sanitized;
}