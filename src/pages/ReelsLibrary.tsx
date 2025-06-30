import React, { useState, useEffect } from "react";
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { CyberBadge } from "@/components/ui/cyber-badge";
import { useAirtableVideos } from "@/hooks/useAirtableVideos";
import { TemplateModal } from "@/components/TemplateModal";
import { 
  Search, 
  Filter, 
  Play, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  TrendingUp,
  Zap,
  Target,
  Grid3X3,
  List
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

const ReelsLibrary = () => {
  const { videos: allVideos, loading, error } = useAirtableVideos();
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedHookType, setSelectedHookType] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    setFilteredVideos(allVideos);
  }, [allVideos]);

  useEffect(() => {
    let filtered = allVideos;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.caption.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Industry filter
    if (selectedIndustry !== "All") {
      filtered = filtered.filter(video => {
        const videoIndustry = Array.isArray(video.industry) ? video.industry[0] : video.industry;
        return videoIndustry === selectedIndustry;
      });
    }

    // Hook type filter
    if (selectedHookType !== "All") {
      filtered = filtered.filter(video => video.hookType === selectedHookType);
    }

    setFilteredVideos(filtered);
  }, [searchTerm, selectedIndustry, selectedHookType, allVideos]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getViralScoreColor = (score: number) => {
    if (score >= 8) return "success";
    if (score >= 6) return "warning";
    return "danger";
  };

  const industries = ["All", ...new Set(allVideos.map(v => Array.isArray(v.industry) ? v.industry[0] : v.industry))];
  const hookTypes = ["All", ...new Set(allVideos.map(v => v.hookType))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-bg-primary to-cyber-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-accent-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyber-text-primary text-xl">Loading viral templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-bg-primary to-cyber-bg-secondary flex items-center justify-center">
        <CyberCard className="p-8 text-center">
          <h2 className="text-2xl font-bold text-cyber-accent-pink mb-4">Error Loading Templates</h2>
          <p className="text-cyber-text-secondary">{error}</p>
        </CyberCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-bg-primary to-cyber-bg-secondary">
      {/* Header */}
      <div className="border-b border-cyber-accent-pink/20 bg-cyber-bg-secondary/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-cyber-text-primary mb-2">
                Viral Template
                <span className="text-cyber-accent-pink"> Library</span>
              </h1>
              <p className="text-cyber-text-secondary">
                {filteredVideos.length} proven viral templates • Generate unlimited scripts
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <CyberBadge variant="secondary" glow>
                <Zap className="w-3 h-3 mr-1" />
                AI Powered
              </CyberBadge>
              
              <div className="flex items-center gap-2">
                <CyberButton
                  variant={viewMode === "grid" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </CyberButton>
                <CyberButton
                  variant={viewMode === "list" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </CyberButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <CyberCard className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-text-muted w-5 h-5" />
                <CyberInput
                  placeholder="Search templates, creators, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  glow
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="cyber-input min-w-[150px]"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              
              <select
                value={selectedHookType}
                onChange={(e) => setSelectedHookType(e.target.value)}
                className="cyber-input min-w-[150px]"
              >
                {hookTypes.map(hookType => (
                  <option key={hookType} value={hookType}>{hookType}</option>
                ))}
              </select>
            </div>
          </div>
        </CyberCard>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <CyberCard variant="secondary" className="p-6 text-center">
            <div className="text-2xl font-bold text-cyber-accent-blue mb-2">
              {filteredVideos.length}
            </div>
            <div className="text-cyber-text-secondary">Templates</div>
          </CyberCard>
          
          <CyberCard variant="secondary" className="p-6 text-center">
            <div className="text-2xl font-bold text-cyber-accent-green mb-2">
              {formatNumber(filteredVideos.reduce((sum, v) => sum + v.views, 0))}
            </div>
            <div className="text-cyber-text-secondary">Total Views</div>
          </CyberCard>
          
          <CyberCard variant="secondary" className="p-6 text-center">
            <div className="text-2xl font-bold text-cyber-accent-pink mb-2">
              {(filteredVideos.reduce((sum, v) => sum + v.viralScore, 0) / filteredVideos.length || 0).toFixed(1)}
            </div>
            <div className="text-cyber-text-secondary">Avg Viral Score</div>
          </CyberCard>
          
          <CyberCard variant="secondary" className="p-6 text-center">
            <div className="text-2xl font-bold text-cyber-accent-purple mb-2">
              {new Set(filteredVideos.map(v => v.industry)).size}
            </div>
            <div className="text-cyber-text-secondary">Industries</div>
          </CyberCard>
        </div>

        {/* Video Grid */}
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
        }>
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {viewMode === "grid" ? (
                <CyberCard glow className="group cursor-pointer overflow-hidden">
                  <div className="relative aspect-[9/16] overflow-hidden">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-cyber-accent-pink/90 flex items-center justify-center backdrop-blur-sm">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    
                    {/* Viral Score Badge */}
                    <div className="absolute top-3 right-3">
                      <CyberBadge variant={getViralScoreColor(video.viralScore)} glow>
                        {video.viralScore}/10
                      </CyberBadge>
                    </div>
                    
                    {/* Hook Type Badge */}
                    <div className="absolute top-3 left-3">
                      <CyberBadge variant="secondary">
                        {video.hookType}
                      </CyberBadge>
                    </div>
                  </div>
                  
                  <CyberCardContent className="p-4">
                    <h3 className="font-semibold text-cyber-text-primary mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-sm text-cyber-text-secondary">@{video.author}</div>
                      <CyberBadge variant="outline" className="text-xs">
                        {Array.isArray(video.industry) ? video.industry[0] : video.industry}
                      </CyberBadge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center gap-1 text-xs text-cyber-text-secondary">
                        <Eye className="w-3 h-3" />
                        {formatNumber(video.views)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-cyber-text-secondary">
                        <Heart className="w-3 h-3" />
                        {formatNumber(video.likes)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-cyber-text-secondary">
                        <MessageCircle className="w-3 h-3" />
                        {formatNumber(video.comments)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-cyber-text-secondary">
                        <Share2 className="w-3 h-3" />
                        {formatNumber(video.shares)}
                      </div>
                    </div>
                    
                    <CyberButton 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Use Template
                    </CyberButton>
                  </CyberCardContent>
                </CyberCard>
              ) : (
                <CyberCard glow className="p-6 cursor-pointer group">
                  <div className="flex gap-6">
                    <div className="relative w-32 h-48 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <CyberBadge variant={getViralScoreColor(video.viralScore)} glow>
                          {video.viralScore}/10
                        </CyberBadge>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-cyber-text-primary mb-2">
                            {video.title}
                          </h3>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-cyber-text-secondary">@{video.author}</span>
                            <CyberBadge variant="secondary">{video.hookType}</CyberBadge>
                            <CyberBadge variant="outline">
                              {Array.isArray(video.industry) ? video.industry[0] : video.industry}
                            </CyberBadge>
                          </div>
                        </div>
                        
                        <CyberButton onClick={() => setSelectedVideo(video)}>
                          <Target className="w-4 h-4 mr-2" />
                          Use Template
                        </CyberButton>
                      </div>
                      
                      <p className="text-cyber-text-secondary mb-4 line-clamp-2">
                        {video.whyThisWorks}
                      </p>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-cyber-accent-blue">
                            {formatNumber(video.views)}
                          </div>
                          <div className="text-xs text-cyber-text-muted">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-cyber-accent-pink">
                            {formatNumber(video.likes)}
                          </div>
                          <div className="text-xs text-cyber-text-muted">Likes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-cyber-accent-green">
                            {formatNumber(video.comments)}
                          </div>
                          <div className="text-xs text-cyber-text-muted">Comments</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-cyber-accent-purple">
                            {formatNumber(video.shares)}
                          </div>
                          <div className="text-xs text-cyber-text-muted">Shares</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CyberCard>
              )}
            </motion.div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <CyberCard className="p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-cyber-text-primary mb-2">No Templates Found</h3>
              <p className="text-cyber-text-secondary">
                Try adjusting your search or filter criteria
              </p>
            </CyberCard>
          </div>
        )}
      </div>

      {/* Template Modal */}
      {selectedVideo && (
        <TemplateModal
          video={selectedVideo}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default ReelsLibrary;