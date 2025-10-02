import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  Store, 
  Mail, 
  Phone, 
  MapPin,
  Save,
  Globe,
  CreditCard,
  Bell,
  Shield
} from 'lucide-react';

const Settings = () => {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'La Casa del Balompié',
    storeDescription: 'Tu tienda de camisolas de fútbol favorita',
    storeEmail: 'info@balompie.com',
    storePhone: '+502 1234-5678',
    storeAddress: 'Guatemala, Guatemala',
    currency: 'GTQ',
    taxRate: 12,
    enableNotifications: true,
    enableInventoryTracking: false,
    enableAutoBackup: true,
  });

  const [socialSettings, setSocialSettings] = useState({
    facebook: '',
    instagram: '',
    whatsapp: '+502 1234-5678',
    website: '',
  });

  const [paymentSettings, setPaymentSettings] = useState({
    enableCashOnDelivery: true,
    enableBankTransfer: true,
    enablePayPal: false,
    enableStripe: false,
  });

  const [loading, setLoading] = useState(false);

  const handleSaveStoreSettings = async () => {
    setLoading(true);
    try {
      // Simular guardado en el futuro se conectará al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configuración guardada",
        description: "La configuración de la tienda se guardó correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSocialSettings = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Redes sociales actualizadas",
        description: "La configuración de redes sociales se guardó correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron actualizar las redes sociales",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">
          Administra la configuración de tu tienda
        </p>
      </div>

      {/* Configuración de la Tienda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="h-5 w-5 mr-2" />
            Información de la Tienda
          </CardTitle>
          <CardDescription>
            Configuración básica de tu tienda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storeName">Nombre de la Tienda</Label>
              <Input
                id="storeName"
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="storeEmail">Email de Contacto</Label>
              <Input
                id="storeEmail"
                type="email"
                value={storeSettings.storeEmail}
                onChange={(e) => setStoreSettings(prev => ({ ...prev, storeEmail: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="storePhone">Teléfono</Label>
              <Input
                id="storePhone"
                value={storeSettings.storePhone}
                onChange={(e) => setStoreSettings(prev => ({ ...prev, storePhone: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="currency">Moneda</Label>
              <Input
                id="currency"
                value={storeSettings.currency}
                onChange={(e) => setStoreSettings(prev => ({ ...prev, currency: e.target.value }))}
                placeholder="GTQ"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="storeDescription">Descripción</Label>
            <Textarea
              id="storeDescription"
              value={storeSettings.storeDescription}
              onChange={(e) => setStoreSettings(prev => ({ ...prev, storeDescription: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="storeAddress">Dirección</Label>
            <Input
              id="storeAddress"
              value={storeSettings.storeAddress}
              onChange={(e) => setStoreSettings(prev => ({ ...prev, storeAddress: e.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones por Email</Label>
                <p className="text-sm text-gray-600">Recibir notificaciones de nuevos pedidos</p>
              </div>
              <Switch
                checked={storeSettings.enableNotifications}
                onCheckedChange={(checked) => setStoreSettings(prev => ({ ...prev, enableNotifications: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Seguimiento de Inventario</Label>
                <p className="text-sm text-gray-600">Controlar stock de productos automáticamente</p>
              </div>
              <Switch
                checked={storeSettings.enableInventoryTracking}
                onCheckedChange={(checked) => setStoreSettings(prev => ({ ...prev, enableInventoryTracking: checked }))}
              />
            </div>
          </div>
          
          <Button onClick={handleSaveStoreSettings} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </CardContent>
      </Card>

      {/* Redes Sociales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Redes Sociales
          </CardTitle>
          <CardDescription>
            Enlaces a tus redes sociales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                placeholder="https://facebook.com/tutienda"
                value={socialSettings.facebook}
                onChange={(e) => setSocialSettings(prev => ({ ...prev, facebook: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/tutienda"
                value={socialSettings.instagram}
                onChange={(e) => setSocialSettings(prev => ({ ...prev, instagram: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                placeholder="+502 1234-5678"
                value={socialSettings.whatsapp}
                onChange={(e) => setSocialSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="website">Sitio Web</Label>
              <Input
                id="website"
                placeholder="https://tutienda.com"
                value={socialSettings.website}
                onChange={(e) => setSocialSettings(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </div>
          
          <Button onClick={handleSaveSocialSettings} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Redes Sociales'}
          </Button>
        </CardContent>
      </Card>

      {/* Métodos de Pago */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Métodos de Pago
          </CardTitle>
          <CardDescription>
            Configura los métodos de pago disponibles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pago Contra Entrega</Label>
                <p className="text-sm text-gray-600">Permitir pago en efectivo al recibir el producto</p>
              </div>
              <Switch
                checked={paymentSettings.enableCashOnDelivery}
                onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, enableCashOnDelivery: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Transferencia Bancaria</Label>
                <p className="text-sm text-gray-600">Aceptar pagos por transferencia bancaria</p>
              </div>
              <Switch
                checked={paymentSettings.enableBankTransfer}
                onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, enableBankTransfer: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>PayPal</Label>
                <p className="text-sm text-gray-600">Integración con PayPal (requiere configuración adicional)</p>
              </div>
              <Switch
                checked={paymentSettings.enablePayPal}
                onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, enablePayPal: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <Label className="text-gray-600">Versión del Sistema</Label>
              <p className="font-medium">v1.0.0</p>
            </div>
            <div>
              <Label className="text-gray-600">Última Actualización</Label>
              <p className="font-medium">29 Sept 2025</p>
            </div>
            <div>
              <Label className="text-gray-600">Estado de la Base de Datos</Label>
              <p className="font-medium text-green-600">Conectado</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;