
import { useState } from "react";
import { VideoCard } from "../components/VideoCard";
import { FilterBar } from "../components/FilterBar";
import { StatsOverview } from "../components/StatsOverview";

// Mock data matching Airtable schema
const mockVideos = [
  {
    id: "1",
    videoUrl: "https://example.com/video1",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop",
    author: "CreatorOne",
    caption: "Amazing productivity hack that changed my life! 🚀",
    views: 2500000,
    likes: 185000,
    comments: 12400,
    shares: 8900,
    followers: 450000,
    hookType: "Question Hook",
    industry: "Productivity",
    videoObjective: "Education",
    title: "Life-Changing Productivity Method",
    whyThisWorks: "Opens with compelling question, provides clear value, and has strong visual storytelling",
    viralScore: 8.7
  },
  {
    id: "2",
    videoUrl: "https://example.com/video2",
    thumbnailUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400&h=600&fit=crop",
    author: "TechGuru",
    caption: "This coding trick will blow your mind 🤯 #coding #programming",
    views: 1800000,
    likes: 156000,
    comments: 9800,
    shares: 7200,
    followers: 320000,
    hookType: "Problem/Solution",
    industry: "Technology",
    videoObjective: "Tutorial",
    title: "Mind-Blowing Coding Trick",
    whyThisWorks: "Addresses common pain point, shows immediate solution, perfect pacing",
    viralScore: 9.2
  },
  {
    id: "3",
    videoUrl: "https://example.com/video3",
    thumbnailUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=600&fit=crop",
    author: "FitnessCoach",
    caption: "30-second ab workout that actually works! Try it now 💪",
    views: 3200000,
    likes: 287000,
    comments: 18500,
    shares: 15600,
    followers: 680000,
    hookType: "Time Promise",
    industry: "Fitness",
    videoObjective: "Entertainment",
    title: "30-Second Ab Transformation",
    whyThisWorks: "Clear time commitment, demonstrates results, high energy presentation",
    viralScore: 9.5
  },
  {
    id: "4",
    videoUrl: "https://example.com/video4",
    thumbnailUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop",
    author: "BusinessMentor",
    caption: "How I made $10k in 30 days (step by step) 💰",
    views: 4100000,
    likes: 345000,
    comments: 25600,
    shares: 19800,
    followers: 890000,
    hookType: "Outcome Promise",
    industry: "Business",
    videoObjective: "Education",
    title: "30-Day $10K Blueprint",
    whyThisWorks: "Specific outcome, credible presenter, actionable steps revealed",
    viralScore: 9.8
  }
];

const Index = () => {
  const [filteredVideos, setFilteredVideos] = useState(mockVideos);
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedHook, setSelectedHook] = useState("All");

  const handleFilter = (industry: string, hookType: string) => {
    let filtered = mockVideos;
    
    if (industry !== "All") {
      filtered = filtered.filter(video => video.industry === industry);
    }
    
    if (hookType !== "All") {
      filtered = filtered.filter(video => video.hookType === hookType);
    }
    
    setFilteredVideos(filtered);
    setSelectedIndustry(industry);
    setSelectedHook(hookType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Viral Video Analytics
            </h1>
            <p className="text-gray-600 text-lg">
              Discover what makes content go viral
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <StatsOverview videos={filteredVideos} />

        {/* Filter Bar */}
        <FilterBar 
          onFilter={handleFilter}
          selectedIndustry={selectedIndustry}
          selectedHook={selectedHook}
        />

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-2">No videos found</div>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
