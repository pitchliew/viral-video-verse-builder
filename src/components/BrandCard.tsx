
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Users, Target } from "lucide-react";
import { Brand } from "@/hooks/useBrands";

interface BrandCardProps {
  brand: Brand;
  onEdit: (brand: Brand) => void;
  onDelete: (id: string) => void;
}

export const BrandCard = ({ brand, onEdit, onDelete }: BrandCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">{brand.name}</h3>
            {brand.category && (
              <Badge variant="secondary" className="mb-2">
                {brand.category}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(brand)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(brand.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {brand.target_audience && (
          <div className="flex items-start gap-2 mb-3">
            <Users className="w-4 h-4 text-blue-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-700">Target Audience</div>
              <div className="text-sm text-gray-600">{brand.target_audience}</div>
            </div>
          </div>
        )}

        {brand.call_to_action && (
          <div className="flex items-start gap-2 mb-3">
            <Target className="w-4 h-4 text-green-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-700">Call to Action</div>
              <div className="text-sm text-gray-600">{brand.call_to_action}</div>
            </div>
          </div>
        )}

        {brand.description && (
          <div className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-lg">
            {brand.description}
          </div>
        )}

        <div className="text-xs text-gray-400 mt-4">
          Created {new Date(brand.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};
