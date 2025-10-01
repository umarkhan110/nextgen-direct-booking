import React from 'react';
import { Card } from '@/components/ui/card';

const PhotoGallery = () => {
  // Placeholder photo URLs from the tour site mentioned by user
  const photoCategories = [
    {
      title: "Mountain Cabin",
      description: "Exterior views and architecture",
      image: "https://tours.tourfactory.com/tours/tour.asp?t=3190884&idx=1",
      isPlaceholder: true
    },
    {
      title: "Living Room",
      description: "Comfortable seating and fireplace",
      image: "https://tours.tourfactory.com/tours/tour.asp?t=3190884&idx=2",
      isPlaceholder: true
    },
    {
      title: "Kitchen",
      description: "Fully equipped for groups",
      image: "https://tours.tourfactory.com/tours/tour.asp?t=3190884&idx=3",
      isPlaceholder: true
    },
    {
      title: "Master Bedroom",
      description: "King bed with mountain views",
      image: "https://tours.tourfactory.com/tours/tour.asp?t=3190884&idx=4",
      isPlaceholder: true
    },
    {
      title: "Additional Bedrooms",
      description: "Comfortable sleeping for all",
      image: "https://tours.tourfactory.com/tours/tour.asp?t=3190884&idx=5",
      isPlaceholder: true
    },
    {
      title: "Billiards Room",
      description: "Professional pool table",
      image: "https://tours.tourfactory.com/tours/tour.asp?t=3190884&idx=6",
      isPlaceholder: true
    },
    {
      title: "Ping Pong Area",
      description: "Entertainment for all ages",
      image: "https://tours.tourfactory.com/tours/tour.asp?t=3190884&idx=7",
      isPlaceholder: true
    },
    {
      title: "Hot Tub",
      description: "Private outdoor jacuzzi",
      image: "https://tours.tourfactory.com/tours/tour.asp?t=3190884&idx=8",
      isPlaceholder: true
    }
  ];

  return (
    <section id="photos" className="py-20 bg-muted/10">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                Photos
              </h2>
              <p className="text-muted-foreground">
                Explore every corner of your mountain retreat
              </p>
            </div>
            {/* <div className="hidden md:flex items-center space-x-4">
              <button className="px-4 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors">
                Upload Images
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
                Go to Hero
              </button>
            </div> */}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {photoCategories.map((category, index) => (
              <Card key={index} className="group overflow-hidden border-border/50 hover:shadow-card transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                  {/* Placeholder for now - will be replaced with actual photos */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3 mx-auto">
                        📸
                      </div>
                      <div className="text-sm font-medium text-foreground/80">
                        Photo Coming Soon
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Upload Section for Admin */}
          {/* <div className="mt-12 p-8 border-2 border-dashed border-border rounded-xl text-center bg-card/50">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">Add Images</h3>
              <p className="text-muted-foreground mb-6">
                Upload professional photos to showcase your property
              </p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="url-input" className="block text-sm font-medium mb-2">
                    Add image by URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="url-input"
                      type="url"
                      placeholder="https://.../photo.jpg"
                      className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-sm"
                    />
                    <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80 transition-colors">
                      Add
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Bulk import (one URL per line)
                  </p>
                  <textarea
                    placeholder="https://.../img1.jpg&#10;https://.../img2.jpg"
                    className="w-full h-20 px-3 py-2 border border-input rounded-md bg-background text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;