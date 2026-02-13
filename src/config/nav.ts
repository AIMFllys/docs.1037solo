import { Book, HelpCircle, MessageSquare, Bell, FileText, Zap } from 'lucide-react';

export const navItems = [
  { label: '常见问题', path: '/docs/faq', icon: HelpCircle },
  { label: '项目攻略', path: '/docs/guide', icon: Book },
  { label: '核心功能', path: '/docs/features', icon: Zap },
  { label: '更新日志', path: '/docs/changelog', icon: FileText },
  { label: '重要公告', path: '/docs/announcements', icon: Bell },
  { label: '反馈途径', path: '/docs/feedback', icon: MessageSquare },
];