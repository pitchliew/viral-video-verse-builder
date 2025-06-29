
import { useState } from "react";
import { X, Play, Link, Download, Star, TrendingUp, Users, Eye } from "lucide-react";
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

interface VideoAnalysisModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
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

export const VideoAnalysisModal = ({ video, isOpen, onClose }: VideoAnalysisModalProps) => {
  const [activeTab, setActiveTab] = useState("insights");

  if (!video) return null;

  const engagementRate = ((video.likes + video.comments + video.shares) / video.views * 100).toFixed(1);

  return (
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

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Link className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="script">Script</TabsTrigger>
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
                <h4 className="font-semibold mb-3">Original Caption</h4>
                <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {safeRender(video.caption)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Generate Custom Script</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Young professionals, fitness enthusiasts"
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Brand/Product</label>
                    <input 
                      type="text" 
                      placeholder="Your brand or product name"
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration</label>
                      <select className="w-full p-2 border rounded-lg">
                        <option>15-30 seconds</option>
                        <option>30-60 seconds</option>
                        <option>60-90 seconds</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Voice Tone</label>
                      <select className="w-full p-2 border rounded-lg">
                        <option>Casual</option>
                        <option>Professional</option>
                        <option>Energetic</option>
                        <option>Inspirational</option>
                      </select>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Generate Custom Script
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
