import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InteractiveLab, type LabTabId } from './components/InteractiveLab';
import { ProjectsSection } from './components/ProjectsSection';
import { CapabilitiesAndBackground } from './components/CapabilitiesAndBackground';
import { ContactSection } from './components/ContactSection';

export default function App() {
  const [activeLabTab, setActiveLabTab] = useState<LabTabId>('analytics');

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main>
        <HeroSection onSelectLabTab={setActiveLabTab} />
        <ProjectsSection onLaunchLab={setActiveLabTab} />
        <InteractiveLab activeTab={activeLabTab} onTabChange={setActiveLabTab} />
        <CapabilitiesAndBackground />
        <ContactSection />
      </main>
    </div>
  );
}
