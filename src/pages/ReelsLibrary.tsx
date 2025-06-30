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
  List,
  Sparkles,
  Brain,
  Rocket,
  Star,
  ArrowRight,
  ChevronDown,
  Layers,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [sortBy, setSortBy] = useState("viral-score");
  const [showFilters, setShowFilters] = useState(false);

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

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "viral-score":
          return b.viralScore - a.viralScore;
        case "views":
          return b.views - a.views;
        case "engagement":
          const aEngagement = (a.likes + a.comments + a.shares) / a.views;
          const bEngagement = (b.likes + b.comments + b.shares) / b.views;
          return bEngagement - aEngagement;
        default:
          return 0;
      }
    });

    setFilteredVideos(filtered);
  }, [searchTerm, selectedIndustry, selectedHookType, allVideos, sortBy]);

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
      <div className="min-h-screen bg-gradient-to-br from-cyber-bg-primary via-cyber-bg-secondary to-cyber-bg-primary flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-cyber-accent-pink/30 border-t-cyber-accent-pink rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-cyber-accent-blue/30 border-b-cyber-accent-blue rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-cyber-text-primary text-xl font-semibold"
          >
            Loading Viral Templates...
          </motion.p>
          <p className="text-cyber-text-muted mt-2">Analyzing viral patterns with AI</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-bg-primary to-cyber-bg-secondary flex items-center justify-center">
        <CyberCard className="p-8 text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-cyber-accent-pink mb-4">Connection Error</h2>
          <p className="text-cyber-text-secondary mb-6">{error}</p>
          <CyberButton onClick={() => window.location.reload()}>
            <Rocket className="w-4 h-4 mr-2" />
            Retry Connection
          </CyberButton>
        </CyberCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-bg-primary via-cyber-bg-secondary to-cyber-bg-primary">
      {/* Futuristic Header */}
      <div className="relative border-b border-cyber-accent-pink/20 bg-gradient-to-r from-cyber-bg-secondary/80 to-cyber-bg-tertiary/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-accent-pink/5 to-cyber-accent-blue/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyber-accent-pink to-cyber-accent-purple flex items-center justify-center shadow-[0_0_30px_rgba(255,0,128,0.5)]">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-cyber-accent-green rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-cyber-text-primary mb-2">
                  Viral Template
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent-pink to-cyber-accent-blue"> Nexus</span>
                </h1>
                <div className="flex items-center gap-4 text-cyber-text-secondary">
                  <span className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-cyber-accent-green" />
                    {filteredVideos.length} AI-Analyzed Templates
                  </span>
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyber-accent-blue" />
                    Infinite Script Generation
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CyberBadge variant="secondary" glow className="px-4 py-2">
                  <Rocket className="w-3 h-3 mr-2" />
                  AI Powered Engine
                </CyberBadge>
              </motion.div>
              
              <div className="flex items-center gap-2 bg-cyber-bg-secondary/50 rounded-lg p-1 border border-cyber-accent-pink/20">
                <CyberButton
                  variant={viewMode === "grid" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </CyberButton>
                <CyberButton
                  variant={viewMode === "list" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </CyberButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Advanced Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CyberCard className="p-6 mb-8 bg-gradient-to-r from-cyber-bg-secondary/60 to-cyber-bg-tertiary/60 border-cyber-accent-blue/30">
            <div className="space-y-4">
              {/* Main Search */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyber-accent-blue">
                  <Search className="w-5 h-5" />
                </div>
                <CyberInput
                  placeholder="Search viral templates, creators, hooks, or industries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg bg-cyber-bg-primary/50 border-cyber-accent-blue/50"
                  glow
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <CyberButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </CyberButton>
                </div>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-cyber-accent-pink/20"
                  >
                    <div>
                      <label className="block text-sm font-medium text-cyber-text-primary mb-2">Industry</label>
                      <select
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="cyber-input w-full"
                      >
                        {industries.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-cyber-text-primary mb-2">Hook Type</label>
                      <select
                        value={selectedHookType}
                        onChange={(e) => setSelectedHookType(e.target.value)}
                        className="cyber-input w-full"
                      >
                        {hookTypes.map(hookType => (
                          <option key={hookType} value={hookType}>{hookType}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-cyber-text-primary mb-2">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="cyber-input w-full"
                      >
                        <option value="viral-score">Viral Score</option>
                        <option value="views">View Count</option>
                        <option value="engagement">Engagement Rate</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <CyberButton
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedIndustry("All");
                          setSelectedHookType("All");
                          setSortBy("viral-score");
                        }}
                        className="w-full"
                      >
                        Reset Filters
                      </CyberButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CyberCard>
        </motion.div>

        {/* Dynamic Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <CyberCard variant="secondary" className="p-6 text-center group hover:scale-105 transition-transform">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyber-accent-blue to-cyber-accent-green flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-cyber-accent-blue mb-2">
              {filteredVideos.length}
            </div>
            <div className="text-cyber-text-secondary">Active Templates</div>
            <div className="w-full bg-cyber-bg-primary/50 rounded-full h-2 mt-3">
              <div 
                className="bg-gradient-to-r from-cyber-accent-blue to-cyber-accent-green h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((filteredVideos.length / allVideos.length) * 100, 100)}%` }}
              ></div>
            </div>
          </CyberCard>
          
          <CyberCard variant="secondary" className="p-6 text-center group hover:scale-105 transition-transform">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyber-accent-green to-cyber-accent-blue flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-cyber-accent-green mb-2">
              {formatNumber(filteredVideos.reduce((sum, v) => sum + v.views, 0))}
            </div>
            <div className="text-cyber-text-secondary">Total Views</div>
            <div className="flex items-center justify-center mt-2 text-cyber-accent-green text-sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              +24% this month
            </div>
          </CyberCard>
          
          <CyberCard variant="secondary" className="p-6 text-center group hover:scale-105 transition-transform">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyber-accent-pink to-cyber-accent-purple flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-cyber-accent-pink mb-2">
              {(filteredVideos.reduce((sum, v) => sum + v.viralScore, 0) / filteredVideos.length || 0).toFixed(1)}
            </div>
            <div className="text-cyber-text-secondary">Avg Viral Score</div>
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-cyber-accent-pink fill-current" />
              ))}
            </div>
          </CyberCard>
          
          <CyberCard variant="secondary" className="p-6 text-center group hover:scale-105 transition-transform">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyber-accent-purple to-cyber-accent-pink flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-cyber-accent-purple mb-2">
              {new Set(filteredVideos.map(v => v.industry)).size}
            </div>
            <div className="text-cyber-text-secondary">Industries</div>
            <div className="text-xs text-cyber-text-muted mt-2">
              Across all verticals
            </div>
          </CyberCard>
        </motion.div>

        {/* Enhanced Video Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            <AnimatePresence>
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  {viewMode === "grid" ? (
                    <CyberCard glow className="group cursor-pointer overflow-hidden bg-gradient-to-br from-cyber-bg-secondary/80 to-cyber-bg-tertiary/80 border-cyber-accent-pink/30 hover:border-cyber-accent-blue/60 transition-all duration-300">
                      <div className="relative aspect-[9/16] overflow-hidden">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        
                        {/* Animated Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-20 h-20 rounded-full bg-gradient-to-r from-cyber-accent-pink to-cyber-accent-purple flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(255,0,128,0.8)]"
                          >
                            <Play className="w-10 h-10 text-white ml-1" />
                          </motion.div>
                        </div>
                        
                        {/* Floating Badges */}
                        <div className="absolute top-3 right-3">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <CyberBadge variant={getViralScoreColor(video.viralScore)} glow className="shadow-lg">
                              <Star className="w-3 h-3 mr-1" />
                              {video.viralScore}/10
                            </CyberBadge>
                          </motion.div>
                        </div>
                        
                        <div className="absolute top-3 left-3">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                          >
                            <CyberBadge variant="secondary" className="backdrop-blur-sm">
                              <Zap className="w-3 h-3 mr-1" />
                              {video.hookType}
                            </CyberBadge>
                          </motion.div>
                        </div>

                        {/* Bottom Info Bar */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                          <div className="flex items-center justify-between text-white text-sm">
                            <div className="flex items-center gap-2">
                              <Eye className="w-3 h-3" />
                              {formatNumber(video.views)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Heart className="w-3 h-3 text-cyber-accent-pink" />
                              {formatNumber(video.likes)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <CyberCardContent className="p-4 space-y-3">
                        <h3 className="font-semibold text-cyber-text-primary line-clamp-2 group-hover:text-cyber-accent-pink transition-colors">
                          {video.title}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-cyber-text-secondary">@{video.author}</div>
                          <CyberBadge variant="outline" className="text-xs">
                            {Array.isArray(video.industry) ? video.industry[0] : video.industry}
                          </CyberBadge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs text-cyber-text-muted">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {formatNumber(video.comments)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="w-3 h-3" />
                            {formatNumber(video.shares)}
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {((video.likes + video.comments + video.shares) / video.views * 100).toFixed(1)}%
                          </div>
                        </div>
                        
                        <CyberButton 
                          size="sm" 
                          className="w-full group-hover:scale-105 transition-transform"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Generate Script
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </CyberButton>
                      </CyberCardContent>
                    </CyberCard>
                  ) : (
                    <CyberCard glow className="p-6 cursor-pointer group bg-gradient-to-r from-cyber-bg-secondary/60 to-cyber-bg-tertiary/60 border-cyber-accent-blue/30 hover:border-cyber-accent-pink/60 transition-all duration-300">
                      <div className="flex gap-6">
                        <div className="relative w-40 h-56 flex-shrink-0 overflow-hidden rounded-lg">
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            <CyberBadge variant={getViralScoreColor(video.viralScore)} glow>
                              <Star className="w-3 h-3 mr-1" />
                              {video.viralScore}/10
                            </CyberBadge>
                          </div>
                          <div className="absolute bottom-2 left-2">
                            <CyberBadge variant="secondary" className="backdrop-blur-sm">
                              {video.hookType}
                            </CyberBadge>
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-cyber-text-primary mb-2 group-hover:text-cyber-accent-pink transition-colors">
                                {video.title}
                              </h3>
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-cyber-text-secondary">@{video.author}</span>
                                <CyberBadge variant="outline">
                                  {Array.isArray(video.industry) ? video.industry[0] : video.industry}
                                </CyberBadge>
                              </div>
                            </div>
                            
                            <CyberButton 
                              onClick={() => setSelectedVideo(video)}
                              className="group-hover:scale-105 transition-transform"
                            >
                              <Target className="w-4 h-4 mr-2" />
                              Use Template
                            </CyberButton>
                          </div>
                          
                          <p className="text-cyber-text-secondary line-clamp-2 leading-relaxed">
                            {video.whyThisWorks}
                          </p>
                          
                          <div className="grid grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-cyber-bg-primary/30 rounded-lg">
                              <div className="text-lg font-bold text-cyber-accent-blue">
                                {formatNumber(video.views)}
                              </div>
                              <div className="text-xs text-cyber-text-muted">Views</div>
                            </div>
                            <div className="text-center p-3 bg-cyber-bg-primary/30 rounded-lg">
                              <div className="text-lg font-bold text-cyber-accent-pink">
                                {formatNumber(video.likes)}
                              </div>
                              <div className="text-xs text-cyber-text-muted">Likes</div>
                            </div>
                            <div className="text-center p-3 bg-cyber-bg-primary/30 rounded-lg">
                              <div className="text-lg font-bold text-cyber-accent-green">
                                {formatNumber(video.comments)}
                              </div>
                              <div className="text-xs text-cyber-text-muted">Comments</div>
                            </div>
                            <div className="text-center p-3 bg-cyber-bg-primary/30 rounded-lg">
                              <div className="text-lg font-bold text-cyber-accent-purple">
                                {((video.likes + video.comments + video.shares) / video.views * 100).toFixed(1)}%
                              </div>
                              <div className="text-xs text-cyber-text-muted">Engagement</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CyberCard>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Enhanced Empty State */}
        {filteredVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <CyberCard className="p-16 max-w-lg mx-auto bg-gradient-to-br from-cyber-bg-secondary/80 to-cyber-bg-tertiary/80">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="text-8xl mb-6"
              >
                🔍
              </motion.div>
              <h3 className="text-2xl font-bold text-cyber-text-primary mb-4">
                No Templates Found
              </h3>
              <p className="text-cyber-text-secondary mb-6 leading-relaxed">
                Your search didn't match any viral templates. Try adjusting your filters or search terms to discover more content.
              </p>
              <CyberButton
                onClick={() => {
                  setSearchTerm("");
                  setSelectedIndustry("All");
                  setSelectedHookType("All");
                }}
                className="group"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Reset & Explore All
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </CyberButton>
            </CyberCard>
          </motion.div>
        )}
      </div>

      {/* Enhanced Template Modal */}
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