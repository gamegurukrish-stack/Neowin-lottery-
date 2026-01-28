import React from 'react';
import { Home, Activity, User, Gift } from 'lucide-react';
import { Tab } from '../types';
import clsx from 'clsx';
import { playClick } from '../services/soundService';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: Tab, icon: React.ElementType, label: string }[] = [
    { id: 'HOME', icon: Home, label: 'Home' },
    { id: 'ACTIVITY', icon: Activity, label: 'Activity' },
    { id: 'PROMOTION', icon: Gift, label: 'Promotion' },
    { id: 'ACCOUNT', icon: User, label: 'Account' },
  ];

  const handleTabClick = (id: Tab) => {
      playClick();
      onTabChange(id);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-gray-800 pb-safe pt-2 px-2 z-50">
      <div className="flex justify-around items-end">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="flex flex-col items-center gap-1 p-2 w-full transition-all active:scale-95"
            >
              <div className={clsx(
                  "p-1.5 rounded-full transition-all duration-300",
                  isActive ? "bg-primary/20 -translate-y-1" : "bg-transparent"
              )}>
                  <tab.icon 
                    size={isActive ? 24 : 20} 
                    className={clsx(
                        "transition-colors",
                        isActive ? "text-primary" : "text-gray-500"
                    )} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
              </div>
              <span className={clsx(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-gray-500"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;