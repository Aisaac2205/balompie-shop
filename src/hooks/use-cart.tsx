import { createContext, useContext, useEffect, useState } from "react";
import { CartItem, JerseyCustomization } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateCustomization: (id: string, customization: JerseyCustomization) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("balompie-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("balompie-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, "id">) => {
    try {
      const id = `${newItem.productId}-${newItem.size}-${Date.now()}-${JSON.stringify(newItem.customization)}`;
      
      setItems(currentItems => {
        const existingItem = currentItems.find(item => 
          item.productId === newItem.productId && 
          item.size === newItem.size &&
          JSON.stringify(item.customization) === JSON.stringify(newItem.customization)
        );
        
        if (existingItem) {
          toast({
            title: "Producto actualizado",
            description: `Se aumentó la cantidad de ${existingItem.name}`,
          });
          
          return currentItems.map(item =>
            item.id === id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        }
        
        toast({
          title: "Producto añadido",
          description: `${newItem.name} se añadió al carrito`,
        });
        
        return [...currentItems, { ...newItem, id }];
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Error",
        description: "No se pudo añadir el producto al carrito",
        variant: "destructive",
      });
    }
  };

  const removeItem = (id: string) => {
    setItems(currentItems => {
      const item = currentItems.find(item => item.id === id);
      if (item) {
        toast({
          title: "Producto eliminado",
          description: `${item.name} se eliminó del carrito`,
        });
      }
      return currentItems.filter(item => item.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const updateCustomization = (id: string, customization: JerseyCustomization) => {
    try {
      setItems(currentItems =>
        currentItems.map(item =>
          item.id === id ? { ...item, customization } : item
        )
      );
      
      toast({
        title: "Personalización actualizada",
        description: "Los detalles del producto han sido actualizados",
      });
    } catch (error) {
      console.error('Error updating customization:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la personalización",
        variant: "destructive",
      });
    }
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Carrito vaciado",
      description: "Todos los productos han sido eliminados",
    });
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      updateCustomization,
      clearCart,
      total,
      itemCount,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}