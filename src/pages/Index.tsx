import { useState, useEffect } from "react";
import { VideoCard } from "../components/VideoCard";
import { FilterBar } from "../components/FilterBar";
import { StatsOverview } from "../components/StatsOverview";
import { VideoPagination } from "../components/VideoPagination";
import { SavedScriptCard } from "../components/SavedScriptCard";
import { ScriptEditor } from "../components/ScriptEditor";
import { AuthButton } from "../components/AuthButton";
import { useAirtableVideos } from "../hooks/useAirtableVideos";
import { useSavedScripts } from "../hooks/useSavedScripts";
import { useAuth } from "../hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video } from "lucide-react";

const VIDEOS_PER_PAGE = 12;

const Index = () => {
  const { videos: allVideos, loading, error } = useAirtableVideos();
  const { scripts, loading: scriptsLoading, deleteScript } = useSavedScripts();
  const { user, loading: authLoading } = useAuth();
  const [filteredVideos, setFilteredVideos] = useState(allVideos);
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedHook, setSelectedHook] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [showScriptEditor, setShowScriptEditor] = useState(false);

  // Update filtered videos when allVideos changes
  useEffect(() => {
    setFilteredVideos(allVideos);
    setCurrentPage(1); // Reset to first page when data changes
  }, [allVideos]);

  const handleFilter = (industry: string, hookType: string) => {
    let filtered = allVideos;
    
    if (industry !== "All") {
      filtered = filtered.filter(video => {
        const videoIndustry = Array.isArray(video.industry) ? video.industry[0] : video.industry;
        return videoIndustry === industry;
      });
    }
    
    if (hookType !== "All") {
      filtered = filtered.filter(video => video.hookType === hookType);
    }
    
    setFilteredVideos(filtered);
    setSelectedIndustry(industry);
    setSelectedHook(hookType);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
  const endIndex = startIndex + VIDEOS_PER_PAGE;
  const currentVideos = filteredVideos.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditScript = (script: any) => {
    setSelectedScript(script);
    setShowScriptEditor(true);
  };

  const handleViewScript = (script: any) => {
    setSelectedScript(script);
    setShowScriptEditor(true);
  };

  if (loading || authLoading) {
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

  // If script editor is open, show it
  if (showScriptEditor && selectedScript) {
    return (
      <ScriptEditor 
        generatedScript={selectedScript.content}
        originalVideo={selectedScript.original_video_data}
        existingScript={selectedScript}
        isEditMode={true}
        onClose={() => {
          setShowScriptEditor(false);
          setSelectedScript(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="text-center flex-1">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                ViralHooks
              </h1>
              <p className="text-gray-600 text-xl mb-2">
                Decode the secrets behind viral content
              </p>
              <p className="text-purple-600 font-semibold">
                {activeTab === "templates" 
                  ? `${filteredVideos.length} viral templates analyzed`
                  : `${scripts.length} saved scripts`
                }
              </p>
            </div>
            <div className="absolute top-4 right-4">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Viral Templates
            </TabsTrigger>
            <TabsTrigger value="scripts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              My Scripts {!user && "(Sign in required)"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-8">
            {/* Stats Overview */}
            <StatsOverview videos={currentVideos} />

            {/* Filter Bar */}
            <FilterBar 
              onFilter={handleFilter}
              selectedIndustry={selectedIndustry}
              selectedHook={selectedHook}
              allVideos={allVideos}
            />

            {/* Enhanced Videos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <VideoPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {filteredVideos.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg max-w-md mx-auto">
                  <div className="text-gray-400 text-xl mb-2">No videos found</div>
                  <p className="text-gray-500">Try adjusting your filters to see more results</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="scripts" className="space-y-8">
            {!user ? (
              <div className="text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg max-w-md mx-auto">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <div className="text-gray-400 text-xl mb-2">Sign in required</div>
                  <p className="text-gray-500 mb-4">Please sign in to view and manage your saved scripts</p>
                  <AuthButton />
                </div>
              </div>
            ) : scriptsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading saved scripts...</p>
              </div>
            ) : scripts.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg max-w-md mx-auto">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <div className="text-gray-400 text-xl mb-2">No saved scripts yet</div>
                  <p className="text-gray-500">Generate and save your first script from a viral template</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {scripts.map((script) => (
                  <SavedScriptCard
                    key={script.id}
                    script={script}
                    onEdit={handleEditScript}
                    onView={handleViewScript}
                    onDelete={deleteScript}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;