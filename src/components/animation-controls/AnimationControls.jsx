// ===== Animation Controls =====
// Container component — delegates to decomposed tab components

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectActiveConfig, resetAnimation, setActiveElement } from '@/features/animation/animationSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { RotateCcw, Target } from 'lucide-react';

import TransformTab from './TransformTab';
import OpacityTab from './OpacityTab';
import StrokeTab from './StrokeTab';
import TimingTab from './TimingTab';
import TriggersTab from './TriggersTab';

export default function AnimationControls() {
  const dispatch = useAppDispatch();
  const config = useAppSelector(selectActiveConfig);
  const activeId = useAppSelector((s) => s.animation.activeElementId);
  const selectedSvgEl = useAppSelector((s) => s.svg.selectedElementId);

  const targetLabel = activeId || 'Global (All Elements)';

  return (
    <div className="flex flex-col h-full">
      {/* Target Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
        <div className="flex items-center gap-2 min-w-0">
          <Target className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="text-xs font-medium truncate">{targetLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          {activeId && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-[10px]"
              onClick={() => dispatch(setActiveElement(null))}
            >
              Global
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => dispatch(resetAnimation())}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transform" className="flex flex-col flex-1 min-h-0">
        <TabsList className="grid grid-cols-5 mx-3 mt-2 h-8">
          <TabsTrigger value="transform" className="text-[10px] px-1">Transform</TabsTrigger>
          <TabsTrigger value="opacity" className="text-[10px] px-1">Opacity</TabsTrigger>
          <TabsTrigger value="stroke" className="text-[10px] px-1">Stroke</TabsTrigger>
          <TabsTrigger value="timing" className="text-[10px] px-1">Timing</TabsTrigger>
          <TabsTrigger value="triggers" className="text-[10px] px-1">Triggers</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 min-h-0">
          <div className="px-3 py-3">
            <TabsContent value="transform" className="mt-0">
              <TransformTab config={config} />
            </TabsContent>
            <TabsContent value="opacity" className="mt-0">
              <OpacityTab config={config} />
            </TabsContent>
            <TabsContent value="stroke" className="mt-0">
              <StrokeTab config={config} />
            </TabsContent>
            <TabsContent value="timing" className="mt-0">
              <TimingTab config={config} />
            </TabsContent>
            <TabsContent value="triggers" className="mt-0">
              <TriggersTab config={config} />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
