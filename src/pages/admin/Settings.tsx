import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Save, 
  Eye,
  Upload,
  RefreshCw,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface SiteSettings {
  // Branding
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroBackground: string;
  
  // Contact Info
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  whatsappNumber: string;
  
  // Social Media
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

const Settings = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'La Casa del Balompié',
    siteDescription: 'Tu tienda de confianza para camisolas de fútbol de alta calidad',
            logo: '/logo.png',
    favicon: '/favicon.ico',
    
    primaryColor: '#FFD100',
    secondaryColor: '#FFB800',
    accentColor: '#00A398',
    backgroundColor: '#141414',
    textColor: '#FFFFFF',
    
    heroTitle: 'Tienda de Camisolas',
    heroSubtitle: 'Descubre las mejores camisolas de fútbol con personalización completa. Equipos oficiales, parches auténticos y calidad premium.',
    heroBackground: '/src/assets/camisolas-background.jpg',
    
    contactEmail: 'info@lacasadelbalompie.com',
    contactPhone: '+502 1234-5678',
    contactAddress: 'Guatemala City, Guatemala',
    whatsappNumber: '+502 1234-5678',
    
    socialMedia: {
      instagram: '@lacasadelbalompie',
      facebook: 'lacasadelbalompie',
      twitter: '@lacasadelbalompie',
      youtube: 'lacasadelbalompie'
    },
    
    metaTitle: 'La Casa del Balompié - Camisolas de Fútbol',
    metaDescription: 'Tienda especializada en camisolas de fútbol con personalización completa. Equipos oficiales, parches auténticos y calidad premium.',
    metaKeywords: ['camisolas', 'fútbol', 'equipos', 'parches', 'personalización']
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateSetting = (key: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const updateSocialMedia = (platform: keyof SiteSettings['socialMedia'], value: string) => {
    setSettings(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, field: keyof SiteSettings) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateSetting(field, imageUrl);
    }
  };

  const handleSave = () => {
    // Aquí se guardarían los cambios en localStorage o base de datos
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    setHasUnsavedChanges(false);
    // Simular guardado exitoso
    alert('Configuración guardada exitosamente');
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres restablecer todos los cambios?')) {
      // Recargar configuración original
      window.location.reload();
    }
  };

  const addKeyword = () => {
    const keyword = prompt('Ingresa una palabra clave:');
    if (keyword && settings.metaKeywords) {
      updateSetting('metaKeywords', [...settings.metaKeywords, keyword]);
    }
  };

  const removeKeyword = (index: number) => {
    if (settings.metaKeywords) {
      updateSetting('metaKeywords', settings.metaKeywords.filter((_, i) => i !== index));
    }
  };

  const PreviewMode = () => (
    <div className="fixed inset-0 z-50 bg-white overflow-auto">
      <div className="sticky top-0 bg-gray-900 p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Vista Previa</h2>
          <Button onClick={() => setIsPreviewMode(false)} variant="outline">
            Cerrar Vista Previa
          </Button>
        </div>
      </div>
      
      {/* Hero Section Preview */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${settings.heroBackground})` }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {settings.heroTitle}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {settings.heroSubtitle}
          </p>
        </div>
      </section>
      
      {/* Content Preview */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: settings.primaryColor }}>
            {settings.siteName}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {settings.siteDescription}
          </p>
        </div>
        
        {/* Color Preview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-lg mx-auto mb-2 border"
              style={{ backgroundColor: settings.primaryColor }}
            ></div>
            <p className="text-sm font-medium">Primario</p>
          </div>
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-lg mx-auto mb-2 border"
              style={{ backgroundColor: settings.secondaryColor }}
            ></div>
            <p className="text-sm font-medium">Secundario</p>
          </div>
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-lg mx-auto mb-2 border"
              style={{ backgroundColor: settings.accentColor }}
            ></div>
            <p className="text-sm font-medium">Acento</p>
          </div>
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-lg mx-auto mb-2 border"
              style={{ backgroundColor: settings.backgroundColor }}
            ></div>
            <p className="text-sm font-medium">Fondo</p>
          </div>
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-lg mx-auto mb-2 border"
              style={{ backgroundColor: settings.textColor }}
            ></div>
            <p className="text-sm font-medium">Texto</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isPreviewMode) {
    return <PreviewMode />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Configuración del Sitio</h1>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(true)}
            className="border-[#FFD100] text-[#FFD100] hover:bg-[#FFD100] hover:text-black"
          >
            <Eye className="mr-2 h-4 w-4" />
            Vista Previa
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Restablecer
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="bg-gradient-to-r from-[#FFD100] to-[#FFB800] text-black font-semibold hover:from-[#FFB800] hover:to-[#FFD100] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="branding" className="data-[state=active]:bg-[#FFD100] data-[state=active]:text-black">
            <Globe className="mr-2 h-4 w-4" />
            Marca
          </TabsTrigger>
          <TabsTrigger value="colors" className="data-[state=active]:bg-[#FFD100] data-[state=active]:text-black">
            <Palette className="mr-2 h-4 w-4" />
            Colores
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-[#FFD100] data-[state=active]:text-black">
            <Type className="mr-2 h-4 w-4" />
            Contenido
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-[#FFD100] data-[state=active]:text-black">
            <Mail className="mr-2 h-4 w-4" />
            Contacto
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-[#FFD100] data-[state=active]:text-black">
            <Eye className="mr-2 h-4 w-4" />
            SEO
          </TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Identidad de Marca</CardTitle>
              <CardDescription className="text-gray-400">
                Configura el nombre, descripción y logos de tu sitio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nombre del Sitio *</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                    placeholder="La Casa del Balompié"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Descripción del Sitio</Label>
                  <Input
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting('siteDescription', e.target.value)}
                    placeholder="Tu tienda de confianza para camisolas de fútbol"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Logo Principal</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="flex-1"
                    />
                    {settings.logo && (
                      <div className="w-20 h-20 border rounded-lg overflow-hidden">
                        <img 
                          src={settings.logo} 
                          alt="Logo Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'favicon')}
                      className="flex-1"
                    />
                    {settings.favicon && (
                      <div className="w-16 h-16 border rounded-lg overflow-hidden">
                        <img 
                          src={settings.favicon} 
                          alt="Favicon Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Paleta de Colores</CardTitle>
              <CardDescription className="text-gray-400">
                Personaliza los colores principales de tu sitio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Color Primario</Label>
                  <div className="flex items-center space-x-3">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      placeholder="#FFD100"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Color Secundario</Label>
                  <div className="flex items-center space-x-3">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                      placeholder="#FFB800"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Color de Acento</Label>
                  <div className="flex items-center space-x-3">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => updateSetting('accentColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.accentColor}
                      onChange={(e) => updateSetting('accentColor', e.target.value)}
                      placeholder="#00A398"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Color de Fondo</Label>
                  <div className="flex items-center space-x-3">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.backgroundColor}
                      onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                      placeholder="#141414"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="textColor">Color de Texto</Label>
                <div className="flex items-center space-x-3">
                  <Input
                    id="textColor"
                    type="color"
                    value={settings.textColor}
                    onChange={(e) => updateSetting('textColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={settings.textColor}
                    onChange={(e) => updateSetting('textColor', e.target.value)}
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Contenido Principal</CardTitle>
              <CardDescription className="text-gray-400">
                Edita los textos destacados de tu sitio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Título del Hero *</Label>
                <Input
                  id="heroTitle"
                  value={settings.heroTitle}
                  onChange={(e) => updateSetting('heroTitle', e.target.value)}
                  placeholder="Tienda de Camisolas"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Subtítulo del Hero</Label>
                <Textarea
                  id="heroSubtitle"
                  value={settings.heroSubtitle}
                  onChange={(e) => updateSetting('heroSubtitle', e.target.value)}
                  placeholder="Descripción del hero..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Imagen de Fondo del Hero</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'heroBackground')}
                    className="flex-1"
                  />
                  {settings.heroBackground && (
                    <div className="w-32 h-20 border rounded-lg overflow-hidden">
                      <img 
                        src={settings.heroBackground} 
                        alt="Hero Background Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Información de Contacto</CardTitle>
              <CardDescription className="text-gray-400">
                Configura los datos de contacto de tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de Contacto</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateSetting('contactEmail', e.target.value)}
                    placeholder="info@tusitio.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Teléfono</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => updateSetting('contactPhone', e.target.value)}
                    placeholder="+502 1234-5678"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp</Label>
                  <Input
                    id="whatsappNumber"
                    value={settings.whatsappNumber}
                    onChange={(e) => updateSetting('whatsappNumber', e.target.value)}
                    placeholder="+502 1234-5678"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactAddress">Dirección</Label>
                  <Input
                    id="contactAddress"
                    value={settings.contactAddress}
                    onChange={(e) => updateSetting('contactAddress', e.target.value)}
                    placeholder="Ciudad, País"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Redes Sociales</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={settings.socialMedia.instagram || ''}
                      onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                      placeholder="@usuario"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={settings.socialMedia.facebook || ''}
                      onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                      placeholder="usuario"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={settings.socialMedia.twitter || ''}
                      onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                      placeholder="@usuario"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={settings.socialMedia.youtube || ''}
                      onChange={(e) => updateSocialMedia('youtube', e.target.value)}
                      placeholder="usuario"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Configuración SEO</CardTitle>
              <CardDescription className="text-gray-400">
                Optimiza tu sitio para los motores de búsqueda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Título Meta *</Label>
                <Input
                  id="metaTitle"
                  value={settings.metaTitle}
                  onChange={(e) => updateSetting('metaTitle', e.target.value)}
                  placeholder="Título para SEO..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Descripción Meta</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.metaDescription}
                  onChange={(e) => updateSetting('metaDescription', e.target.value)}
                  placeholder="Descripción para SEO..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Palabras Clave</Label>
                <div className="space-y-2">
                  {settings.metaKeywords?.map((keyword, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeKeyword(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addKeyword}
                    className="border-[#FFD100] text-[#FFD100] hover:bg-[#FFD100] hover:text-black"
                  >
                    + Agregar Palabra Clave
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Changes Banner */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6 bg-[#FFD100] text-black p-4 rounded-lg shadow-xl border border-[#FFB800]">
          <div className="flex items-center space-x-3">
            <div className="animate-pulse">
              <Save className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Cambios sin guardar</p>
              <p className="text-sm opacity-80">Guarda los cambios para aplicarlos</p>
            </div>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-black text-white hover:bg-gray-800"
            >
              Guardar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
