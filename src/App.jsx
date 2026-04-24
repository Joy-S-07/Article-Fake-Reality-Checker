import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNavBar from './components/TopNavBar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import VerificationPage from './pages/VerificationPage';
import CursorTracker from './components/CursorTracker';

function PlaceholderPage({ title }) {
  return (
    <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-24 px-8 relative z-10 w-full max-w-[1440px] mx-auto min-h-screen">
      <div className="text-center mb-12 relative z-20">
        <h1 className="font-h1 text-h1 text-on-surface mb-2 drop-shadow-md">{title}</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          This page is under construction.
        </p>
      </div>
    </main>
  );
}

function App() {
  return (
    <Router>
      <CursorTracker />
      <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col relative overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
        <TopNavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/dashboard" element={<PlaceholderPage title="User Dashboard" />} />
          <Route path="/about" element={<PlaceholderPage title="About TruthLens" />} />
          <Route path="/signin" element={<PlaceholderPage title="Sign In" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
