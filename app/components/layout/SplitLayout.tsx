'use client';

type SplitLayoutProps = {
  children: React.ReactNode;
  imageSrc: string;
};

export default function SplitLayout({ children, imageSrc }: SplitLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Left Image Section */}
      <div
        className="flex-1 bg-gray-200"
        style={{
          backgroundImage: `url('${imageSrc}')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      {/* Right Content Section */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
