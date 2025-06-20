'use client';

import { Fragment, ReactNode, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  showExportPanel?: boolean;
  exportPanel?: ReactNode;
}

export default function ChatModal({
  isOpen,
  onClose,
  title,
  children,
  showExportPanel = false,
  exportPanel,
}: ChatModalProps) {
  const initialFocusRef = useRef(null);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={onClose}
        initialFocus={initialFocusRef}
      >
        {/* 背景オーバーレイ */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all flex flex-col h-[80vh]">
                {/* モーダルヘッダー */}
                <div className="flex items-center justify-between p-4 border-b">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-text-dark"
                    ref={initialFocusRef}
                  >
                    {title}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-text-light hover:text-text-dark rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={onClose}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                </div>

                {/* チャットコンテンツエリア */}
                <div className="flex flex-grow overflow-hidden">
                  {/* メインチャットエリア */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {children}
                  </div>

                  {/* エクスポートパネル（条件付き表示） */}
                  {showExportPanel && exportPanel && (
                    <div className="w-72 border-l overflow-y-auto">
                      {exportPanel}
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
