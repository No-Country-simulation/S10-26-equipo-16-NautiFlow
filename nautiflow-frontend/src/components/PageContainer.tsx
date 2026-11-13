import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  wide?: boolean;
}

export default function PageContainer({
  children,
  wide = false,
}: PageContainerProps) {
  return (
    <div className="flex w-full flex-1 justify-center py-6 sm:py-8 lg:py-10">
      <div
        className={`w-full min-w-0 px-4 sm:px-6 lg:px-8 ${
          wide ? "max-w-none" : "max-w-7xl"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
