'use client';

import { useState } from 'react';
import FadeUp from '../ui/FadeUp';
import VideoPlayer from '../ui/VideoPlayer';
import { featuredVideos, operationVideos } from '@/lib/data/videos';

export default function VideoShowcase() {
  const [selectedVideo, setSelectedVideo] = useState(featuredVideos[0]);

  return (
    <section id="video-showcase" className="relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeUp>
          <div className="text-center mb-16">
            <p className="text-accent text-sm sm:text-base mb-4 uppercase tracking-wider font-semibold">
              See It In Action
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Video Demonstrations
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Watch the complete build process and see all operations in action
            </p>
          </div>
        </FadeUp>

        {/* Main Video Player */}
        <FadeUp delay={0.2}>
          <div className="mb-12">
            <VideoPlayer
              src={selectedVideo.src}
              poster={selectedVideo.poster}
              title={selectedVideo.title}
              className="w-full aspect-video"
            />
            <div className="mt-4 glass glass-border rounded-lg p-4">
              <h3 className="text-xl font-bold text-foreground mb-2">{selectedVideo.title}</h3>
              <p className="text-muted-foreground">{selectedVideo.description}</p>
            </div>
          </div>
        </FadeUp>

        {/* Featured Videos */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6">Featured Videos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVideos.map((video, index) => (
              <FadeUp key={video.id} delay={0.1 * index}>
                <div
                  className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
                    selectedVideo.id === video.id
                      ? 'ring-4 ring-accent scale-105'
                      : 'hover:scale-102'
                  }`}
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative aspect-video">
                    <img
                      src={video.poster || '/media/hero/hero_system_photo.png'}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* Duration Badge */}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs font-medium">
                        {video.duration}
                      </div>
                    )}
                  </div>
                  <div className="glass glass-border p-4">
                    <h4 className="font-semibold text-foreground mb-1">{video.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* Operation Demonstrations */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">Operation Demonstrations</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {operationVideos.map((video, index) => (
              <FadeUp key={video.id} delay={0.05 * index}>
                <div
                  className="cursor-pointer rounded-lg overflow-hidden hover:scale-105 transition-transform"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative aspect-square bg-white/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-accent ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-white text-xs">
                        {video.duration}
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-white/5">
                    <p className="text-sm font-medium text-foreground text-center">{video.title}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
