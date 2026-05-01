// ===== Panel Resizer =====

export default function PanelResizer({ onResize, direction = 'horizontal' }) {
  const handleMouseDown = (e) => {
    e.preventDefault();
    const startPos = direction === 'horizontal' ? e.clientX : e.clientY;
    
    const handleMouseMove = (moveEvent) => {
      const currentPos = direction === 'horizontal' ? moveEvent.clientX : moveEvent.clientY;
      const delta = currentPos - startPos;
      onResize(delta, currentPos);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
  };

  return (
    <div
      className={`relative z-10 hover:bg-primary/20 active:bg-primary/40 transition-colors ${
        direction === 'horizontal' 
          ? 'w-1.5 -ml-[0.75px] -mr-[0.75px] cursor-col-resize h-full' 
          : 'h-1.5 -mt-[0.75px] -mb-[0.75px] cursor-row-resize w-full'
      }`}
      onMouseDown={handleMouseDown}
    />
  );
}
