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
            <div className="w-24 h-24 border-4 border-cyber-accent-pink/30 border-t-cyber-accent-pink rounded-full animate-spin mx-auto mb-8 shadow-[0_0_30px_rgba(255,0,128,0.5)]"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-cyber-accent-blue/30 border-b-cyber-accent-blue rounded-full animate-spin mx-auto shadow-[0_0_30px_rgba(0,212,255,0.5)]" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h2 className="cyber-heading-2 mb-4">Loading Viral Templates...</h2>
            <p className="cyber-body-text text-cyber-text-muted">Analyzing viral patterns with AI</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-bg-primary to-cyber-bg-secondary flex items-center justify-center">
        <CyberCard className="p-8 text-center max-w-md cyber-glow-animate">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="cyber-heading-2 text-cyber-accent-pink mb-4">Connection Error</h2>
          <p className="cyber-body-text mb-6">{error}</p>
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
      {/* Enhanced Futuristic Header */}
      <div className="relative border-b border-cyber-accent-pink/30 bg-gradient-to-r from-cyber-bg-secondary/90 to-cyber-bg-tertiary/90 backdrop-blur-xl sticky top-0 z-40 shadow-[0_0_30px_rgba(255,0,128,0.2)]">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-accent-pink/10 to-cyber-accent-blue/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="relative cyber-float">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-accent-pink to-cyber-accent-purple flex items-center justify-center shadow-[0_0_40px_rgba(255,0,128,0.6)] border-2 border-white/20">
                  <Layers className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyber-accent-green rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.6)]">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div>
                <h1 className="cyber-heading-1 mb-3">
                  Viral Template
                  <span className="cyber-gradient-text"> Nexus</span>
                </h1>
                <div className="flex items-center gap-6 cyber-body-text">
                  <span className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-cyber-accent-green" />
                    <span className="font-semibold text-cyber-text-primary">{filteredVideos.length}</span>
                    <span className="text-cyber-text-secondary">AI-Analyzed Templates</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyber-accent-blue" />
                    <span className="font-semibold text-cyber-text-primary">Infinite</span>
                    <span className="text-cyber-text-secondary">Script Generation</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CyberBadge variant="secondary" glow className="px-6 py-3 text-sm">
                  <Rocket className="w-4 h-4 mr-2" />
                  AI Powered Engine
                </CyberBadge>
              </motion.div>
              
              <div className="flex items-center gap-2 bg-cyber-bg-secondary/60 rounded-xl p-2 border border-cyber-accent-pink/30 backdrop-blur-sm">
                <CyberButton
                  variant={viewMode === "grid" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-4"
                >
                  <Grid3X3 className="w-4 h-4" />
                </CyberButton>
                <CyberButton
                  variant={viewMode === "list" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-4"
                >
                  <List className="w-4 h-4" />
                </CyberButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CyberCard className="p-8 mb-8 bg-gradient-to-r from-cyber-bg-secondary/70 to-cyber-bg-tertiary/70 border-cyber-accent-blue/40 cyber-glow-animate">
            <div className="space-y-6">
              {/* Enhanced Main Search */}
              <div className="relative">
                <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-cyber-accent-blue">
                  <Search className="w-6 h-6" />
                </div>
                <CyberInput
                  placeholder="Search viral templates, creators, hooks, or industries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-16 h-16 text-lg bg-cyber-bg-primary/60 border-cyber-accent-blue/60 cyber-text-enhanced"
                  glow
                />
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                  <CyberButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-3 px-4 py-2"
                  >
                    <Filter className="w-5 h-5" />
                    <span className="font-semibold">Advanced Filters</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                  </CyberButton>
                </div>
              </div>

              {/* Enhanced Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-cyber-accent-pink/30"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-cyber-text-primary mb-3">Industry Focus</label>
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
                      <label className="block text-sm font-semibold text-cyber-text-primary mb-3">Hook Strategy</label>
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
                      <label className="block text-sm font-semibold text-cyber-text-primary mb-3">Sort Priority</label>
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
                        className="w-full h-12"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Reset All Filters
                      </CyberButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CyberCard>
        </motion.div>

        {/* Enhanced Dynamic Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10"
        >
          <CyberCard variant="secondary" className="cyber-stats-card text-center group">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyber-accent-blue to-cyber-accent-green flex items-center justify-center shadow-[0_0_25px_rgba(0,212,255,0.5)]">
                <Layers className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="cyber-stats-value mb-3">
              {filteredVideos.length}
            </div>
            <div className="cyber-body-text text-cyber-text-secondary mb-4">Active Templates</div>
            <div className="w-full bg-cyber-bg-primary/60 rounded-full h-3 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-cyber-accent-blue to-cyber-accent-green h-3 rounded-full shadow-[0_0_15px_rgba(0,212,255,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((filteredVideos.length / allVideos.length) * 100, 100)}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
          </CyberCard>
          
          <CyberCard variant="secondary" className="cyber-stats-card text-center group">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyber-accent-green to-cyber-accent-blue flex items-center justify-center shadow-[0_0_25px_rgba(0,255,136,0.5)]">
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="cyber-stats-value mb-3">
              {formatNumber(filteredVideos.reduce((sum, v) => sum + v.views, 0))}
            </div>
            <div className="cyber-body-text text-cyber-text-secondary mb-4">Total Views</div>
            <div className="flex items-center justify-center text-cyber-accent-green text-sm font-semibold">
              <TrendingUp className="w-4 h-4 mr-2" />
              +24% this month
            </div>
          </CyberCard>
          
          <CyberCard variant="secondary" className="cyber-stats-card text-center group">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyber-accent-pink to-cyber-accent-purple flex items-center justify-center shadow-[0_0_25px_rgba(255,0,128,0.5)]">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="cyber-stats-value mb-3">
              {(filteredVideos.reduce((sum, v) => sum + v.viralScore, 0) / filteredVideos.length || 0).toFixed(1)}
            </div>
            <div className="cyber-body-text text-cyber-text-secondary mb-4">Avg Viral Score</div>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-cyber-accent-pink fill-current" />
              ))}
            </div>
          </CyberCard>
          
          <CyberCard variant="secondary" className="cyber-stats-card text-center group">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyber-accent-purple to-cyber-accent-pink flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.5)]">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="cyber-stats-value mb-3">
              {new Set(filteredVideos.map(v => v.industry)).size}
            </div>
            <div className="cyber-body-text text-cyber-text-secondary mb-4">Industries</div>
            <div className="cyber-small-text text-cyber-text-muted">
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
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
            : "space-y-6"
          }>
            <AnimatePresence>
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.9 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -8 }}
                >
                  {viewMode === "grid" ? (
                    <CyberCard glow className="group cursor-pointer overflow-hidden bg-gradient-to-br from-cyber-bg-secondary/90 to-cyber-bg-tertiary/90 border-cyber-accent-pink/40 hover:border-cyber-accent-blue/80 transition-all duration-500 cyber-interactive">
                      <div className="relative aspect-[9/16] overflow-hidden">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        
                        {/* Enhanced Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                        
                        {/* Enhanced Animated Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <motion.div
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-24 h-24 rounded-full bg-gradient-to-r from-cyber-accent-pink to-cyber-accent-purple flex items-center justify-center backdrop-blur-sm shadow-[0_0_40px_rgba(255,0,128,0.8)] border-2 border-white/30"
                          >
                            <Play className="w-12 h-12 text-white ml-1" />
                          </motion.div>
                        </div>
                        
                        {/* Enhanced Floating Badges */}
                        <div className="absolute top-4 right-4">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <CyberBadge variant={getViralScoreColor(video.viralScore)} glow className="shadow-lg backdrop-blur-sm">
                              <Star className="w-3 h-3 mr-1" />
                              {video.viralScore}/10
                            </CyberBadge>
                          </motion.div>
                        </div>
                        
                        <div className="absolute top-4 left-4">
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

                        {/* Enhanced Bottom Info Bar */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 to-transparent">
                          <div className="flex items-center justify-between text-white text-sm font-semibold">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              <span className="cyber-text-enhanced">{formatNumber(video.views)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-cyber-accent-pink" />
                              <span className="cyber-text-enhanced">{formatNumber(video.likes)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <CyberCardContent className="p-6 space-y-4">
                        <h3 className="cyber-heading-3 line-clamp-2 group-hover:text-cyber-accent-pink transition-colors duration-300">
                          {video.title}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="cyber-body-text text-cyber-text-secondary">@{video.author}</div>
                          <CyberBadge variant="outline" className="text-xs">
                            {Array.isArray(video.industry) ? video.industry[0] : video.industry}
                          </CyberBadge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 cyber-small-text">
                          <div className="flex items-center gap-2 p-2 bg-cyber-bg-primary/30 rounded-lg">
                            <MessageCircle className="w-3 h-3" />
                            <span className="font-semibold">{formatNumber(video.comments)}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-cyber-bg-primary/30 rounded-lg">
                            <Share2 className="w-3 h-3" />
                            <span className="font-semibold">{formatNumber(video.shares)}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-cyber-bg-primary/30 rounded-lg">
                            <TrendingUp className="w-3 h-3" />
                            <span className="font-semibold">{((video.likes + video.comments + video.shares) / video.views * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        
                        <CyberButton 
                          size="sm" 
                          className="w-full group-hover:scale-105 transition-transform duration-300"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Generate Script
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </CyberButton>
                      </CyberCardContent>
                    </CyberCard>
                  ) : (
                    <CyberCard glow className="p-8 cursor-pointer group bg-gradient-to-r from-cyber-bg-secondary/70 to-cyber-bg-tertiary/70 border-cyber-accent-blue/40 hover:border-cyber-accent-pink/80 transition-all duration-500 cyber-interactive">
                      <div className="flex gap-8">
                        <div className="relative w-48 h-64 flex-shrink-0 overflow-hidden rounded-xl">
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3">
                            <CyberBadge variant={getViralScoreColor(video.viralScore)} glow>
                              <Star className="w-3 h-3 mr-1" />
                              {video.viralScore}/10
                            </CyberBadge>
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <CyberBadge variant="secondary" className="backdrop-blur-sm">
                              {video.hookType}
                            </CyberBadge>
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="cyber-heading-2 mb-3 group-hover:text-cyber-accent-pink transition-colors duration-300">
                                {video.title}
                              </h3>
                              <div className="flex items-center gap-4 mb-4">
                                <span className="cyber-body-text text-cyber-text-secondary">@{video.author}</span>
                                <CyberBadge variant="outline">
                                  {Array.isArray(video.industry) ? video.industry[0] : video.industry}
                                </CyberBadge>
                              </div>
                            </div>
                            
                            <CyberButton 
                              onClick={() => setSelectedVideo(video)}
                              className="group-hover:scale-105 transition-transform duration-300"
                            >
                              <Target className="w-4 h-4 mr-2" />
                              Use Template
                            </CyberButton>
                          </div>
                          
                          <p className="cyber-body-text text-cyber-text-secondary line-clamp-2 leading-relaxed">
                            {video.whyThisWorks}
                          </p>
                          
                          <div className="grid grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-cyber-bg-primary/40 rounded-xl border border-cyber-accent-blue/20">
                              <div className="cyber-stats-value text-cyber-accent-blue text-xl">
                                {formatNumber(video.views)}
                              </div>
                              <div className="cyber-small-text text-cyber-text-muted">Views</div>
                            </div>
                            <div className="text-center p-4 bg-cyber-bg-primary/40 rounded-xl border border-cyber-accent-pink/20">
                              <div className="cyber-stats-value text-cyber-accent-pink text-xl">
                                {formatNumber(video.likes)}
                              </div>
                              <div className="cyber-small-text text-cyber-text-muted">Likes</div>
                            </div>
                            <div className="text-center p-4 bg-cyber-bg-primary/40 rounded-xl border border-cyber-accent-green/20">
                              <div className="cyber-stats-value text-cyber-accent-green text-xl">
                                {formatNumber(video.comments)}
                              </div>
                              <div className="cyber-small-text text-cyber-text-muted">Comments</div>
                            </div>
                            <div className="text-center p-4 bg-cyber-bg-primary/40 rounded-xl border border-cyber-accent-purple/20">
                              <div className="cyber-stats-value text-cyber-accent-purple text-xl">
                                {((video.likes + video.comments + video.shares) / video.views * 100).toFixed(1)}%
                              </div>
                              <div className="cyber-small-text text-cyber-text-muted">Engagement</div>
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
            className="text-center py-24"
          >
            <CyberCard className="p-20 max-w-2xl mx-auto bg-gradient-to-br from-cyber-bg-secondary/90 to-cyber-bg-tertiary/90 cyber-glow-animate">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="text-9xl mb-8"
              >
                🔍
              </motion.div>
              <h3 className="cyber-heading-2 mb-6">
                No Templates Found
              </h3>
              <p className="cyber-body-text mb-8 leading-relaxed max-w-md mx-auto">
                Your search didn't match any viral templates. Try adjusting your filters or search terms to discover more content.
              </p>
              <CyberButton
                onClick={() => {
                  setSearchTerm("");
                  setSelectedIndustry("All");
                  setSelectedHookType("All");
                }}
                className="group"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Reset & Explore All
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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