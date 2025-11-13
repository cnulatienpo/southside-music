import React, { useMemo, useState } from "react";
import styles from "./EmbeddedPlayer.module.css";
import { MediaExample } from "./TheoryCard";

interface EmbeddedPlayerProps extends MediaExample {
  onPlayed?: () => void;
}

const getYouTubeEmbedUrl = (url: string, autoplay: boolean) => {
  const videoIdMatch = url.match(/[?&]v=([^&#]+)/) || url.match(/youtu\.be\/([^?&#]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : undefined;

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=${autoplay ? 1 : 0}`;
  }

  if (url.includes("/embed/")) {
    return `${url}${url.includes("?") ? "&" : "?"}autoplay=${autoplay ? 1 : 0}`;
  }

  return url;
};

const getSoundCloudEmbedUrl = (url: string, autoplay: boolean) => {
  const base = "https://w.soundcloud.com/player/";
  const params = new URLSearchParams({
    url,
    color: "#f97316",
    auto_play: autoplay ? "true" : "false",
    hide_related: "false",
    show_comments: "true",
    show_user: "true",
    show_reposts: "false",
  });

  return `${base}?${params.toString()}`;
};

const EmbeddedPlayer: React.FC<EmbeddedPlayerProps> = ({
  title,
  artist,
  source,
  url,
  onPlayed,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const iframeSrc = useMemo(() => {
    if (!isPlaying) {
      return "";
    }

    if (source === "youtube") {
      return getYouTubeEmbedUrl(url, true);
    }

    return getSoundCloudEmbedUrl(url, true);
  }, [isPlaying, source, url]);

  const handlePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      onPlayed?.();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.meta}>
        <strong>{title}</strong>
        {artist && <span>{artist}</span>}
      </div>
      <div className={styles.playerArea}>
        {!isPlaying && (
          <button
            aria-label={`Play ${title}${artist ? ` by ${artist}` : ""}`}
            className={styles.overlay}
            onClick={handlePlay}
            type="button"
          >
            <span className={styles.playButton}>▶</span>
            <span>Press play to launch the {source === "youtube" ? "YouTube" : "SoundCloud"} player.</span>
          </button>
        )}
        {isPlaying && (
          <iframe
            className={styles.frame}
            src={iframeSrc}
            title={`${title}${artist ? ` by ${artist}` : ""}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

export default EmbeddedPlayer;
