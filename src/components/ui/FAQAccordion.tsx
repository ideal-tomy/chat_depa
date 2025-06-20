'use client';

import { useState } from 'react';
import { Disclosure, Transition } from '@headlessui/react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQAccordion({ items, title }: FAQAccordionProps) {
  return (
    <div className="w-full rounded-lg">
      {title && (
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
      )}
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <Disclosure key={index} as="div" className="border rounded-lg shadow-sm">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full px-6 py-4 text-left">
                  <span className="text-base font-medium text-text-dark">
                    <span className="text-primary font-bold mr-2">Q.</span>
                    {item.question}
                  </span>
                  <div className={`${open ? 'rotate-180 transform' : ''} transition-transform duration-200`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="px-6 py-4 bg-gray-50 rounded-b-lg border-t">
                    <div className="flex">
                      <span className="text-accent-blue font-bold mr-2">A.</span>
                      <div className="text-text-dark">
                        {item.answer}
                      </div>
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
}
