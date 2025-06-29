
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";

interface FilterBarProps {
  onFilter: (industry: string, hookType: string) => void;
  selectedIndustry: string;
  selectedHook: string;
  allVideos: any[];
}

export const FilterBar = ({ onFilter, selectedIndustry, selectedHook, allVideos }: FilterBarProps) => {
  // Extract unique industries from the actual data
  const industries = useMemo(() => {
    const uniqueIndustries = new Set<string>();
    uniqueIndustries.add("All");
    
    allVideos.forEach(video => {
      if (video.industry) {
        // Handle both array and string formats
        if (Array.isArray(video.industry)) {
          video.industry.forEach((ind: string) => {
            if (ind && ind.trim()) {
              uniqueIndustries.add(ind.trim());
            }
          });
        } else if (typeof video.industry === 'string' && video.industry.trim()) {
          uniqueIndustries.add(video.industry.trim());
        }
      }
    });
    
    return Array.from(uniqueIndustries).sort();
  }, [allVideos]);

  // Extract unique hook types from the actual data
  const hookTypes = useMemo(() => {
    const uniqueHookTypes = new Set<string>();
    uniqueHookTypes.add("All");
    
    allVideos.forEach(video => {
      if (video.hookType && typeof video.hookType === 'string' && video.hookType.trim()) {
        uniqueHookTypes.add(video.hookType.trim());
      }
    });
    
    return Array.from(uniqueHookTypes).sort();
  }, [allVideos]);

  const handleIndustryChange = (value: string) => {
    onFilter(value, selectedHook);
  };

  const handleHookChange = (value: string) => {
    onFilter(selectedIndustry, value);
  };

  return (
    <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <h3 className="font-semibold text-gray-900 whitespace-nowrap">Filter Videos:</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Industry ({industries.length - 1} available)</label>
              <Select value={selectedIndustry} onValueChange={handleIndustryChange}>
                <SelectTrigger className="w-full sm:w-[200px] bg-white">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Hook Type ({hookTypes.length - 1} available)</label>
              <Select value={selectedHook} onValueChange={handleHookChange}>
                <SelectTrigger className="w-full sm:w-[200px] bg-white">
                  <SelectValue placeholder="Select hook type" />
                </SelectTrigger>
                <SelectContent>
                  {hookTypes.map((hook) => (
                    <SelectItem key={hook} value={hook}>
                      {hook}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
