import { useState, useRef } from "react";
import { useHeroImages } from "@/hooks/use-hero-images";
import { uploadImage } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Link as LinkIcon, 
  Eye, 
  EyeOff, 
  GripVertical,
  Plus
} from "lucide-react";
import { HeroImage, CreateHeroImageDto, UpdateHeroImageDto } from "@/types/hero-image";
import { useToast } from "@/hooks/use-toast";

export default function HeroImagesAdmin() {
  const { 
    heroImages, 
    isLoading, 
    createHeroImage, 
    updateHeroImage, 
    deleteHeroImage,
    reorderHeroImages,
    isCreating,
    isUpdating,
    isDeleting
  } = useHeroImages();
  const { toast } = useToast();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateHeroImageDto>({
    imageUrl: '',
    title: '',
    description: '',
    isActive: true,
    displayOrder: 0,
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea imagen
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      toast({
        title: '❌ Error',
        description: 'Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP, GIF)',
        variant: 'destructive',
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: '❌ Error',
        description: 'La imagen no debe superar los 5MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl: uploadedUrl }));
      toast({
        title: '✅ Imagen subida',
        description: 'La imagen se ha subido correctamente',
      });
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'No se pudo subir la imagen',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreate = () => {
    if (!formData.imageUrl) {
      toast({
        title: '❌ Error',
        description: 'Debes proporcionar una URL o subir una imagen',
        variant: 'destructive',
      });
      return;
    }

    createHeroImage(formData);
    setShowCreateDialog(false);
    resetForm();
  };

  const handleUpdate = (image: HeroImage) => {
    if (!formData.imageUrl) {
      toast({
        title: '❌ Error',
        description: 'La URL de la imagen es requerida',
        variant: 'destructive',
      });
      return;
    }

    const updateData: UpdateHeroImageDto = {
      imageUrl: formData.imageUrl,
      title: formData.title,
      description: formData.description,
      isActive: formData.isActive,
      displayOrder: formData.displayOrder,
    };

    updateHeroImage({ id: image.id, data: updateData });
    setEditingImage(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteHeroImage(id);
    setDeleteConfirm(null);
  };

  const handleToggleActive = (image: HeroImage) => {
    updateHeroImage({ 
      id: image.id, 
      data: { isActive: !image.isActive } 
    });
  };

  const resetForm = () => {
    setFormData({
      imageUrl: '',
      title: '',
      description: '',
      isActive: true,
      displayOrder: 0,
    });
    setUploadMethod('url');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openEditDialog = (image: HeroImage) => {
    setEditingImage(image);
    setFormData({
      imageUrl: image.imageUrl,
      title: image.title || '',
      description: image.description || '',
      isActive: image.isActive,
      displayOrder: image.displayOrder,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Imágenes del Hero</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las imágenes que aparecen en la sección principal de la página
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Imagen
        </Button>
      </div>

      {/* Lista de imágenes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {heroImages.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative aspect-video">
              <img 
                src={image.imageUrl} 
                alt={image.title || 'Hero image'} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {image.isActive ? (
                  <Badge className="bg-green-500">Activa</Badge>
                ) : (
                  <Badge variant="secondary">Inactiva</Badge>
                )}
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">
                {image.title || 'Sin título'}
              </CardTitle>
              {image.description && (
                <CardDescription className="line-clamp-2">
                  {image.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Orden: {image.displayOrder}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openEditDialog(image)}
                >
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleToggleActive(image)}
                >
                  {image.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setDeleteConfirm(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {heroImages.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No hay imágenes</p>
            <p className="text-sm text-muted-foreground mb-4">
              Comienza agregando una imagen para el hero
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primera Imagen
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog para crear/editar */}
      <Dialog open={showCreateDialog || !!editingImage} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setEditingImage(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingImage ? 'Editar Imagen' : 'Agregar Nueva Imagen'}
            </DialogTitle>
            <DialogDescription>
              {editingImage 
                ? 'Modifica los datos de la imagen del hero' 
                : 'Agrega una nueva imagen para el hero con su información'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Método de carga */}
            <div className="flex gap-2 border-b pb-4">
              <Button
                type="button"
                variant={uploadMethod === 'url' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('url')}
                className="flex-1"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                URL
              </Button>
              <Button
                type="button"
                variant={uploadMethod === 'file' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('file')}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Subir Archivo
              </Button>
            </div>

            {/* URL Input */}
            {uploadMethod === 'url' && (
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de la Imagen *</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                />
              </div>
            )}

            {/* File Upload */}
            {uploadMethod === 'file' && (
              <div className="space-y-2">
                <Label htmlFor="fileUpload">Subir Imagen *</Label>
                <div className="flex gap-2">
                  <Input
                    ref={fileInputRef}
                    id="fileUpload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                  {formData.imageUrl && (
                    <Badge variant="secondary" className="shrink-0">
                      ✓ Subida
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Formatos aceptados: JPG, PNG, WebP, GIF. Máximo 5MB.
                </p>
              </div>
            )}

            {/* Preview */}
            {formData.imageUrl && (
              <div className="space-y-2">
                <Label>Vista Previa</Label>
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="COLECCIONES DE TEMPORADA"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Descubre las mejores camisolas oficiales..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Display Order */}
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Orden de Visualización</Label>
              <Input
                id="displayOrder"
                type="number"
                min="0"
                value={formData.displayOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
              />
              <p className="text-xs text-muted-foreground">
                Las imágenes con menor número aparecen primero
              </p>
            </div>

            {/* Active Switch */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Imagen activa</Label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setEditingImage(null);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => editingImage ? handleUpdate(editingImage) : handleCreate()}
                disabled={isCreating || isUpdating || isUploading}
              >
                {isCreating || isUpdating ? 'Guardando...' : editingImage ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La imagen será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
