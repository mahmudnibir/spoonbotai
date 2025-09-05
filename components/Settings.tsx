import React from 'react';
import { GlobeIcon } from './icons/GlobeIcon';
import { ScaleIcon } from './icons/ScaleIcon';


interface SettingsProps {
  onNavigateBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigateBack }) => {

  const SettingRow = ({ icon, title, description, control }: { icon: React.ReactNode, title: string, description: string, control: React.ReactNode }) => (
    <div className="flex items-center justify-between py-4 border-b border-stone-200 last:border-b-0">
      <div className="flex items-center gap-4">
        <div className="text-emerald-600">{icon}</div>
        <div>
          <h4 className="font-semibold text-stone-800">{title}</h4>
          <p className="text-sm text-stone-500">{description}</p>
        </div>
      </div>
      <div>{control}</div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-stone-200 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-4">
        <h2 className="text-3xl font-bold text-emerald-800">Settings</h2>
         <button
          onClick={onNavigateBack}
          className="text-sm text-emerald-600 font-semibold hover:text-emerald-800 transition-colors"
        >
          &larr; Back to Generator
        </button>
      </div>

      <div className="space-y-4">
        <SettingRow
            icon={<GlobeIcon className="w-6 h-6" />}
            title="Language"
            description="Select your preferred language."
            control={<p className="text-sm text-stone-500">English</p>}
        />
         <SettingRow
            icon={<ScaleIcon className="w-6 h-6" />}
            title="Measurement Units"
            description="Choose Metric or Imperial units."
            control={<p className="text-sm text-stone-500">Imperial</p>}
        />
      </div>
    </div>
  );
};

// Placeholder icons for settings page
const GlobeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
);
const ScaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m16 16 3-8 3 8c-2 1-4 1-6 0" /><path d="M2 16l3-8 3 8c-2 1-4 1-6 0" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2" /><path d="M19 7h2" /></svg>
);


export default Settings;