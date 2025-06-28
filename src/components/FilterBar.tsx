
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface FilterBarProps {
  onFilter: (industry: string, hookType: string) => void;
  selectedIndustry: string;
  selectedHook: string;
}

const industries = ["All", "Productivity", "Technology", "Fitness", "Business", "Entertainment"];
const hookTypes = ["All", "Question Hook", "Problem/Solution", "Time Promise", "Outcome Promise"];

export const FilterBar = ({ onFilter, selectedIndustry, selectedHook }: FilterBarProps) => {
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
              <label className="text-sm font-medium text-gray-700">Industry</label>
              <Select value={selectedIndustry} onValueChange={handleIndustryChange}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white">
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
              <label className="text-sm font-medium text-gray-700">Hook Type</label>
              <Select value={selectedHook} onValueChange={handleHookChange}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white">
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
