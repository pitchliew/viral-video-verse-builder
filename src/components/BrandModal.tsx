
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brand } from "@/hooks/useBrands";

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Brand, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  brand?: Brand | null;
  isLoading?: boolean;
}

const BRAND_CATEGORIES = [
  "Motivational",
  "Professional", 
  "Trendy",
  "Educational",
  "Entertainment",
  "Health & Fitness",
  "Technology",
  "Fashion",
  "Food & Beverage",
  "Travel",
  "Other"
];

const SAMPLE_AUDIENCES = [
  "Busy professionals aged 25-40",
  "Young entrepreneurs and startup founders",
  "Fashion-conscious women aged 18-35", 
  "Fitness enthusiasts and health-conscious individuals",
  "Small business owners and freelancers",
  "Tech-savvy millennials",
  "Parents and family-oriented consumers",
  "Students and young adults",
  "Creative professionals and artists"
];

export const BrandModal = ({ isOpen, onClose, onSave, brand, isLoading }: BrandModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    target_audience: "",
    call_to_action: "",
    description: ""
  });

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || "",
        category: brand.category || "",
        target_audience: brand.target_audience || "",
        call_to_action: brand.call_to_action || "",
        description: brand.description || ""
      });
    } else {
      setFormData({
        name: "",
        category: "",
        target_audience: "",
        call_to_action: "",
        description: ""
      });
    }
  }, [brand, isOpen]);

  const handleSave = () => {
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      category: "",
      target_audience: "",
      call_to_action: "",
      description: ""
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{brand ? "Edit Brand" : "Create New Brand"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Brand Name *</label>
            <Input
              type="text"
              placeholder="Enter brand name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                {BRAND_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Audience</label>
            <Select 
              value={formData.target_audience} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, target_audience: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                {SAMPLE_AUDIENCES.map((audience) => (
                  <SelectItem key={audience} value={audience}>
                    {audience}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Call to Action</label>
            <Input
              type="text"
              placeholder="e.g., Visit our website, Download the app"
              value={formData.call_to_action}
              onChange={(e) => setFormData(prev => ({ ...prev, call_to_action: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              placeholder="Describe your brand voice, values, or additional notes"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={isLoading}
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.name.trim() || isLoading}
            className="flex-1"
          >
            {isLoading ? "Saving..." : brand ? "Update Brand" : "Create Brand"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
