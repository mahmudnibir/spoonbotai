import React from 'react';
import type { Page } from '../App';
import { CoffeeIcon } from './icons/CoffeeIcon';
import { MailIcon } from './icons/MailIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { InfoIcon } from './icons/InfoIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { FiverrIcon } from './icons/FiverrIcon';


interface FooterProps {
  onNavigate: (page: Page) => void;
  className?: string;
}


const Footer: React.FC<FooterProps> = ({ onNavigate, className }) => {
  return (
    <footer className={`py-6 text-center ${className ?? ''}`}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <button
            onClick={() => onNavigate('about')}
            className="flex items-center text-stone-500 hover:text-emerald-600 transition-colors duration-300"
          >
            <InfoIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">About Us</span>
          </button>
          <button
            onClick={() => onNavigate('how-to-use')}
            className="flex items-center text-stone-500 hover:text-emerald-600 transition-colors duration-300"
          >
            <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">How to Use</span>
          </button>
          <a 
            href="mailto:feedback@spoonbot.ai?subject=Feedback for Spoonbot AI"
            className="flex items-center text-stone-500 hover:text-emerald-600 transition-colors duration-300"
          >
            <MailIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Send Feedback</span>
          </a>
          <button
            onClick={() => onNavigate('terms')}
            className="flex items-center text-stone-500 hover:text-emerald-600 transition-colors duration-300"
          >
            <FileTextIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Terms of Service</span>
          </button>
          <button
            onClick={() => onNavigate('terms')}
            className="flex items-center text-stone-500 hover:text-emerald-600 transition-colors duration-300"
          >
            <ShieldIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Privacy Policy</span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <a href="https://www.facebook.com/nibirmahmud17" target="_blank" rel="noopener noreferrer" aria-label="Facebook Profile" className="text-stone-500 hover:text-emerald-600 transition-colors">
            <FacebookIcon className="h-6 w-6" />
          </a>
          <a href="https://www.fiverr.com/codepythonics" target="_blank" rel="noopener noreferrer" aria-label="Fiverr Profile" className="text-stone-500 hover:text-emerald-600 transition-colors">
            <FiverrIcon className="h-6 w-6" />
          </a>
          <a href="https://www.instagram.com/mahamudul_hasan_nibir" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile" className="text-stone-500 hover:text-emerald-600 transition-colors">
            <InstagramIcon className="h-6 w-6" />
          </a>
        </div>
        <p className="text-sm text-stone-500">
          &copy; {new Date().getFullYear()} Spoonbot AI. All recipes are AI-generated.
        </p>
      </div>
    </footer>
  );
};

export default Footer;