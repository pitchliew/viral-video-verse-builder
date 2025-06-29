
import { useState } from "react";
import { Eye, Heart, MessageCircle, Share2, User, Play, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VideoAnalysisModal } from "./VideoAnalysisModal";

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

const safeRender = (value: any): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (value && typeof value === 'object' && value.value) return String(value.value);
  return String(value || '');
};

export const VideoCard = ({ video }: VideoCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-600 bg-green-100";
    if (score >= 7) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const engagementRate = ((video.likes + video.comments + video.shares) / video.views * 100).toFixed(1);

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg">
        {/* Enhanced Thumbnail Section */}
        <div className="relative aspect-[9/16] overflow-hidden">
          <img 
            src={video.thumbnailUrl} 
            alt={safeRender(video.title)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-purple-600 ml-1" />
            </div>
          </div>

          {/* Viral Score Badge */}
          <div className="absolute top-3 right-3">
            <Badge className={`${getScoreColor(video.viralScore)} font-bold border-0 shadow-lg`}>
              {video.viralScore}/10
            </Badge>
          </div>

          {/* Hook Type Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-black/70 text-white border-0 backdrop-blur-sm">
              {safeRender(video.hookType)}
            </Badge>
          </div>

          {/* Engagement Rate Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-purple-600 text-white border-0 shadow-lg">
              <TrendingUp className="w-3 h-3 mr-1" />
              {engagementRate}%
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Author Info */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 truncate flex-1">
              @{safeRender(video.author)}
            </span>
            <Badge variant="outline" className="text-xs shrink-0">
              {safeRender(video.industry)}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight text-sm">
            {safeRender(video.title)}
          </h3>

          {/* Enhanced Engagement Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1 bg-blue-50 rounded-lg p-2">
              <Eye className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-semibold text-blue-700">{formatNumber(video.views)}</span>
            </div>
            <div className="flex items-center gap-1 bg-red-50 rounded-lg p-2">
              <Heart className="w-3 h-3 text-red-500" />
              <span className="text-xs font-semibold text-red-700">{formatNumber(video.likes)}</span>
            </div>
            <div className="flex items-center gap-1 bg-green-50 rounded-lg p-2">
              <MessageCircle className="w-3 h-3 text-green-500" />
              <span className="text-xs font-semibold text-green-700">{formatNumber(video.comments)}</span>
            </div>
            <div className="flex items-center gap-1 bg-purple-50 rounded-lg p-2">
              <Share2 className="w-3 h-3 text-purple-500" />
              <span className="text-xs font-semibold text-purple-700">{formatNumber(video.shares)}</span>
            </div>
          </div>

          {/* Why This Works Preview */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1 font-medium">Why This Works:</p>
            <p className="text-xs text-gray-700 line-clamp-2">{safeRender(video.whyThisWorks)}</p>
          </div>

          {/* Enhanced CTA Button */}
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Analyze & Create
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Modal */}
      <VideoAnalysisModal 
        video={video}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
