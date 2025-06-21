'use client';

import { useState } from 'react';
import { FaqItem } from '@/types/types';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItemId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div 
          key={item.id}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white"
        >
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full flex justify-between items-center p-4 md:p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
          >
            <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
            <ChevronDownIcon 
              className={cn(
                "h-5 w-5 text-gray-500 transition-transform",
                openItemId === item.id && "transform rotate-180"
              )}
            />
          </button>
          
          <div 
            className={cn(
              "overflow-hidden transition-all duration-300 max-h-0",
              openItemId === item.id && "max-h-[500px]"
            )}
          >
            <div className="p-4 md:p-6 pt-0 text-gray-600 border-t border-gray-100">
              <p className="whitespace-pre-line">{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
