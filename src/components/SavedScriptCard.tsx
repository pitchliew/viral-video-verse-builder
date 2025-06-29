
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Copy, Calendar, Eye } from "lucide-react";
import { SavedScript } from "@/hooks/useSavedScripts";
import { useToast } from "@/hooks/use-toast";

interface SavedScriptCardProps {
  script: SavedScript;
  onEdit: (script: SavedScript) => void;
  onDelete: (id: string) => void;
  onView: (script: SavedScript) => void;
}

export const SavedScriptCard = ({ script, onEdit, onDelete, onView }: SavedScriptCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(script.content);
      toast({
        title: "Copied!",
        description: "Script copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy script to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this script?")) {
      setIsDeleting(true);
      try {
        await onDelete(script.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getScriptPreview = () => {
    const sections = script.script_sections;
    if (sections?.hook) {
      return sections.hook.substring(0, 100) + "...";
    }
    return script.content.substring(0, 100) + "...";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {script.title}
          </CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onView(script)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(script)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={copyScript}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-gray-600 text-sm line-clamp-3">
          {getScriptPreview()}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {formatDate(script.created_at)}
          </div>
          
          {script.original_video_data?.hookType && (
            <Badge variant="secondary" className="text-xs">
              {script.original_video_data.hookType}
            </Badge>
          )}
        </div>

        {script.original_video_data?.title && (
          <div className="text-xs text-gray-500">
            Based on: {script.original_video_data.title}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
