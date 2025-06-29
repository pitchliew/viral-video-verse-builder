import { useState } from "react";
import { X, Play, Link, Download, Star, TrendingUp, Users, Eye, Copy, RefreshCw, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScriptEditor } from "./ScriptEditor";
import { BrandCard } from "./BrandCard";
import { BrandModal } from "./BrandModal";
import { useBrands, Brand } from "@/hooks/useBrands";

interface Video {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  author: string;
  caption: string;
  script: string; // Added script field
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followers: string | number;
  hookType: string;
  industry: string;
  videoObjective: string;
  title: string;
  whyThisWorks: string;
  viralScore: number;
}

interface VideoAnalysisModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

interface CustomRequirements {
  targetAudience: string;
  brand: string;
  duration: string;
  voiceTone: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const safeRender = (value: any): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (value && typeof value === 'object' && value.value) return String(value.value);
  return String(value || '');
};

const TARGET_AUDIENCES = [
  "Busy professionals aged 25-40",
  "Young entrepreneurs and startup founders", 
  "Fashion-conscious women aged 18-35",
  "Fitness enthusiasts and health-conscious individuals",
  "Small business owners and freelancers",
  "Tech-savvy millennials",
  "Parents and family-oriented consumers",
  "Students and young adults",
  "Creative professionals and artists",
  "Retirees and seniors",
  "Other"
];

export const VideoAnalysisModal = ({ video, isOpen, onClose }: VideoAnalysisModalProps) => {
  const [activeTab, setActiveTab] = useState("insights");
  const [customRequirements, setCustomRequirements] = useState<CustomRequirements>({
    targetAudience: '',
    brand: '',
    duration: '15-30 seconds',
    voiceTone: 'Casual'
  });
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showScriptEditor, setShowScriptEditor] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isCreatingBrand, setIsCreatingBrand] = useState(false);
  
  const { brands, loading: brandsLoading, createBrand, updateBrand, deleteBrand } = useBrands();
  const { toast } = useToast();

  if (!video) return null;

  const engagementRate = ((video.likes + video.comments + video.shares) / video.views * 100).toFixed(1);

  const handleInputChange = (field: keyof CustomRequirements, value: string) => {
    setCustomRequirements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBrandSelect = (brandId: string) => {
    setSelectedBrandId(brandId);
    const selectedBrand = brands.find(b => b.id === brandId);
    if (selectedBrand) {
      setCustomRequirements(prev => ({
        ...prev,
        brand: selectedBrand.name,
        targetAudience: selectedBrand.target_audience || prev.targetAudience
      }));
    }
  };

  const handleCreateBrand = async (brandData: Omit<Brand, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsCreatingBrand(true);
      const newBrand = await createBrand(brandData);
      setShowBrandModal(false);
      setEditingBrand(null);
      // Auto-select the newly created brand
      if (newBrand) {
        handleBrandSelect(newBrand.id);
      }
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsCreatingBrand(false);
    }
  };

  const handleEditBrand = async (brandData: Omit<Brand, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!editingBrand) return;
    
    try {
      setIsCreatingBrand(true);
      await updateBrand(editingBrand.id, brandData);
      setShowBrandModal(false);
      setEditingBrand(null);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsCreatingBrand(false);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      await deleteBrand(brandId);
      if (selectedBrandId === brandId) {
        setSelectedBrandId('');
        setCustomRequirements(prev => ({ ...prev, brand: '' }));
      }
    }
  };

  const openCreateBrandModal = () => {
    setEditingBrand(null);
    setShowBrandModal(true);
  };

  const openEditBrandModal = (brand: Brand) => {
    setEditingBrand(brand);
    setShowBrandModal(true);
  };

  const handleGenerateScript = async () => {
    if (!customRequirements.targetAudience.trim() || !customRequirements.brand.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both Target Audience and Brand/Product fields.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-script-with-claude', {
        body: {
          video: {
            ...video,
            originalScript: video.script // Include the original script for AI context
          },
          customRequirements
        }
      });

      if (error) throw error;

      if (data.success) {
        setGeneratedScript(data.generatedScript);
        setShowScriptEditor(true);
        toast({
          title: "Script Generated Successfully!",
          description: "Your custom script is ready. Opening script editor...",
        });
      } else {
        throw new Error(data.error || 'Failed to generate script');
      }
    } catch (error) {
      console.error('Script generation error:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your script. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to Clipboard",
        description: "Content has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard. Please select and copy manually.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setCustomRequirements({
      targetAudience: '',
      brand: '',
      duration: '15-30 seconds',
      voiceTone: 'Casual'
    });
    setGeneratedScript('');
    setShowScriptEditor(false);
  };

  // If script editor is open, show it instead of the modal
  if (showScriptEditor && generatedScript) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
          <ScriptEditor 
            generatedScript={generatedScript}
            originalVideo={{
              title: safeRender(video.title),
              author: safeRender(video.author),
              hookType: safeRender(video.hookType),
              industry: safeRender(video.industry),
              viralScore: video.viralScore
            }}
            onClose={() => setShowScriptEditor(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-50 to-blue-50">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Viral Template Analysis
            </DialogTitle>
          </DialogHeader>

          {/* Video Preview Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="relative">
              <img 
                src={video.thumbnailUrl} 
                alt={safeRender(video.title)}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="lg" className="rounded-full bg-white/90 hover:bg-white text-purple-600 shadow-lg">
                  <Play className="w-6 h-6 ml-1" />
                </Button>
              </div>
              <div className="absolute top-3 right-3">
                <Badge className="bg-black/70 text-white border-0">
                  {video.viralScore}/10
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">{safeRender(video.title)}</h3>
                <p className="text-gray-600 text-sm">@{safeRender(video.author)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">{formatNumber(video.views)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">{engagementRate}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="font-semibold">{safeRender(video.followers)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">{safeRender(video.hookType)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="script">Script</TabsTrigger>
              <TabsTrigger value="brands">Brands</TabsTrigger>
              <TabsTrigger value="generate">Generate</TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Hook Analysis
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hook Type:</span>
                      <Badge variant="secondary">{safeRender(video.hookType)}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <Badge variant="outline">{safeRender(video.industry)}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Objective:</span>
                      <span className="text-sm font-medium">{safeRender(video.videoObjective)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Why This Works
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {safeRender(video.whyThisWorks)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{formatNumber(video.views)}</div>
                      <div className="text-sm text-gray-500">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{formatNumber(video.likes)}</div>
                      <div className="text-sm text-gray-500">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{formatNumber(video.comments)}</div>
                      <div className="text-sm text-gray-500">Comments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{formatNumber(video.shares)}</div>
                      <div className="text-sm text-gray-500">Shares</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="script" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Original Script</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(video.script || video.caption)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {video.script || video.caption || 'No script available'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {video.script && video.caption && video.script !== video.caption && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Original Caption</h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(video.caption)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {safeRender(video.caption)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="brands" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">My Brands</h3>
                <Button onClick={openCreateBrandModal} className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Brand
                </Button>
              </div>

              {brandsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading brands...</p>
                </div>
              ) : brands.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-md mx-auto">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-gray-500 text-lg mb-2">No brands yet</h4>
                    <p className="text-gray-400 mb-4">Create your first brand to get started with personalized script generation</p>
                    <p className="text-sm text-amber-600 mb-4">Note: You need to be logged in to create and manage brands</p>
                    <Button onClick={openCreateBrandModal} className="bg-gradient-to-r from-purple-600 to-blue-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Brand
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {brands.map((brand) => (
                    <BrandCard
                      key={brand.id}
                      brand={brand}
                      onEdit={openEditBrandModal}
                      onDelete={handleDeleteBrand}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="generate" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-500" />
                    Generate Custom Script with AI
                  </h4>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Audience *</label>
                      <Select value={customRequirements.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your target audience" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-64 overflow-y-auto">
                          {TARGET_AUDIENCES.map((audience) => (
                            <SelectItem key={audience} value={audience}>
                              {audience}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Brand/Product *</label>
                      <div className="flex gap-2">
                        <Select value={selectedBrandId} onValueChange={handleBrandSelect}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select a brand or enter custom" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                            {brands.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id}>
                                <div className="flex items-center gap-2">
                                  <span>{brand.name}</span>
                                  {brand.category && (
                                    <Badge variant="secondary" className="text-xs">
                                      {brand.category}
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={openCreateBrandModal}
                          className="shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {!selectedBrandId && (
                        <Input 
                          type="text" 
                          placeholder="Or enter brand/product name"
                          value={customRequirements.brand}
                          onChange={(e) => handleInputChange('brand', e.target.value)}
                          className="mt-2"
                        />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Duration</label>
                        <select 
                          className="w-full p-2 border rounded-lg"
                          value={customRequirements.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                        >
                          <option>15-30 seconds</option>
                          <option>30-60 seconds</option>
                          <option>60-90 seconds</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Voice Tone</label>
                        <select 
                          className="w-full p-2 border rounded-lg"
                          value={customRequirements.voiceTone}
                          onChange={(e) => handleInputChange('voiceTone', e.target.value)}
                        >
                          <option>Casual</option>
                          <option>Professional</option>
                          <option>Energetic</option>
                          <option>Inspirational</option>
                          <option>Authoritative</option>
                          <option>Friendly</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-6">
                    <Button 
                      onClick={handleGenerateScript}
                      disabled={isGenerating}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Star className="w-4 h-4 mr-2" />
                          Generate Custom Script
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={resetForm}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <BrandModal
        isOpen={showBrandModal}
        onClose={() => {
          setShowBrandModal(false);
          setEditingBrand(null);
        }}
        onSave={editingBrand ? handleEditBrand : handleCreateBrand}
        brand={editingBrand}
        isLoading={isCreatingBrand}
      />
    </>
  );
};
