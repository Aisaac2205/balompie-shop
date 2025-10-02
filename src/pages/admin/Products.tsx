import { useState } from 'react';
import { useProducts, useAdminProducts } from '@/hooks/use-products';
import { ProductList } from '@/components/admin/ProductList';
import { ProductForm } from '@/components/admin/ProductForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';

const Products = () => {
  const { products, isLoading, teams, equipmentTypes, productTypes, sizes, colors } = useProducts();
  const { createProduct, updateProduct, deleteProduct } = useAdminProducts();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Estados para el diálogo de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  // Abrir diálogo de confirmación para eliminar
  const handleDeleteClick = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setProductToDelete(product);
      setDeleteDialogOpen(true);
    }
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteProduct(productToDelete.id);
      if (result.success) {
        toast({
          title: "✅ Éxito",
          description: `El producto "${productToDelete.name}" ha sido eliminado exitosamente`,
          className: "border-green-200 bg-green-50 text-green-800",
        });
      } else {
        toast({
          title: "❌ Error",
          description: result.message,
          variant: "destructive",
        });
      }
      setProductToDelete(null);
    } catch (error) {
      toast({
        title: "❌ Error",
        description: `No se pudo eliminar el producto "${productToDelete.name}"`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    setFormLoading(true);
    try {
      let result;
      
      if (editingProduct) {
        // Actualizar producto existente
        result = await updateProduct(editingProduct.id, productData);
      } else {
        // Crear nuevo producto
        result = await createProduct(productData);
      }

      if (result.success) {
        toast({
          title: editingProduct ? "Producto actualizado" : "Producto creado",
          description: result.message,
        });
        setIsFormOpen(false);
        setEditingProduct(null);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onAddNew={handleAddNew}
        isLoading={isLoading}
        teams={teams}
        equipmentTypes={equipmentTypes}
        productTypes={productTypes}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </DialogTitle>
          </DialogHeader>
          
          <ProductForm
            product={editingProduct || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={formLoading}
            teams={teams}
            equipmentTypes={equipmentTypes}
            productTypes={productTypes}
            sizes={sizes}
            colors={colors}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Eliminar Producto"
        description="¿Estás seguro de que quieres eliminar este producto? Esta acción eliminará permanentemente el producto del catálogo."
        itemName={productToDelete?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Products;