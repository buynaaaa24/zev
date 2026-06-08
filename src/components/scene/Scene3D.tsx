import React from "react";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

export function MacbookScrollDemo() {
  return (
    <div className="w-full overflow-hidden bg-transparent">
      <MacbookScroll
     
        badge={
          <a href="https://peerlist.io/manuarora">
            <Badge className="h-10 w-10 -rotate-12 transform" />
          </a>
        }
        src={`/images/pos.jpg`}
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
