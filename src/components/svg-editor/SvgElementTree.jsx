// ===== SVG Element Tree =====

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectElement } from '@/features/svg/svgSlice';
import { setActiveElement } from '@/features/animation/animationSlice';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Circle, Square, Type, Spline, Layers, ChevronRight } from 'lucide-react';

const TAG_ICONS = {
  circle: Circle,
  ellipse: Circle,
  rect: Square,
  text: Type,
  path: Spline,
  g: Layers,
};

function ElementNode({ element, depth = 0 }) {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((s) => s.svg.selectedElementId);
  const activeAnimId = useAppSelector((s) => s.animation.activeElementId);
  const isSelected = selectedId === element.id;
  const hasAnim = activeAnimId === element.id;
  const Icon = TAG_ICONS[element.tag] || Spline;

  const handleClick = () => {
    dispatch(selectElement(element.id));
    dispatch(setActiveElement(element.id));
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-colors ${
          isSelected
            ? 'bg-primary/15 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        {element.hasChildren && <ChevronRight className="h-3 w-3 shrink-0" />}
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{element.label}</span>
        {hasAnim && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        )}
      </button>
      {element.children?.map((child) => (
        <ElementNode key={child.id} element={child} depth={depth + 1} />
      ))}
    </>
  );
}

export default function SvgElementTree() {
  const elements = useAppSelector((s) => s.svg.elements);

  if (elements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
        <Layers className="h-8 w-8 text-muted-foreground/30" />
        <p className="text-xs text-muted-foreground">Upload an SVG to see its elements</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-0.5">
        {elements.map((el) => (
          <ElementNode key={el.id} element={el} />
        ))}
      </div>
    </ScrollArea>
  );
}
