import Navbar from '@/components/landing/Navbar';
import AboutUs from '@/components/landing/AboutUs';
import MissionVision from '@/components/landing/MissionVision';
import ContactUs from '@/components/landing/ContactUs';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-sans overflow-x-hidden pt-20">
      <div className="fixed top-0 w-full z-50 bg-white">
        <Navbar />
      </div>
      <div className="pt-8">
        <AboutUs />
        <MissionVision />
        <ContactUs />
      </div>
    </main>
  );
}
