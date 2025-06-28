
import { useState } from "react";
import { VideoCard } from "../components/VideoCard";
import { FilterBar } from "../components/FilterBar";
import { StatsOverview } from "../components/StatsOverview";
import { useAirtableVideos } from "../hooks/useAirtableVideos";

const Index = () => {
  const { videos: allVideos, loading, error } = useAirtableVideos();
  const [filteredVideos, setFilteredVideos] = useState(allVideos);
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedHook, setSelectedHook] = useState("All");

  // Update filtered videos when allVideos changes
  useState(() => {
    setFilteredVideos(allVideos);
  }, [allVideos]);

  const handleFilter = (industry: string, hookType: string) => {
    let filtered = allVideos;
    
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading viral videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Error loading videos</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

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

        {filteredVideos.length === 0 && !loading && (
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
