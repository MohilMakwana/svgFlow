// ===== SVG Uploader =====

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppDispatch } from '@/app/hooks';
import { setSvgCode, setElements, setParseError } from '@/features/svg/svgSlice';
import { clearAllAnimations } from '@/features/animation/animationSlice';
import { parseSvgCode, injectElementIds } from '@/utils/svgParser';
import { Upload, FileCode } from 'lucide-react';
import { toast } from 'sonner';

export default function SvgUploader() {
  const dispatch = useAppDispatch();

  const processSvg = useCallback((code) => {
    const modified = injectElementIds(code);
    dispatch(setSvgCode(modified));

    const { elements, error } = parseSvgCode(modified);
    if (error) {
      dispatch(setParseError(error));
      toast.error(`SVG Parse Error: ${error}`);
    } else {
      dispatch(setElements(elements));
      dispatch(setParseError(null));
      dispatch(clearAllAnimations());
      toast.success(`Loaded ${elements.length} animatable elements`);
    }
  }, [dispatch]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml') {
      toast.error('Please upload an SVG file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => processSvg(e.target.result);
    reader.readAsText(file);
  }, [processSvg]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/svg+xml': ['.svg'] },
    maxFiles: 1,
    multiple: false,
  });

  const handlePaste = (e) => {
    const text = e.clipboardData?.getData('text');
    if (text && text.trim().startsWith('<')) {
      e.preventDefault();
      processSvg(text);
    }
  };

  return (
    <div
      {...getRootProps()}
      onPaste={handlePaste}
      className={`flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
        isDragActive
          ? 'border-primary bg-primary/10 scale-[1.02]'
          : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'
      }`}
    >
      <input {...getInputProps()} />
      <div className={`p-3 rounded-xl transition-colors ${isDragActive ? 'bg-primary/20' : 'bg-muted'}`}>
        {isDragActive ? (
          <FileCode className="h-6 w-6 text-primary" />
        ) : (
          <Upload className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">
          {isDragActive ? 'Drop SVG here' : 'Drop SVG or click to upload'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          SVG files only • or paste SVG code
        </p>
      </div>
    </div>
  );
}
