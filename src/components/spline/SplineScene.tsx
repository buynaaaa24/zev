"use client";

import { memo, useState } from "react";

const SPLINE_URL = "https://prod.spline.design/F14GRuE8VQTbHbre/scene.splinecode";

// Inline HTML that loads Spline once inside an isolated iframe.
// React cannot touch the iframe's DOM — no remounts, no refetches.
const iframeHTML = `<!DOCTYPE html>
<html style="margin:0;padding:0;width:100%;height:100%;background:transparent;overflow:hidden">
<head>
  <meta charset="utf-8"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body { width:100%; height:100%; background:transparent; overflow:hidden; }
    spline-viewer { width:100%; height:100%; --background-color:transparent; }
    #loader {
      position:absolute; inset:0; display:flex; flex-direction:column;
      align-items:center; justify-content:center; gap:12px; background:#0a0a0a;
      transition: opacity 0.6s ease;
    }
    #loader.hidden { opacity:0; pointer-events:none; }
    .spinner {
      width:36px; height:36px; border-radius:50%;
      border:2px solid rgba(255,68,105,0.2);
      border-top-color:rgb(255,68,105);
      animation: spin 0.8s linear infinite;
    }
    .label { color:rgba(255,255,255,0.2); font-family:sans-serif; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; }
    @keyframes spin { to { transform:rotate(360deg); } }
  </style>
</head>
<body>
  <div id="loader">
    <div class="spinner"></div>
    <span class="label">Loading</span>
  </div>
  <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"></script>
  <spline-viewer
    url="${SPLINE_URL}"
    background="transparent"
    loading-anim-type="none"
    events-target="global"
  ></spline-viewer>
  <script>
    const viewer = document.querySelector('spline-viewer');
    const loader = document.getElementById('loader');
    viewer.addEventListener('load', () => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 700);
    });
  </script>
</body>
</html>`;

const srcDoc = iframeHTML;

const SplineScene = memo(function SplineScene() {
  return (
    <iframe
      srcDoc={srcDoc}
      allow="autoplay"
      scrolling="no"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        background: "transparent",
        display: "block",
      }}
      // key is intentionally OMITTED — never give this iframe a changing key
    />
  );
});

export default SplineScene;