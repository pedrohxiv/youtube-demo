"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { cn } from "@/lib/utils";
import { VideoBanner } from "@/modules/videos/ui/components/video-banner";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import { VideoTopRow } from "@/modules/videos/ui/components/video-top-row";
import { trpc } from "@/trpc/client";

interface Props {
  videoId: string;
}

export const VideoSection = ({ videoId }: Props) => {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<VideoSectionSkeleton />}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSuspense = ({ videoId }: Props) => {
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });

  return (
    <>
      <div
        className={cn(
          "aspect-video bg-black rounded-xl overflow-hidden relative",
          {
            "rounded-b-none": video.muxStatus !== "ready",
          }
        )}
      >
        <VideoPlayer
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
          autoPlay
          onPlay={() => {}}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
};

const VideoSectionSkeleton = () => {
  return null;
};
