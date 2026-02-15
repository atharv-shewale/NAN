import { useAppStore } from './store/useAppStore';
import { WelcomeScreen } from './components/Welcome/WelcomeScreen';
import { InteractiveCake } from './components/Cake/InteractiveCake';
import { WishBox } from './components/Wishes/WishBox';
import { WishingCard } from './components/Wishes/WishingCard';
import { CountdownTimer } from './components/Countdown/CountdownTimer';
import { PuzzleVault } from './components/Vault/PuzzleVault';
import { MemoryTimeline } from './components/Timeline/MemoryTimeline';
import { Scrapbook } from './components/Timeline/Scrapbook';
import { FloatingBalloons } from './components/Extras/FloatingBalloons';
import { ButterflyStorm } from './components/Effects/ButterflyStorm';
import { BirthdayCard } from './components/Extras/BirthdayCard';
import { VirtualBouquet } from './components/Flower/VirtualBouquet';
import { BucketList } from './components/Extras/BucketList';

function App() {
  const currentScene = useAppStore((state) => state.currentScene);

  const renderScene = () => {
    switch (currentScene) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'interactive-cake':
        return <InteractiveCake />;
      case 'wish':
        return <WishBox />;
      case 'wishing-card':
        return <WishingCard />;
      case 'countdown':
        return <CountdownTimer />;
      case 'vault':
        return <PuzzleVault />;
      case 'timeline':
        return <MemoryTimeline />;
      case 'scrapbook':
        return <Scrapbook />;
      case 'balloons':
        return <FloatingBalloons />;
      case 'bouquet':
        return <VirtualBouquet />;
      case 'bucket-list':
        return <BucketList />;
      case 'card':
        return <BirthdayCard />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderScene()}
      <ButterflyStorm isActive={currentScene === 'welcome' || currentScene === 'vault'} />
    </div>
  );
}

export default App;
