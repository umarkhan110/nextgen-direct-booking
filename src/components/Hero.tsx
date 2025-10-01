import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rates, setRates] = useState(295);

  useEffect(() => {
    const fetchRates = async () => {
      const { data } = await supabase
        .from('rates')
        .select('base_rate')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data) setRates(Number(data.base_rate));
    };
    fetchRates();
  }, []);

  const slides = [
    {
      image: "/hero-1.jpg",
      title: "Modern Mountain Escape",
      subtitle: "Breathtaking views • Hot tub • Game room • Minutes to slopes"
    },
    {
      image: "/hero-2.jpg",
      title: "Luxury Retreat Experience",
      subtitle: "Premium amenities • Serene location • Perfect for groups"
    },
    {
      image: "/hero-3.jpg",
      title: "Entertainment & Relaxation",
      subtitle: "Billiards • Ping pong • Hot tub • Cozy fireplace"
    }
  ];

  // Small, non-intrusive feature chips (overlay)
  const features = [
    "Sleeps 10",
    "Hot Tub",
    "Game Room",
    "Breathtaking Views",
    "Minutes to Slopes"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

  const scrollToAvailability = () => {
    document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Navigation Header */}
      <nav className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Ensure /logo.png is a transparent PNG/SVG */}
              <Image
                src="/logo.png"
                alt="NextGen Retreats"
                width={48}
                height={48}
                className="h-12 w-auto bg-transparent"
                priority
              />
              <div>
                <h1 className="text-xl font-bold text-white">NextGen Retreats</h1>
                <p className="text-sm text-white/80">Modern stays • Tech-forward hosting</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-white">
              <a href="#photos" className="hover:text-white transition-colors">Photos</a>
              <a href="#availability" className="hover:text-white transition-colors">Availability</a>
              <a href="#location" className="hover:text-white transition-colors">Location</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
              <Button variant="hero" onClick={scrollToAvailability}>
                Book
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Slideshow */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Darker-blue → light-blue glass gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#001a4d]/70 via-transparent to-[#3ba3ff]/20" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white max-w-4xl px-6">
          <div className="mb-8">
            {/* Title with blue gradient */}
            <h2 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[#0a2a6b] via-[#1769ff] to-[#3ba3ff] bg-clip-text text-transparent">
              {slides[currentSlide].title}
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          <Button
            variant="hero"
            size="lg"
            onClick={scrollToAvailability}
            className="text-xl px-12 py-6"
          >
            Check Availability
          </Button>
        </div>
      </div>

      {/* Compact Feature Strip (non-blocking, reduces vertical scroll on mobile) */}
      <div className="absolute z-10 bottom-24 left-1/2 -translate-x-1/2 w-full px-6">
        <div className="mx-auto max-w-5xl overflow-x-auto no-scrollbar">
          <ul className="flex items-center gap-2 md:gap-3 w-max mx-auto">
            {features.map((f) => (
              <li
                key={f}
                className="text-xs md:text-sm rounded-full px-3 py-1 backdrop-blur-md bg-black/35 border border-white/10 text-white whitespace-nowrap"
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Location pill: 5-min walk note */}
      <div className="absolute top-20 right-4 md:right-8 z-10">
        <div className="rounded-full px-4 py-2 text-xs md:text-sm text-white backdrop-blur-md border border-white/10 bg-gradient-to-r from-[#0a2a6b]/70 to-[#3ba3ff]/40 shadow">
          ≈ 5-minute walk to lake • shops • dining
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Pricing Badge (blue-ish glass) */}
      <div className="absolute bottom-8 right-8 z-10">
        <div className="backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg bg-gradient-to-br from-[#0a2a6b]/70 to-[#3ba3ff]/30">
          <div className="text-right">
            <div className="text-3xl font-bold text-white">${rates}</div>
            <div className="text-sm text-white/80">/ night</div>
            <div className="text-xs text-white/80 mt-1">
              No exact address shown • Near Big Bear Lake
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
