import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckoutForm } from '@/components/cart/CheckoutForm';
import { CartItem } from '@/types/product';

interface OrderData {
  items: CartItem[];
  total: number;
}

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = searchParams.get('data');
      if (data) {
        const decodedData = JSON.parse(atob(data));
        setOrderData(decodedData);
      } else {
        setError('No se encontraron datos del pedido');
      }
    } catch (err) {
      console.error('Error parsing order data:', err);
      setError('Error al cargar los datos del pedido');
    }
  }, [searchParams]);

  const handleSuccess = () => {
    // Cerrar la ventana después del éxito
    setTimeout(() => {
      window.close();
    }, 2000);
  };

  const handleCancel = () => {
    window.close();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-white/80 mb-6">{error}</p>
          <button
            onClick={() => window.close()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando datos del pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600">
      <CheckoutForm
        items={orderData.items}
        total={orderData.total}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}