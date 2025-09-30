"use client";
import Hero from '@/components/Hero';
import Details from '@/components/Details';
import PhotoGallery from '@/components/PhotoGallery';
import Availability from '@/components/Availability';
import Location from '@/components/Location';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Details />
      <PhotoGallery />
      <Availability />
      <Location />
      <Contact />
      <Footer />
    </div>
  );
}
