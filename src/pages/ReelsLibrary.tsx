import React, { useState, useEffect } from "react";
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { CyberBadge } from "@/components/ui/cyber-badge";
import { CyberStatsCard } from "@/components/ui/cyber-stats-card";
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
  BarChart3,
  Users,
  Activity
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
      <div className="min-h-screen cyber-bg flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-cyber-accent-pink/30 border-t-cyber-accent-pink rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-cyber-accent-blue/30 border-b-cyber-accent-blue rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-cyber-accent-green/20 border-l-cyber-accent-green rounded-full animate-spin mx-auto" style={{ animationDuration: '2s' }}></div>
          </div>
          <motion.h2 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="cyber-glow-text text-2xl font-bold mb-4"
          >
            Loading Viral Templates...
          </motion.h2>
          <p className="cyber-text-secondary text-lg">Analyzing viral patterns with AI</p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-cyber-accent-pink rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-cyber-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-cyber-accent-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen cyber-bg flex items-center justify-center">
        <CyberCard className="p-12 text-center max-w-lg cyber-glow-animate">
          <div className="text-8xl mb-6">⚠️</div>
          <h2 className="cyber-glow-text text-3xl font-bold mb-6">Connection Error</h2>
          <p className="cyber-text-secondary text-lg mb-8 leading-relaxed">{error}</p>
          <CyberButton onClick={() => window.location.reload()} className="cyber-float">
            <Rocket className="w-5 h-5 mr-3" />
            Retry Connection
          </CyberButton>
        </CyberCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-bg">
      {/* Enhanced Futuristic Header */}
      <div className="relative border-b-2 border-cyber-accent-pink/30 bg-gradient-to-r from-cyber-bg-secondary/90 to-cyber-bg-tertiary/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-accent-pink/5 via-cyber-accent-blue/5 to-cyber-accent-green/5"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyber-accent-pink via-cyber-accent-blue to-cyber-accent-green"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
          >
            <div className="flex items-center gap-8">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-accent-pink via-cyber-accent-purple to-cyber-accent-blue flex items-center justify-center shadow-[0_0_40px_rgba(255,0,128,0.6)] cyber-float">
                  <Layers className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyber-accent-green rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.6)]">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </motion.div>
              
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-black cyber-text-primary mb-3"
                >
                  Viral Template
                  <span className="cyber-glow-text-blue"> Nexus</span>
                </motion.h1>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-6 cyber-text-secondary text-lg"
                >
                  <span className="flex items-center gap-3">
                    <Brain className="w-5 h-5 cyber-glow-text-green" />
                    <span className="font-bold cyber-text-primary">{filteredVideos.length}</span> AI-Analyzed Templates
                  </span>
                  <span className="flex items-center gap-3">
                    <Zap className="w-5 h-5 cyber-glow-text-blue" />
                    Infinite Script Generation
                  </span>
                </motion.div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CyberBadge variant="secondary" glow className="px-6 py-3 text-sm">
                  <Rocket className="w-4 h-4 mr-2" />
                  AI Powered Engine
                </CyberBadge>
              </motion.div>
              
              <div className="flex items-center gap-2 bg-cyber-bg-secondary/60 rounded-xl p-2 border-2 border-cyber-accent-pink/20">
                <CyberButton
                  variant={viewMode === "grid" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-4"
                >
                  <Grid3X3 className="w-5 h-5" />
                </CyberButton>
                <CyberButton
                  variant={viewMode === "list" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-4"
                >
                  <List className="w-5 h-5" />
                </CyberButton>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Enhanced Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CyberCard className="p-8 mb-10 bg-gradient-to-r from-cyber-bg-secondary/70 to-cyber-bg-tertiary/70 border-2 border-cyber-accent-blue/40 cyber-glow-animate">
            <div className="space-y-6">
              {/* Main Search */}
              <div className="relative">
                <div className="absolute left-6 top-1/2 transform -translate-y-1/2 cyber-glow-text-blue">
                  <Search className="w-6 h-6" />
                </div>
                <CyberInput
                  placeholder="Search viral templates, creators, hooks, or industries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-16 h-16 text-xl bg-cyber-bg-primary/60 border-2 border-cyber-accent-blue/50 cyber-text-primary font-semibold"
                  glow
                />
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                  <CyberButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-3 px-6 py-3"
                  >
                    <Filter className="w-5 h-5" />
                    <span className="font-bold">Advanced Filters</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
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
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t-2 border-cyber-accent-pink/30"
                  >
                    <div>
                      <label className="block text-lg font-bold cyber-text-primary mb-3">Industry</label>
                      <select
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="cyber-input w-full h-14 text-lg font-semibold"
                      >
                        {industries.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-lg font-bold cyber-text-primary mb-3">Hook Type</label>
                      <select
                        value={selectedHookType}
                        onChange={(e) => setSelectedHookType(e.target.value)}
                        className="cyber-input w-full h-14 text-lg font-semibold"
                      >
                        {hookTypes.map(hookType => (
                          <option key={hookType} value={hookType}>{hookType}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-lg font-bold cyber-text-primary mb-3">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="cyber-input w-full h-14 text-lg font-semibold"
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
                        className="w-full h-14 text-lg font-bold"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Reset Filters
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cyber-stats-grid mb-12"
        >
          <CyberStatsCard
            title="Active Templates"
            value={filteredVideos.length}
            subtitle="AI-Analyzed Content"
            icon={<Layers className="w-6 h-6 text-white" />}
            trend="up"
            trendValue="+12% this week"
            progress={(filteredVideos.length / allVideos.length) * 100}
            variant="default"
            animated
          />
          
          <CyberStatsCard
            title="Total Views"
            value={formatNumber(filteredVideos.reduce((sum, v) => sum + v.views, 0))}
            subtitle="Collective Reach"
            icon={<Eye className="w-6 h-6 text-white" />}
            trend="up"
            trendValue="+24% this month"
            progress={85}
            variant="success"
            animated
          />
          
          <CyberStatsCard
            title="Avg Viral Score"
            value={(filteredVideos.reduce((sum, v) => sum + v.viralScore, 0) / filteredVideos.length || 0).toFixed(1)}
            subtitle="Performance Rating"
            icon={<Star className="w-6 h-6 text-white" />}
            trend="up"
            trendValue="+0.3 points"
            progress={((filteredVideos.reduce((sum, v) => sum + v.viralScore, 0) / filteredVideos.length || 0) / 10) * 100}
            variant="warning"
            animated
          />
          
          <CyberStatsCard
            title="Industries"
            value={new Set(filteredVideos.map(v => v.industry)).size}
            subtitle="Across All Verticals"
            icon={<BarChart3 className="w-6 h-6 text-white" />}
            trend="neutral"
            trendValue="Complete coverage"
            progress={75}
            variant="danger"
            animated
          />
        </motion.div>

        {/* Enhanced Video Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
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
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {viewMode === "grid" ? (
                    <CyberCard glow className="group cursor-pointer overflow-hidden bg-gradient-to-br from-cyber-bg-secondary/90 to-cyber-bg-tertiary/90 border-2 border-cyber-accent-pink/40 hover:border-cyber-accent-blue/80 transition-all duration-500 cyber-float">
                      <div className="relative aspect-[9/16] overflow-hidden">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        
                        {/* Enhanced Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                        
                        {/* Animated Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-24 h-24 rounded-full bg-gradient-to-r from-cyber-accent-pink to-cyber-accent-purple flex items-center justify-center backdrop-blur-sm shadow-[0_0_40px_rgba(255,0,128,0.9)] cyber-pulse"
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
                            <CyberBadge variant={getViralScoreColor(video.viralScore)} glow className="shadow-xl text-sm font-bold">
                              <Star className="w-4 h-4 mr-2" />
                              {video.viralScore}/10
                            </CyberBadge>
                          </motion.div>
                        </div>
                        
                        <div className="absolute top-4 left-4">
                          <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                          >
                            <CyberBadge variant="secondary" className="backdrop-blur-sm text-sm font-bold">
                              <Zap className="w-4 h-4 mr-2" />
                              {video.hookType}
                            </CyberBadge>
                          </motion.div>
                        </div>

                        {/* Enhanced Bottom Info Bar */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/95 to-transparent">
                          <div className="flex items-center justify-between text-white text-sm font-semibold">
                            <div className="flex items-center gap-3">
                              <Eye className="w-4 h-4 cyber-glow-text-blue" />
                              <span className="cyber-text-primary">{formatNumber(video.views)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Heart className="w-4 h-4 cyber-glow-text" />
                              <span className="cyber-text-primary">{formatNumber(video.likes)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <CyberCardContent className="p-6 space-y-4">
                        <h3 className="font-bold text-lg cyber-text-primary line-clamp-2 group-hover:cyber-glow-text transition-colors duration-300">
                          {video.title}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm cyber-text-secondary font-semibold">@{video.author}</div>
                          <CyberBadge variant="outline" className="text-xs font-bold">
                            {Array.isArray(video.industry) ? video.industry[0] : video.industry}
                          </CyberBadge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 text-xs cyber-text-muted font-semibold">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            {formatNumber(video.comments)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                            {formatNumber(video.shares)}
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            {((video.likes + video.comments + video.shares) / video.views * 100).toFixed(1)}%
                          </div>
                        </div>
                        
                        <CyberButton 
                          size="sm" 
                          className="w-full group-hover:scale-105 transition-transform duration-300 font-bold"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <Target className="w-5 h-5 mr-2" />
                          Generate Script
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </CyberButton>
                      </CyberCardContent>
                    </CyberCard>
                  ) : (
                    <CyberCard glow className="p-8 cursor-pointer group bg-gradient-to-r from-cyber-bg-secondary/70 to-cyber-bg-tertiary/70 border-2 border-cyber-accent-blue/40 hover:border-cyber-accent-pink/80 transition-all duration-500">
                      <div className="flex gap-8">
                        <div className="relative w-48 h-64 flex-shrink-0 overflow-hidden rounded-xl">
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3">
                            <CyberBadge variant={getViralScoreColor(video.viralScore)} glow className="font-bold">
                              <Star className="w-4 h-4 mr-1" />
                              {video.viralScore}/10
                            </CyberBadge>
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <CyberBadge variant="secondary" className="backdrop-blur-sm font-bold">
                              {video.hookType}
                            </CyberBadge>
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold cyber-text-primary mb-3 group-hover:cyber-glow-text transition-colors duration-300">
                                {video.title}
                              </h3>
                              <div className="flex items-center gap-4 mb-4">
                                <span className="cyber-text-secondary font-semibold text-lg">@{video.author}</span>
                                <CyberBadge variant="outline" className="font-bold">
                                  {Array.isArray(video.industry) ? video.industry[0] : video.industry}
                                </CyberBadge>
                              </div>
                            </div>
                            
                            <CyberButton 
                              onClick={() => setSelectedVideo(video)}
                              className="group-hover:scale-105 transition-transform duration-300 font-bold"
                            >
                              <Target className="w-5 h-5 mr-2" />
                              Use Template
                            </CyberButton>
                          </div>
                          
                          <p className="cyber-text-secondary line-clamp-2 leading-relaxed text-lg font-medium">
                            {video.whyThisWorks}
                          </p>
                          
                          <div className="grid grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-cyber-bg-primary/40 rounded-xl border border-cyber-accent-blue/20">
                              <div className="text-xl font-bold cyber-glow-text-blue mb-1">
                                {formatNumber(video.views)}
                              </div>
                              <div className="text-sm cyber-text-muted font-semibold">Views</div>
                            </div>
                            <div className="text-center p-4 bg-cyber-bg-primary/40 rounded-xl border border-cyber-accent-pink/20">
                              <div className="text-xl font-bold cyber-glow-text mb-1">
                                {formatNumber(video.likes)}
                              </div>
                              <div className="text-sm cyber-text-muted font-semibold">Likes</div>
                            </div>
                            <div className="text-center p-4 bg-cyber-bg-primary/40 rounded-xl border border-cyber-accent-green/20">
                              <div className="text-xl font-bold cyber-glow-text-green mb-1">
                                {formatNumber(video.comments)}
                              </div>
                              <div className="text-sm cyber-text-muted font-semibold">Comments</div>
                            </div>
                            <div className="text-center p-4 bg-cyber-bg-primary/40 rounded-xl border border-cyber-accent-purple/20">
                              <div className="text-xl font-bold text-cyber-accent-purple mb-1">
                                {((video.likes + video.comments + video.shares) / video.views * 100).toFixed(1)}%
                              </div>
                              <div className="text-sm cyber-text-muted font-semibold">Engagement</div>
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
              <h3 className="text-3xl font-bold cyber-glow-text mb-6">
                No Templates Found
              </h3>
              <p className="cyber-text-secondary text-xl mb-8 leading-relaxed">
                Your search didn't match any viral templates. Try adjusting your filters or search terms to discover more content.
              </p>
              <CyberButton
                onClick={() => {
                  setSearchTerm("");
                  setSelectedIndustry("All");
                  setSelectedHookType("All");
                }}
                className="group text-lg font-bold px-8 py-4"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Reset & Explore All
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
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