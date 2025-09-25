"use client";

import { useState, useCallback, useRef, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onAnalyze: (file: File) => void;
  status: 'idle' | 'loading' | 'success' | 'error';
}

export default function ImageUploader({ onAnalyze, status }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (selectedFile && (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png')) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };
  
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleAnalyzeClick = () => {
    if (file) {
      onAnalyze(file);
    }
  };
  
  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  }

  const isLoading = status === 'loading';

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 border-border/50">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Detect Your Meal</CardTitle>
        <CardDescription>Upload an image to get started</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleChooseFileClick}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 relative',
            'border-border hover:border-primary/80 hover:bg-accent/10',
            isDragActive ? 'border-primary bg-accent/20' : ''
          )}
        >
          <input 
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={handleChange}
          />
          {preview ? (
            <div className="relative max-h-64 w-full rounded-md overflow-hidden">
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <UploadCloud className="w-16 h-16 text-primary/70" />
              <p className="font-semibold font-body">
                <span className="text-primary font-bold">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm">Supports: JPG, PNG</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleChooseFileClick} variant="outline" disabled={isLoading}>
                <ImageIcon className="mr-2 h-4 w-4" />
                {file ? 'Change Image' : 'Choose Image'}
            </Button>
            <Button onClick={handleAnalyzeClick} disabled={!file || isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Analyze Image
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
