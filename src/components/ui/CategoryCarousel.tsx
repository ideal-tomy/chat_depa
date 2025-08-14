"use client";

import React from 'react';
import { Bot } from '@/types';
import HorizontalCarousel from './HorizontalCarousel';

interface CategoryCarouselProps {
  bots: Bot[];
  variant?: 'standard' | 'compact';
  showPreview?: boolean;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ bots }) => {
  return <HorizontalCarousel bots={bots} />;
};

export default CategoryCarousel;
