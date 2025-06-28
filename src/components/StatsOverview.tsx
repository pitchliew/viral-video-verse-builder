
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Eye, Heart, Users } from "lucide-react";

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
  followers: number;
  hookType: string;
  industry: string;
  videoObjective: string;
  title: string;
  whyThisWorks: string;
  viralScore: number;
}

interface StatsOverviewProps {
  videos: Video[];
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

export const StatsOverview = ({ videos }: StatsOverviewProps) => {
  const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
  const totalLikes = videos.reduce((sum, video) => sum + video.likes, 0);
  const averageViralScore = videos.length > 0 
    ? (videos.reduce((sum, video) => sum + video.viralScore, 0) / videos.length).toFixed(1)
    : "0";
  const totalVideos = videos.length;

  const stats = [
    {
      title: "Total Videos",
      value: totalVideos.toString(),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Total Views",
      value: formatNumber(totalViews),
      icon: Eye,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      title: "Total Likes",
      value: formatNumber(totalLikes),
      icon: Heart,
      color: "text-red-600",
      bg: "bg-red-100"
    },
    {
      title: "Avg Viral Score",
      value: averageViralScore,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
