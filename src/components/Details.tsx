import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Users, 
  Bath,  
  Gamepad2, 
  Mountain, 
  Wifi, 
  Car,
  TreePine,
  UtensilsCrossed
} from 'lucide-react';

const Details = () => {
  const amenities = [
    { icon: Users, label: "Sleeps 10", description: "3BR • 2BA" },
    { icon: Bath, label: "Hot Tub", description: "Private outdoor spa" },
    { icon: Gamepad2, label: "Game Room", description: "Billiards & ping pong" },
    { icon: Mountain, label: "Breathtaking Views", description: "Panoramic mountain vistas" },
    { icon: Wifi, label: "Fast Wi-Fi", description: "High-speed internet" },
    { icon: UtensilsCrossed, label: "Full Kitchen", description: "Fully equipped for groups" },
    { icon: Car, label: "Parking", description: "Multiple vehicle spaces" },
    { icon: TreePine, label: "Forest Setting", description: "Surrounded by pines" }
  ];

  return (
    <section id="details" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Relaxed luxury in the pines
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Panoramic lake-and-forest views • Hot tub • Game room • Minutes to slopes & Village • 
              Professionally hosted.
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <Card key={index} className="p-6 bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 rounded-full bg-gradient-primary">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">{amenity.label}</h3>
                    <p className="text-sm text-muted-foreground">{amenity.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10</div>
              <div className="text-muted-foreground">Max Guests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <div className="text-muted-foreground">Bedrooms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">2</div>
              <div className="text-muted-foreground">Bathrooms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5★</div>
              <div className="text-muted-foreground">Host Rating</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            <a 
              href="#photos" 
              className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-foreground hover:bg-white/20 transition-all"
            >
              Browse Photos
            </a>
            <a 
              href="#availability" 
              className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-foreground hover:bg-white/20 transition-all"
            >
              Check Availability
            </a>
            <a 
              href="#contact" 
              className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-foreground hover:bg-white/20 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Details;