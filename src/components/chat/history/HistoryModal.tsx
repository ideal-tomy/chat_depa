'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { useChatService } from '../ChatProvider';
import { Message } from '@/types/types';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

export default function HistoryModal({ isOpen, onClose, sessionId }: HistoryModalProps) {
  const chatService = useChatService();
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // モーダルが開かれ、かつ履歴がまだ読み込まれていない場合に取得する
    if (isOpen && history.length === 0) {
      setIsLoading(true);
      chatService.fetchHistory(sessionId)
        .then(setHistory)
        .catch(err => console.error('Failed to fetch modal history:', err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, sessionId, chatService, history.length]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center">
                  チャット履歴
                  <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>
                <div className="mt-4 max-h-96 overflow-y-auto">
                  {isLoading ? (
                     <div className="space-y-2">
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                     </div>
                  ) : (
                    <ul className="space-y-4">
                      {history.map(msg => (
                        <li key={msg.id} className="text-sm">
                           <p className={`font-semibold ${msg.role === 'user' ? 'text-blue-600' : 'text-gray-700'}`}>{msg.role === 'user' ? 'あなた' : 'ボット'}</p>
                           <p className="text-gray-600 bg-gray-100 p-2 rounded-md mt-1">{msg.text}</p>
                        </li>
                      ))}
                    </ul>
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
