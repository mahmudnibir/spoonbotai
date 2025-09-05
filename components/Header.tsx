
import React, { useState, useRef, useEffect } from 'react';
import type { Page } from '../App';
import { ChefHatIcon } from './icons/ChefHatIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { LinkIcon } from './icons/LinkIcon';
import { MailIcon } from './icons/MailIcon';
import { UserIcon } from './icons/UserIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { NewspaperIcon } from './icons/NewspaperIcon';


interface HeaderProps {
  onNavigate: (page: Page) => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, className }) => {
  const [isInviteMenuOpen, setIsInviteMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [copyLinkText, setCopyLinkText] = useState('Copy Link');
  const inviteMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inviteMenuRef.current && !inviteMenuRef.current.contains(event.target as Node)) {
        setIsInviteMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://spoonbot.netlify.app').then(() => {
      setCopyLinkText('Copied!');
      setTimeout(() => setCopyLinkText('Copy Link'), 2000);
    }).catch(err => {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link.');
    });
    setTimeout(() => setIsInviteMenuOpen(false), 300); // Close after a short delay
  };

  const handleInviteByEmail = () => {
    const email = window.prompt("Please enter your friend's email address:");
    if (email) {
      const subject = encodeURIComponent("You should try Spoonbot AI!");
      const body = encodeURIComponent(`Hey,\n\nCheck out this cool app that creates recipes from ingredients you have at home: https://spoonbot.netlify.app`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
    setIsInviteMenuOpen(false);
  };

  const handleProfileMenuClick = (page: Page) => {
    onNavigate(page);
    setIsProfileMenuOpen(false);
  }

  return (
    <header className={`bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-stone-200 ${className ?? ''}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center gap-1 sm:gap-2">
            <div ref={inviteMenuRef} className="relative">
              <button
                onClick={() => setIsInviteMenuOpen(!isInviteMenuOpen)}
                className="flex items-center gap-2 text-stone-600 font-semibold py-2 px-3 rounded-full text-sm hover:bg-stone-100 hover:text-stone-800 transition-all"
                aria-label="Invite a Friend"
              >
                <UserPlusIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Invite</span>
              </button>
              {isInviteMenuOpen && (
                 <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-stone-200 animate-fade-in-down">
                   <ul className="py-1">
                     <li>
                       <button
                         onClick={handleCopyLink}
                         className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-100"
                       >
                         <LinkIcon className="h-4 w-4" />
                         <span>{copyLinkText}</span>
                       </button>
                     </li>
                     <li>
                       <button
                         onClick={handleInviteByEmail}
                         className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-100"
                       >
                         <MailIcon className="h-4 w-4" />
                         <span>Invite via Email</span>
                       </button>
                     </li>
                   </ul>
                 </div>
              )}
            </div>
             <button
              onClick={() => onNavigate('blog')}
              className="flex items-center gap-2 text-stone-600 font-semibold py-2 px-3 rounded-full text-sm hover:bg-stone-100 hover:text-stone-800 transition-all"
              aria-label="Blog"
            >
              <NewspaperIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Blog</span>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <button onClick={() => onNavigate('main')} className="flex items-center space-x-3 group text-center">
              <ChefHatIcon className="h-8 w-8 text-emerald-600 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold tracking-tight text-stone-800 leading-tight">
                  Spoonbot <span className="text-emerald-600">AI</span>
                </h1>
                <p className="text-xs text-stone-500 tracking-wide">5-Star Recipes in Your Hands</p>
              </div>
            </button>
          </div>
          <div className="flex-1 flex justify-end items-center gap-1 sm:gap-2">
            <button
              onClick={() => onNavigate('saved')}
              className="flex items-center gap-2 text-stone-600 font-semibold py-2 px-4 rounded-full text-sm hover:bg-stone-100 hover:text-stone-800 transition-all"
              aria-label="View Saved Recipes"
            >
              <BookmarkIcon className="h-5 w-5" />
              <span className="hidden sm:inline">My Recipes</span>
            </button>
            <div ref={profileMenuRef} className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="p-2 text-stone-600 rounded-full hover:bg-stone-100 hover:text-stone-800 transition-all"
                aria-label="Open Profile Menu"
              >
                <UserIcon className="h-6 w-6" />
              </button>
              {isProfileMenuOpen && (
                 <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-stone-200 animate-fade-in-down">
                   <ul className="py-1">
                      <li className="px-4 py-2 text-sm text-stone-500 border-b border-stone-200">user@example.com</li>
                      <li>
                        <button onClick={() => handleProfileMenuClick('history')} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-100">
                          <HistoryIcon className="h-4 w-4" />
                          <span>Recipe History</span>
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleProfileMenuClick('settings')} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-100">
                          <SettingsIcon className="h-4 w-4" />
                          <span>Settings</span>
                        </button>
                      </li>
                       <li>
                        <button onClick={() => handleProfileMenuClick('account')} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-100">
                          <UserIcon className="h-4 w-4" />
                          <span>Account</span>
                        </button>
                      </li>
                   </ul>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
