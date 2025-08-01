/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recentWorksApi } from "@/services/api";
import { useEffect, useState } from "react";

export const Portfolio = () => {
  const [recentWorks, setRecentWorks] = useState<any[]>([]);
  useEffect(() => {
        const fetchRecentImages = async () => {
          try {
            const data = await recentWorksApi.getAll(); 
            const formatted = data.map((item: any) => ({
              id: item._id,
              url: item.base64 || item.image,
              title: item.title || item.filename,
              category: item.category || "Uncategorized",
            }));
            setRecentWorks(formatted);
          } catch (error) {
            console.error("Failed to load gallery images:", error);
          }
        };
        fetchRecentImages();
      }, []);

  const handleInstagram = () => {
    window.open("https://www.instagram.com/kiranwesley_photography/", "_blank");
  };

  const handleYoutube = () => {
    window.open("https://www.youtube.com/@kiran_wesley", "_blank");
  };

  return (
    <section id="portfolio" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">My Recent Work</h2>
          <p className="text-xl text-gray-600">Showcasing our latest photography and videography projects</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {recentWorks.map((item, index) => (
            <Card key={index} className="group overflow-hidden hover:shadow-2xl transition-all duration-500">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-300 mb-4">{item.category}</p>
                      <a 
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-yellow-400 hover:text-yellow-300"
                      >
                        View More →
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Follow Our Journey</h3>
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleInstagram}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Instagram className="mr-2" size={20} />
              Follow on Instagram
            </Button>
            
            <Button
              onClick={handleYoutube}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Youtube className="mr-2" size={20} />
              Subscribe on YouTube
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
