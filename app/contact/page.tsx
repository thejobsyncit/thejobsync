import Navbar from '@/components/landing/Navbar';
import ContactUs from '@/components/landing/ContactUs';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white font-sans overflow-x-hidden pt-20">
      <div className="fixed top-0 w-full z-50 bg-white">
        <Navbar />
      </div>
      <div className="pt-8">
        <ContactUs />
      </div>
    </main>
  );
}
