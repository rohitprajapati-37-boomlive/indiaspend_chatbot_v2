import { useState, useEffect } from "react";
import { fetchMetaTitle, getDomain } from "../utils/utils";

const IframeComponent = ({ iframeInfo }) => {
  const [metaTitle, setMetaTitle] = useState("Loading...");

  useEffect(() => {
    const fetchTitle = async () => {
      if (iframeInfo?.iframeSource) {
        const title = await fetchMetaTitle(iframeInfo.iframeSource);
        setMetaTitle(title);
      }
    };
    fetchTitle();
  }, [iframeInfo?.iframeSource]); // Depend only on iframeSource

  return (
    <div className="iframe-coner">
      <iframe
        className="responsive-iframe"
        src={iframeInfo.iframeLink}
        // width="auto"
        // height="auto"
        // scrolling="no"
        title="Scraped Chart"
      />
      <p className="txt-source-url ttl-url-sour" style={{ marginTop: "20px" }}>
        <span>Click on below link to know more 👇</span>
        <a
          href={iframeInfo.iframeSource}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "blue" }}
        >
          {metaTitle} ({getDomain(iframeInfo.iframeSource)})
        </a>
      </p>
    </div>
  );
};

export default IframeComponent;
