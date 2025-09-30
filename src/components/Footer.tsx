import React from 'react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-t from-card via-background to-background border-t border-border/50">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="NextGen Retreats" className="h-10 w-auto" />
                <div>
                  <h3 className="font-bold text-lg">NextGen Retreats</h3>
                  <p className="text-xs text-muted-foreground">Modern tech, thoughtful design, responsive hosting.</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Elevated stays powered by modern tech, thoughtful design, and responsive hosting.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Links</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => scrollToSection('photos')}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Photos
                </button>
                <button 
                  onClick={() => scrollToSection('availability')}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Availability
                </button>
                <button 
                  onClick={() => scrollToSection('location')}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Location
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>

            {/* Policies */}
            <div>
              <h4 className="font-semibold mb-4">Policies</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <div className="font-medium">• No parties or events</div>
                  <div className="text-xs">Quiet hours 10pm-8am</div>
                </div>
                <div>
                  <div className="font-medium">• No smoking</div>
                  <div className="text-xs">Indoor and outdoor areas</div>
                </div>
                <div>
                  <div className="font-medium">• Security deposit may be required</div>
                  <div className="text-xs">Refunded after checkout</div>
                </div>
                <div>
                  <div className="font-medium">• Local TOT collected per city rules</div>
                  <div className="text-xs">Transient occupancy tax</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-muted-foreground">
                © 2025 NextGen Retreats. All rights reserved.
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-primary">$295</div>
                <span className="text-muted-foreground">/ night</span>
                <Button 
                  variant="hero" 
                  size="sm"
                  onClick={() => scrollToSection('availability')}
                >
                  Dates
                </Button>
              </div>
            </div>
            
            <div className="mt-4 text-center text-xs text-muted-foreground">
              No exact address shown • Near Big Bear Lake
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;