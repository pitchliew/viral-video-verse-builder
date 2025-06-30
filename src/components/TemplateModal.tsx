import React, { useState } from "react";
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { CyberBadge } from "@/components/ui/cyber-badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useBrands } from "@/hooks/useBrands";
import { 
  Play, 
  Download, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp,
  Target,
  Sparkles,
  Brain,
  Zap,
  X,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";

interface Video {
  id: string;
  videoUrl: string;
  videoLink?: string;
  thumbnailUrl: string;
  author: string;
  caption: string;
  script: string;
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

interface TemplateModalProps {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
}

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
  "Retirees and seniors"
];

const CREATOR_STYLES = [
  "Energetic & Enthusiastic",
  "Professional & Authoritative",
  "Casual & Relatable",
  "Educational & Informative",
  "Humorous & Entertaining",
  "Inspirational & Motivational",
  "Trendy & Hip",
  "Calm & Soothing"
];

export const TemplateModal = ({ video, isOpen, onClose }: TemplateModalProps) => {
  const [formData, setFormData] = useState({
    brandName: "",
    brandDescription: "",
    targetAudience: "",
    callToAction: "",
    duration: "30-60 seconds",
    creatorStyle: "Energetic & Enthusiastic",
    additionalNotes: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { brands } = useBrands();
  const { toast } = useToast();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const engagementRate = ((video.likes + video.comments + video.shares) / video.views * 100).toFixed(1);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBrandSelect = (brandId: string) => {
    const selectedBrand = brands.find(b => b.id === brandId);
    if (selectedBrand) {
      setFormData(prev => ({
        ...prev,
        brandName: selectedBrand.name,
        brandDescription: selectedBrand.description || "",
        targetAudience: selectedBrand.target_audience || prev.targetAudience,
        callToAction: selectedBrand.call_to_action || prev.callToAction
      }));
    }
  };

  const handleGenerateScript = async () => {
    if (!formData.brandName.trim() || !formData.targetAudience) {
      toast({
        title: "Missing Information",
        description: "Please fill in brand name and target audience.",
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
            originalScript: video.script
          },
          customRequirements: {
            targetAudience: formData.targetAudience,
            brand: formData.brandName,
            duration: formData.duration,
            voiceTone: formData.creatorStyle,
            callToAction: formData.callToAction,
            brandDescription: formData.brandDescription,
            additionalNotes: formData.additionalNotes
          }
        }
      });

      if (error) throw error;

      if (data.success) {
        // Navigate to script editor or show success
        toast({
          title: "Script Generated Successfully!",
          description: "Your custom script is ready.",
        });
        
        // Here you would typically navigate to the OutputScriptScreen
        // For now, we'll close the modal
        onClose();
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

  const handleVideoClick = () => {
    const linkToOpen = video.videoLink || video.videoUrl;
    if (linkToOpen) {
      window.open(linkToOpen, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-cyber-bg-primary border border-cyber-accent-pink/30 shadow-[0_0_30px_rgba(255,0,128,0.3)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Left Side - Video Preview & Analysis */}
          <div className="space-y-6">
            {/* Video Preview */}
            <CyberCard glow>
              <div className="relative aspect-[9/16] overflow-hidden rounded-lg cursor-pointer group" onClick={handleVideoClick}>
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-cyber-accent-pink/90 flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-10 h-10 text-white ml-1" />
                  </div>
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 right-4">
                  <CyberBadge variant="success" glow>
                    {video.viralScore}/10
                  </CyberBadge>
                </div>
                
                <div className="absolute top-4 left-4">
                  <CyberBadge variant="secondary">
                    {video.hookType}
                  </CyberBadge>
                </div>
                
                <div className="absolute bottom-4 right-4">
                  <CyberBadge variant="outline">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Original
                  </CyberBadge>
                </div>
              </div>
            </CyberCard>

            {/* Video Stats */}
            <CyberCard variant="secondary">
              <CyberCardHeader>
                <CyberCardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyber-accent-green" />
                  Performance Metrics
                </CyberCardTitle>
              </CyberCardHeader>
              <CyberCardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyber-accent-blue mb-1">
                      {formatNumber(video.views)}
                    </div>
                    <div className="text-sm text-cyber-text-muted flex items-center justify-center gap-1">
                      <Eye className="w-3 h-3" />
                      Views
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyber-accent-pink mb-1">
                      {formatNumber(video.likes)}
                    </div>
                    <div className="text-sm text-cyber-text-muted flex items-center justify-center gap-1">
                      <Heart className="w-3 h-3" />
                      Likes
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyber-accent-green mb-1">
                      {formatNumber(video.comments)}
                    </div>
                    <div className="text-sm text-cyber-text-muted flex items-center justify-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      Comments
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyber-accent-purple mb-1">
                      {engagementRate}%
                    </div>
                    <div className="text-sm text-cyber-text-muted flex items-center justify-center gap-1">
                      <Zap className="w-3 h-3" />
                      Engagement
                    </div>
                  </div>
                </div>
              </CyberCardContent>
            </CyberCard>

            {/* Why This Works */}
            <CyberCard variant="outline">
              <CyberCardHeader>
                <CyberCardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-cyber-accent-pink" />
                  Why This Works
                </CyberCardTitle>
              </CyberCardHeader>
              <CyberCardContent>
                <p className="text-cyber-text-secondary leading-relaxed">
                  {video.whyThisWorks}
                </p>
              </CyberCardContent>
            </CyberCard>
          </div>

          {/* Right Side - Customization Form */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cyber-text-primary">
                Customize Template
              </h2>
              <button
                onClick={onClose}
                className="text-cyber-text-muted hover:text-cyber-accent-pink transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <CyberCard>
              <CyberCardContent className="p-6 space-y-6">
                {/* Brand Selection */}
                <div>
                  <label className="block text-sm font-medium text-cyber-text-primary mb-2">
                    Select Brand (Optional)
                  </label>
                  <Select onValueChange={handleBrandSelect}>
                    <SelectTrigger className="cyber-input">
                      <SelectValue placeholder="Choose from saved brands" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand Name */}
                <div>
                  <label className="block text-sm font-medium text-cyber-text-primary mb-2">
                    Brand/Product Name *
                  </label>
                  <CyberInput
                    placeholder="Enter your brand or product name"
                    value={formData.brandName}
                    onChange={(e) => handleInputChange('brandName', e.target.value)}
                    glow
                  />
                </div>

                {/* Brand Description */}
                <div>
                  <label className="block text-sm font-medium text-cyber-text-primary mb-2">
                    Brand Description
                  </label>
                  <Textarea
                    placeholder="Describe your brand, values, or unique selling points"
                    value={formData.brandDescription}
                    onChange={(e) => handleInputChange('brandDescription', e.target.value)}
                    className="cyber-input min-h-[80px]"
                  />
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-cyber-text-primary mb-2">
                    Target Audience *
                  </label>
                  <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                    <SelectTrigger className="cyber-input">
                      <SelectValue placeholder="Select your target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_AUDIENCES.map((audience) => (
                        <SelectItem key={audience} value={audience}>
                          {audience}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Call to Action */}
                <div>
                  <label className="block text-sm font-medium text-cyber-text-primary mb-2">
                    Call to Action
                  </label>
                  <CyberInput
                    placeholder="e.g., Visit our website, Download the app, Follow for more"
                    value={formData.callToAction}
                    onChange={(e) => handleInputChange('callToAction', e.target.value)}
                  />
                </div>

                {/* Duration & Style */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-cyber-text-primary mb-2">
                      Duration
                    </label>
                    <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                      <SelectTrigger className="cyber-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15-30 seconds">15-30 seconds</SelectItem>
                        <SelectItem value="30-60 seconds">30-60 seconds</SelectItem>
                        <SelectItem value="60-90 seconds">60-90 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyber-text-primary mb-2">
                      Creator Style
                    </label>
                    <Select value={formData.creatorStyle} onValueChange={(value) => handleInputChange('creatorStyle', value)}>
                      <SelectTrigger className="cyber-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CREATOR_STYLES.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-cyber-text-primary mb-2">
                    Additional Notes
                  </label>
                  <Textarea
                    placeholder="Any specific requirements, tone, or messaging you want to include"
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    className="cyber-input min-h-[80px]"
                  />
                </div>

                {/* Generate Button */}
                <CyberButton
                  size="lg"
                  className="w-full"
                  onClick={handleGenerateScript}
                  disabled={isGenerating || !formData.brandName.trim() || !formData.targetAudience}
                  glow
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating Script...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Custom Script
                    </>
                  )}
                </CyberButton>

                <p className="text-xs text-cyber-text-muted text-center">
                  AI will analyze this viral template and create a custom script for your brand
                </p>
              </CyberCardContent>
            </CyberCard>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};