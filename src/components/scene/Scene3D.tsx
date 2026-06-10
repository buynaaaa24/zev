import React from "react";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

export function MacbookScrollDemo({
  src,
  tabletSrc,
  mobileSrc,
}: {
  src?: string;
  tabletSrc?: string;
  mobileSrc?: string;
}) {
  return (
    <div className="w-full overflow-hidden bg-transparent">
      <MacbookScroll
     
        badge={
          <a href="https://peerlist.io/manuarora">
            <Badge className="h-10 w-10 -rotate-12 transform" />
          </a>
        }
        src={src || `/images/pos.jpg`}
        tabletSrc={tabletSrc}
        mobileSrc={mobileSrc || `/images/posapp.jpg`}
        showGradient={false}
      />
    </div>
  );
}
const Badge = ({ className }: { className?: string }) => {
  return (
    <img
      src="/posease-logo.jpg"
      alt="PosEase"
      className={className}
      draggable={false}
    />
  );
};

export default MacbookScrollDemo;
