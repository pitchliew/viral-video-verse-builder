
import { useState } from "react";
import { Copy, Download, Share2, CheckCircle, FileText, Bookmark, StickyNote, Save, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { SaveScriptModal } from "./SaveScriptModal";
import { useSavedScripts } from "@/hooks/useSavedScripts";
import { Textarea } from "@/components/ui/textarea";

interface ScriptEditorProps {
  generatedScript: string;
  originalVideo?: {
    title: string;
    author: string;
    hookType: string;
    industry: string;
    viralScore: number;
  };
  onClose?: () => void;
  existingScript?: any;
  isEditMode?: boolean;
}

export const ScriptEditor = ({ generatedScript, originalVideo, onClose, existingScript, isEditMode = false }: ScriptEditorProps) => {
  const [notes, setNotes] = useState("");
  const [shortcuts, setShortcuts] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [editedSections, setEditedSections] = useState<any>({});
  const { toast } = useToast();
  const { saveScript, updateScript } = useSavedScripts();
  const [isSaving, setIsSaving] = useState(false);

  // Parse the generated script into sections
  const parseScript = (script: string) => {
    const sections = {
      hook: "",
      mainContent: "",
      callToAction: "",
      hashtags: "",
      fullCaption: ""
    };

    const lines = script.split('\n');
    let currentSection = '';
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.includes('HOOK')) {
        currentSection = 'hook';
      } else if (trimmedLine.includes('MAIN CONTENT')) {
        currentSection = 'mainContent';
      } else if (trimmedLine.includes('CALL TO ACTION')) {
        currentSection = 'callToAction';
      } else if (trimmedLine.includes('HASHTAGS')) {
        currentSection = 'hashtags';
      } else if (trimmedLine.includes('FULL CAPTION')) {
        currentSection = 'fullCaption';
      } else if (trimmedLine && !trimmedLine.startsWith('**') && !trimmedLine.startsWith('[')) {
        if (currentSection) {
          sections[currentSection as keyof typeof sections] += (sections[currentSection as keyof typeof sections] ? '\n' : '') + trimmedLine;
        }
      }
    });

    return sections;
  };

  const scriptSections = existingScript?.script_sections || parseScript(generatedScript);
  const currentSections = isEditing ? { ...scriptSections, ...editedSections } : scriptSections;

  // Function to reconstruct script content from sections
  const reconstructScriptFromSections = (sections: any) => {
    let reconstructed = '';
    
    if (sections.hook) {
      reconstructed += `**HOOK**\n${sections.hook}\n\n`;
    }
    
    if (sections.mainContent) {
      reconstructed += `**MAIN CONTENT**\n${sections.mainContent}\n\n`;
    }
    
    if (sections.callToAction) {
      reconstructed += `**CALL TO ACTION**\n${sections.callToAction}\n\n`;
    }
    
    if (sections.hashtags) {
      reconstructed += `**HASHTAGS**\n${sections.hashtags}\n\n`;
    }
    
    if (sections.fullCaption) {
      reconstructed += `**FULL CAPTION**\n${sections.fullCaption}`;
    }
    
    return reconstructed.trim();
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleSaveScript = async (data: { title: string; description?: string }) => {
    setIsSaving(true);
    try {
      // Use reconstructed content if we have edited sections, otherwise use original
      const contentToSave = Object.keys(editedSections).length > 0 
        ? reconstructScriptFromSections(currentSections)
        : generatedScript;

      const scriptData = {
        title: data.title,
        content: contentToSave,
        script_sections: currentSections,
        original_video_data: originalVideo,
      };

      if (existingScript) {
        await updateScript(existingScript.id, scriptData);
      } else {
        await saveScript(scriptData);
      }
      
      setShowSaveModal(false);
    } catch (error) {
      // Error handling is in the hook
    } finally {
      setIsSaving(false);
    }
  };

  const handleSectionEdit = (section: string, value: string) => {
    setEditedSections(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const toggleEditMode = () => {
    if (isEditing && existingScript) {
      // Auto-save when leaving edit mode
      const updatedSections = { ...scriptSections, ...editedSections };
      const updatedContent = Object.keys(editedSections).length > 0 
        ? reconstructScriptFromSections(updatedSections)
        : generatedScript;
        
      updateScript(existingScript.id, {
        script_sections: updatedSections,
        content: updatedContent
      });
    }
    setIsEditing(!isEditing);
  };

  const performanceScores = {
    hookStrength: 87,
    viralPotential: 92,
    engagement: 85,
    retention: 89
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Script Editor</h1>
          <p className="text-gray-600 mt-1">
            {existingScript ? `Editing: ${existingScript.title}` : `Generated from: ${originalVideo?.title || 'Viral Template'}`}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => copyToClipboard(
            Object.keys(editedSections).length > 0 
              ? reconstructScriptFromSections(currentSections)
              : generatedScript, 
            'Full Script'
          )}>
            <Copy className="w-4 h-4 mr-2" />
            Copy All
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setShowSaveModal(true)}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {existingScript ? 'Update Script' : 'Save Script'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={toggleEditMode}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? 'View Mode' : 'Edit Mode'}
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Approved
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Script Sections */}
          <Tabs defaultValue="script" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="script">Script</TabsTrigger>
              <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="script" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Hook (First 3-5 seconds)</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(currentSections.hook, 'Hook')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    {isEditing ? (
                      <Textarea
                        value={editedSections.hook || currentSections.hook}
                        onChange={(e) => handleSectionEdit('hook', e.target.value)}
                        className="w-full min-h-[100px] font-medium"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{currentSections.hook}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Main Content</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(currentSections.mainContent, 'Main Content')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    {isEditing ? (
                      <Textarea
                        value={editedSections.mainContent || currentSections.mainContent}
                        onChange={(e) => handleSectionEdit('mainContent', e.target.value)}
                        className="w-full min-h-[200px]"
                      />
                    ) : (
                      <p className="text-gray-800 whitespace-pre-line">{currentSections.mainContent}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Call to Action</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(currentSections.callToAction, 'Call to Action')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    {isEditing ? (
                      <Textarea
                        value={editedSections.callToAction || currentSections.callToAction}
                        onChange={(e) => handleSectionEdit('callToAction', e.target.value)}
                        className="w-full min-h-[100px] font-medium"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{currentSections.callToAction}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Full Caption</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(currentSections.fullCaption, 'Full Caption')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {isEditing ? (
                      <Textarea
                        value={editedSections.fullCaption || currentSections.fullCaption}
                        onChange={(e) => handleSectionEdit('fullCaption', e.target.value)}
                        className="w-full min-h-[150px]"
                      />
                    ) : (
                      <p className="text-gray-800 whitespace-pre-line">{currentSections.fullCaption}</p>
                    )}
                  </div>
                  {currentSections.hashtags && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Suggested Hashtags:</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentSections.hashtags.split(/[\s,#]+/).filter(tag => tag.trim()).map((tag, index) => (
                          <Badge key={index} variant="secondary">#{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shortcuts">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5" />
                    Shortcuts & Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full h-64 p-3 border rounded-lg resize-none"
                    placeholder="Add your shortcuts and templates here..."
                    value={shortcuts}
                    onChange={(e) => setShortcuts(e.target.value)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StickyNote className="w-5 h-5" />
                    Notes & Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full h-64 p-3 border rounded-lg resize-none"
                    placeholder="Add your notes and ideas here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Performance Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Hook Strength</span>
                  <span className="font-semibold">{performanceScores.hookStrength}%</span>
                </div>
                <Progress value={performanceScores.hookStrength} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Viral Potential</span>
                  <span className="font-semibold">{performanceScores.viralPotential}%</span>
                </div>
                <Progress value={performanceScores.viralPotential} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Engagement Rate</span>
                  <span className="font-semibold">{performanceScores.engagement}%</span>
                </div>
                <Progress value={performanceScores.engagement} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Retention Score</span>
                  <span className="font-semibold">{performanceScores.retention}%</span>
                </div>
                <Progress value={performanceScores.retention} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Export as Markdown
              </Button>
            </CardContent>
          </Card>

          {originalVideo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Source Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-600">Author:</span>
                  <p className="font-medium">{originalVideo.author}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Hook Type:</span>
                  <Badge variant="secondary" className="ml-2">{originalVideo.hookType}</Badge>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Industry:</span>
                  <Badge variant="outline" className="ml-2">{originalVideo.industry}</Badge>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Viral Score:</span>
                  <span className="ml-2 font-bold text-green-600">{originalVideo.viralScore}/10</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <SaveScriptModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveScript}
        isLoading={isSaving}
      />
    </div>
  );
};
