import { Droplets } from 'lucide-react';

const Logo = ({ className }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <Droplets className="h-7 w-7 text-primary" />
    <span className="text-2xl font-bold tracking-tight">iDonate</span>
  </div>
);

export default Logo;
