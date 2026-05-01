// ===== Triggers Tab =====

import { useAppDispatch } from '@/app/hooks';
import { updateInteraction } from '@/features/animation/animationSlice';
import { TRIGGER_OPTIONS } from '@/utils/constants';
import { Play, MousePointer, Hand } from 'lucide-react';

const TRIGGER_ICONS = {
  auto: Play,
  hover: MousePointer,
  click: Hand,
};

export default function TriggersTab({ config }) {
  const dispatch = useAppDispatch();
  const trigger = config.interaction?.trigger || 'auto';

  return (
    <div className="space-y-3 p-1">
      <p className="text-xs text-muted-foreground">Choose when the animation plays</p>

      <div className="space-y-2">
        {TRIGGER_OPTIONS.map((opt) => {
          const Icon = TRIGGER_ICONS[opt.value];
          const isActive = trigger === opt.value;

          return (
            <button
              key={opt.value}
              onClick={() => dispatch(updateInteraction({ trigger: opt.value }))}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                isActive
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border/30 hover:border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`p-1.5 rounded-md ${isActive ? 'bg-primary/20' : 'bg-muted'}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium">{opt.label}</p>
                <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
