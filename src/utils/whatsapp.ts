// ============= WhatsApp Integration =============
// Utilities for sending orders via WhatsApp

import { CartItem } from '@/types/product';
import { sanitizeInput } from './validation';

// WhatsApp Business number (should be configured in environment)
const WHATSAPP_BUSINESS_NUMBER = '50246907489'; // Replace with real number

export interface WhatsAppOrderData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  items: CartItem[];
  total: number;
}

export function formatWhatsAppMessage(orderData: WhatsAppOrderData): string {
  const { customerName, email, phone, address, notes, items, total } = orderData;
  
  // Sanitize inputs
  const safeName = sanitizeInput(customerName);
  const safeEmail = sanitizeInput(email);
  const safePhone = sanitizeInput(phone);
  const safeAddress = sanitizeInput(address);
  const safeNotes = notes ? sanitizeInput(notes) : '';
  
  let message = `*🏆 NUEVO PEDIDO - La Casa del Balompié*\n\n`;
  message += `👤 *Cliente:* ${safeName}\n`;
  message += `� *Email:* ${safeEmail}\n`;
  message += `�📞 *Teléfono:* ${safePhone}\n`;
  message += `📍 *Dirección:* ${safeAddress}\n`;
  if (safeNotes) {
    message += `📝 *Notas:* ${safeNotes}\n`;
  }
  message += `\n🛒 *Productos:*\n`;
  
  items.forEach((item, index) => {
    message += `\n*${index + 1}.* ${item.name}\n`;
    message += `   • Equipo: ${item.team}\n`;
    message += `   • Versión: ${item.version === 'player' ? 'Jugador' : 'Fan'}\n`;
    message += `   • Talla: ${item.size}\n`;
    message += `   • Cantidad: ${item.quantity}\n`;
    
    if (item.customization?.personalizationType === 'player' && item.customization.selectedPlayer) {
      message += `   • Jugador: ${item.customization.selectedPlayer.name} #${item.customization.selectedPlayer.shirtNumber}\n`;
    } else if (item.customization?.personalizationType === 'custom') {
      if (item.customization.customName) {
        message += `   • Nombre: ${sanitizeInput(item.customization.customName)}\n`;
      }
      if (item.customization.customNumber) {
        message += `   • Número: ${item.customization.customNumber}\n`;
      }
    }
    
    message += `   • Precio: €${(item.price * item.quantity).toFixed(2)}\n`;
  });
  
  message += `\n💰 *Total: €${total.toFixed(2)}*\n\n`;
  message += `⏰ *Fecha:* ${new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`;
  
  return message;
}

export function openWhatsAppChat(orderData: WhatsAppOrderData): void {
  const message = formatWhatsAppMessage(orderData);
  const encodedMessage = encodeURIComponent(message);
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodedMessage}`;
  
  // Open in new tab/window
  window.open(whatsappUrl, '_blank');
}

export function generateOrderSummary(items: CartItem[]): string {
  let summary = 'Resumen del pedido:\n\n';
  
  items.forEach((item, index) => {
    summary += `${index + 1}. ${item.name} - Talla ${item.size}`;
    
    if (item.customization?.personalizationType === 'player' && item.customization.selectedPlayer) {
      summary += ` (${item.customization.selectedPlayer.name} #${item.customization.selectedPlayer.shirtNumber})`;
    } else if (item.customization?.personalizationType === 'custom') {
      summary += ' (';
      if (item.customization.customName) summary += `${item.customization.customName}`;
      if (item.customization.customNumber) summary += ` #${item.customization.customNumber}`;
      summary += ')';
    }
    
    summary += ` x${item.quantity} = €${(item.price * item.quantity).toFixed(2)}\n`;
  });
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  summary += `\nTotal: €${total.toFixed(2)}`;
  
  return summary;
}

// For future backend integration
export async function sendOrderToAPI(orderData: WhatsAppOrderData): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // TODO: Replace with actual API endpoint when backend is ready
    // const response = await fetch('/api/orders', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(orderData),
    // });
    
    // if (!response.ok) {
    //   throw new Error('Failed to create order');
    // }
    
    // const result = await response.json();
    // return { success: true, orderId: result.id };
    
    // Mock implementation for now
    console.log('📦 Order data ready for API:', orderData);
    
    return {
      success: true,
      orderId: `ORD-${Date.now()}`,
    };
  } catch (error) {
    console.error('Error sending order to API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}