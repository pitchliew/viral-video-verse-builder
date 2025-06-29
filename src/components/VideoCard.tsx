
import { Eye, Heart, MessageCircle, Share2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Video {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  author: string;
  caption: string;
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

interface VideoCardProps {
  video: Video;
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

// Helper function to safely render values
const safeRender = (value: any): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (value && typeof value === 'object' && value.value) return String(value.value);
  return String(value || '');
};

export const VideoCard = ({ video }: VideoCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-600 bg-green-100";
    if (score >= 7) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <div className="relative">
        <img 
          src={video.thumbnailUrl} 
          alt={safeRender(video.title)}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge className={`${getScoreColor(video.viralScore)} font-bold border-0`}>
            {video.viralScore}/10
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary" className="bg-black/70 text-white border-0">
            {safeRender(video.hookType)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{safeRender(video.author)}</span>
          <Badge variant="outline" className="ml-auto text-xs">
            {safeRender(video.industry)}
          </Badge>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {safeRender(video.title)}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {safeRender(video.caption)}
        </p>

        {/* Engagement Stats */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">{formatNumber(video.views)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">{formatNumber(video.likes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">{formatNumber(video.comments)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium">{formatNumber(video.shares)}</span>
          </div>
        </div>

        {/* Why This Works */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600 mb-1 font-medium">Why This Works:</p>
          <p className="text-xs text-gray-700 line-clamp-2">{safeRender(video.whyThisWorks)}</p>
        </div>
      </CardContent>
    </Card>
  );
};
