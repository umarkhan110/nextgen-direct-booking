import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Mountain, Car, TreePine, Snowflake } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
mapboxgl.accessToken = mapboxToken;

const BIG_BEAR_COORDS = { lng: -116.9425, lat: 34.2439 };

const Location = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
    if (!mapContainer.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [BIG_BEAR_COORDS.lng, BIG_BEAR_COORDS.lat],
      zoom: 11,
    });

    new mapboxgl.Marker()
      .setLngLat([BIG_BEAR_COORDS.lng, BIG_BEAR_COORDS.lat])
      .addTo(map);

    return () => map.remove();
  }, []);
  return (
    <section id="location" className="py-20 bg-muted/10">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Location
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Near Big Bear Lake, CA • Exact address shared after booking
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Map */}
            <div className="order-2 lg:order-1">
              <div
                ref={mapContainer}
                style={{ width: '100%', height: '350px', borderRadius: '12px', overflow: 'hidden' }}
              />
              {/* <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-card">
                Static Map Placeholder - No zoom controls as requested
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                      <div className="text-lg font-semibold mb-2">Big Bear Lake Area</div>
                      <div className="text-sm text-muted-foreground">
                        Static map showing general location
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Exact address provided after booking
                      </div>
                    </div>
                  </div>
                  
                  Decorative Map Elements
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <div className="text-xs text-foreground/70">Your Retreat</div>
                  </div>
                  
                  <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                    🏔️ Mountain Views
                  </div>
                </div>
              </Card> */}
            </div>

            {/* Location Details */}
            <div className="order-1 lg:order-2 space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Perfect Mountain Location</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Nestled in the San Bernardino Mountains near Big Bear Lake, our retreat offers 
                  the perfect balance of seclusion and accessibility. Experience pristine mountain 
                  air while being just minutes from outdoor adventures and local attractions.
                </p>
              </div>

              {/* Nearby Attractions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-card/50 border-border/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Snowflake className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Ski Resorts</div>
                      <div className="text-xs text-muted-foreground">15-20 min drive</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-card/50 border-border/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mountain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Big Bear Lake</div>
                      <div className="text-xs text-muted-foreground">10 min drive</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-card/50 border-border/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TreePine className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Village Shopping</div>
                      <div className="text-xs text-muted-foreground">12 min drive</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-card/50 border-border/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Hiking Trails</div>
                      <div className="text-xs text-muted-foreground">Walking distance</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Access Information */}
              <Card className="p-6 bg-gradient-card border-border/50">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Car className="h-5 w-5 mr-2 text-primary" />
                  Getting There
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 2 hours from Los Angeles/Orange County</li>
                  <li>• 30 minutes from San Bernardino</li>
                  <li>• Multiple vehicle parking available</li>
                  <li>• All-weather road access</li>
                  <li>• Chain requirements in winter months</li>
                </ul>
              </Card>

              {/* Privacy Note */}
              <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-sm font-medium text-accent-foreground mb-1">
                  🔒 Privacy Protected
                </div>
                <div className="text-xs text-muted-foreground">
                  Exact address shared after booking confirmation for security
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;