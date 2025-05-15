import { AppHeader } from '@/components/binbrain/header';
import { AppFooter } from '@/components/binbrain/footer';
import { DustbinSimulationSection } from '@/components/binbrain/dustbin-simulation-section';
import { WasteSuggestionsSection } from '@/components/binbrain/waste-suggestions-section';
import { WasteSortingGuideSection } from '@/components/binbrain/waste-sorting-guide-section';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow">
        <DustbinSimulationSection />
        <WasteSuggestionsSection />
        <WasteSortingGuideSection />
      </main>
      <AppFooter />
    </div>
  );
}
