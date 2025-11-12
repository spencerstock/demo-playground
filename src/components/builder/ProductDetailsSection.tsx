'use client';

import { Input } from '../ui/Input';
import { useState, useRef } from 'react';

interface ProductDetailsSectionProps {
  productName: string;
  subtitle: string;
  imageUrl: string;
  price: string;
  onProductNameChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
  onPriceChange: (value: string) => void;
}

export function ProductDetailsSection({
  productName,
  subtitle,
  imageUrl,
  price,
  onProductNameChange,
  onSubtitleChange,
  onImageUrlChange,
  onPriceChange,
}: ProductDetailsSectionProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageUrlChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageUrlChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-[15px] font-semibold text-gray-900">Product details</h3>

      <div className="space-y-5">
        <Input
          label="Product name"
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          placeholder="Wooden Chair"
        />

        <Input
          label="Subtitle"
          value={subtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          placeholder="Comfort meets simplicity"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product image</label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {imageUrl ? (
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Product preview"
                  className="max-h-40 mx-auto rounded object-contain"
                />
                <p className="text-sm text-gray-500">Click or drag to replace image</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and
                  drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          <Input
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
            placeholder="Or paste image URL"
            className="mt-2"
          />
        </div>

        <Input
          label="Price (USD)"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="150.00"
          type="text"
        />
      </div>
    </div>
  );
}
