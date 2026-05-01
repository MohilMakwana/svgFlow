// ===== Playground Page =====
// The main 3-column + timeline layout using flexbox (fixes v1 layout collapse)

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import SvgUploader from '@/components/svg-editor/SvgUploader';
import SvgCodeEditor from '@/components/svg-editor/SvgCodeEditor';
import SvgElementTree from '@/components/svg-editor/SvgElementTree';
import SampleSvgPicker from '@/components/svg-editor/SampleSvgPicker';
import AnimationControls from '@/components/animation-controls/AnimationControls';
import PreviewPanel from '@/components/preview/PreviewPanel';
import TimelineEditor from '@/components/timeline/TimelineEditor';
import ExportPanel from '@/components/export/ExportPanel';
import PresetsLibrary from '@/components/presets/PresetsLibrary';
import PerformancePanel from '@/components/performance/PerformancePanel';
import AiCopilotPanel from '@/components/ai/AiSuggestionsPanel';
import PanelResizer from '@/components/layout/PanelResizer';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, PanelRightClose, PanelLeftClose, Settings, ChevronRight, ChevronLeft } from 'lucide-react';
import { toggleLeftPanel, toggleRightPanel } from '@/features/ui/uiSlice';

export default function PlaygroundPage() {
  const dispatch = useAppDispatch();
  const hasSvg = useAppSelector((s) => s.svg.rawCode.length > 0);
  const { leftPanelOpen, rightPanelOpen } = useAppSelector((s) => s.ui);

  // Left Panel Tabs
  const LeftPanelContent = () => (
    <Tabs defaultValue="upload" className="flex flex-col h-full">
      <div className="px-3 pt-2">
        <TabsList className="grid grid-cols-3 w-full h-8">
          <TabsTrigger value="upload" className="text-[10px]">Source</TabsTrigger>
          <TabsTrigger value="tree" className="text-[10px]" disabled={!hasSvg}>Tree</TabsTrigger>
          <TabsTrigger value="samples" className="text-[10px]">Samples</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="upload" className="flex-1 flex flex-col min-h-0 mt-2">
        {hasSvg ? <SvgCodeEditor /> : (
          <div className="p-4 h-full flex items-center justify-center">
            <SvgUploader />
          </div>
        )}
      </TabsContent>
      <TabsContent value="tree" className="flex-1 flex flex-col min-h-0 mt-0">
        <SvgElementTree />
      </TabsContent>
      <TabsContent value="samples" className="flex-1 flex flex-col min-h-0 p-4 mt-0">
        <SampleSvgPicker />
        <div className="mt-4 opacity-50">
          <SvgUploader />
        </div>
      </TabsContent>
    </Tabs>
  );

  // Right Panel Tabs
  const RightPanelContent = () => (
    <Tabs defaultValue="controls" className="flex flex-col h-full">
      <div className="px-3 pt-2">
        <TabsList className="grid grid-cols-4 w-full h-8">
          <TabsTrigger value="controls" className="text-[10px] px-1" disabled={!hasSvg}>Animate</TabsTrigger>
          <TabsTrigger value="presets" className="text-[10px] px-1" disabled={!hasSvg}>Presets</TabsTrigger>
          <TabsTrigger value="export" className="text-[10px] px-1" disabled={!hasSvg}>Export</TabsTrigger>
          <TabsTrigger value="more" className="text-[10px] px-1">More</TabsTrigger>
        </TabsList>
      </div>

      {!hasSvg && (
        <div className="flex-1 flex items-center justify-center p-4 text-center text-xs text-muted-foreground">
          Upload an SVG first to enable controls
        </div>
      )}

      {hasSvg && (
        <>
          <TabsContent value="controls" className="flex-1 flex flex-col min-h-0 mt-2">
            <AnimationControls />
          </TabsContent>
          <TabsContent value="presets" className="flex-1 flex flex-col min-h-0 mt-2">
            <PresetsLibrary />
          </TabsContent>
          <TabsContent value="export" className="flex-1 flex flex-col min-h-0 mt-2">
            <ExportPanel />
          </TabsContent>
        </>
      )}

      {/* AI Tools are always available for Generation */}
      <TabsContent value="more" className="flex-1 flex flex-col min-h-0 mt-2">
        <Tabs defaultValue="ai" className="flex flex-col h-full">
          <div className="px-3">
            <TabsList className="grid grid-cols-2 w-full h-7">
              <TabsTrigger value="ai" className="text-[10px]">AI Tools</TabsTrigger>
              <TabsTrigger value="perf" className="text-[10px]" disabled={!hasSvg}>Performance</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="ai" className="flex-1 flex flex-col min-h-0 mt-2">
            <AiCopilotPanel />
          </TabsContent>
          <TabsContent value="perf" className="flex-1 flex flex-col min-h-0 mt-2">
            <PerformancePanel />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full relative bg-background">
      {/* Mobile Drawers (hidden on lg) */}
      <div className="lg:hidden absolute top-2 left-2 z-10">
        <Sheet>
          <SheetTrigger render={
            <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur">
              <Menu className="h-4 w-4" />
            </Button>
          } />
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col bg-card">
            <LeftPanelContent />
          </SheetContent>
        </Sheet>
      </div>
      <div className="lg:hidden absolute top-2 right-2 z-10">
        <Sheet>
          <SheetTrigger render={
            <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur">
              <Settings className="h-4 w-4" />
            </Button>
          } />
          <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 flex flex-col bg-card">
            <RightPanelContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Desktop Area (3 columns) */}
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {/* Left Column */}
        <div 
          className={`hidden lg:flex flex-col border-r border-border/50 bg-card/40 shrink-0 transition-all duration-300 ease-in-out relative group ${
            leftPanelOpen ? 'w-[320px]' : 'w-10'
          }`}
        >
          {leftPanelOpen ? (
            <div className="w-[320px] h-full flex flex-col animate-in fade-in slide-in-from-left-4 duration-300">
              <ErrorBoundary>
                <LeftPanelContent />
              </ErrorBoundary>
            </div>
          ) : (
            <button 
              onClick={() => dispatch(toggleLeftPanel())}
              className="w-full h-full flex flex-col items-center pt-4 gap-4 hover:bg-primary/5 transition-colors group/btn"
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover/btn:text-primary transition-colors" />
              <div className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase group-hover/btn:text-primary/70">
                Source & Elements
              </div>
            </button>
          )}
        </div>

        {/* Center Preview */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/50 relative overflow-hidden">
          <ErrorBoundary>
            <PreviewPanel />
          </ErrorBoundary>
        </div>

        {/* Right Column */}
        <div 
          className={`hidden lg:flex flex-col border-l border-border/50 bg-card/40 shrink-0 transition-all duration-300 ease-in-out relative group ${
            rightPanelOpen ? 'w-[320px]' : 'w-10'
          }`}
        >
          {rightPanelOpen ? (
            <div className="w-[320px] h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
              <ErrorBoundary>
                <RightPanelContent />
              </ErrorBoundary>
            </div>
          ) : (
            <button 
              onClick={() => dispatch(toggleRightPanel())}
              className="w-full h-full flex flex-col items-center pt-4 gap-4 hover:bg-primary/5 transition-colors group/btn"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover/btn:text-primary transition-colors" />
              <div className="[writing-mode:vertical-lr] text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase group-hover/btn:text-primary/70">
                Animation & Export
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Timeline */}
      <div className="shrink-0 w-full z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] border-t border-border/50 relative">
        <ErrorBoundary>
          <TimelineEditor />
        </ErrorBoundary>
      </div>
    </div>
  );
}
