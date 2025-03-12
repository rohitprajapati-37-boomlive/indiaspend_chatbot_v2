import React, { useEffect, useState, useRef } from "react";

const RenderSources = ({ itemSources, loading }) => {
  const [uniqueSources, setUniqueSources] = useState([]);
  const sourcesRef = useRef(); // Reference for sources list

  useEffect(() => {
    if (itemSources?.final_response?.length) {
      // Remove duplicates based on post_url
      const filteredSources = itemSources.final_response.filter(
        (source, index, self) =>
          index === self.findIndex((s) => s.post_url === source.post_url)
      );
      setUniqueSources(filteredSources);
    }
  }, [itemSources]); // Effect runs whenever itemSources changes

  if (loading) {
    return (
      <div className="loading">
        <div className="skeleton-card">
          <div className="skeleton-loader"></div>
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
        </div>
      </div>
    );
  }

  if (!uniqueSources.length) {
    return null; // Return nothing if no sources
  }

  return (
    <ul ref={sourcesRef}>
      {uniqueSources.map((source, index) => (
        <li key={index} className="sources-tle-url">
          <div className="txt-source-url">
            <a href={source.post_url} target="_blank" rel="noopener noreferrer">
              <img
                src={source.preview_image_url}
                alt={source.title}
                className="source-image"
              />
              <span>{source.title || source.post_url}</span>
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RenderSources;
