'use client';

import { Bot } from '@/types';
import { ChatProvider } from './ChatProvider';
import ChatUI from './ChatUI';

interface ChatPageClientProps {
  bot: Bot;
}

export default function ChatPageClient({ bot }: ChatPageClientProps) {
  if (!bot) {
    return <div>ボット情報の読み込みに失敗しました。</div>;
  }

  return (
    <ChatProvider botId={bot.id}>
      <ChatUI
        botId={bot.id}
        uiTheme={bot.ui_theme === 'business' || bot.ui_theme === 'variety' ? bot.ui_theme : null}
      />
    </ChatProvider>
  );
}