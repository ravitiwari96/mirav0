import { useState } from "react";
import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

// Easily editable video configuration
const videos = [
  {
    id: 1,
    youtubeId: "bidYqqJQEpI",
    isShort: true,
    title: "My Sustainable Journey with MIRAVO",
    author: "MIRAVO Community",
    role: "Sustainable Lifestyle",
  },
  {
    id: 2,
    youtubeId: "3qqw6yykL5Y",
    isShort: false,
    title: "MIRAVO Product Story",
    author: "MIRAVO Official",
    role: "Eco-Friendly Homeware",
  },
];

const getYouTubeThumbnail = (videoId: string) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

const getEmbedUrl = (videoId: string, isShort: boolean) => {
  const baseUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `${baseUrl}?${params.toString()}`;
};

const VideoTestimonials = () => {
  const [activeVideo, setActiveVideo] = useState<typeof videos[0] | null>(null);

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">
            Real Stories from Our Community
          </h2>
          <p className="text-lg text-muted-foreground">
            Watch how our customers and influencers are making a difference with MIRAVO
          </p>
        </div>

        {/* Videos Grid - 2 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {videos.map((video, index) => (
            <Card
              key={video.id}
              className="overflow-hidden border-border/50 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setActiveVideo(video)}
            >
              {/* Thumbnail with play button */}
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={getYouTubeThumbnail(video.youtubeId)}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-2">
                <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium">{video.author}</div>
                  <div className="text-xs">{video.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={!!activeVideo} onOpenChange={() => setActiveVideo(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-black border-none overflow-hidden">
          <DialogTitle className="sr-only">
            {activeVideo?.title || "Video"}
          </DialogTitle>
          {activeVideo && (
            <div className={`relative ${activeVideo.isShort ? 'aspect-[9/16] max-h-[80vh] mx-auto' : 'aspect-video'}`}>
              <iframe
                src={getEmbedUrl(activeVideo.youtubeId, activeVideo.isShort)}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                loading="lazy"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VideoTestimonials;
