import nsdLogo from '../assets/NSDLOGO.png';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

export default function Loader({ size = 'md', fullScreen = false }: LoaderProps) {
    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32',
    };

    const content = (
        <div className="flex flex-col items-center justify-center">
            <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
                {/* Pulsing Ring Effect */}
                <div className="absolute inset-0 rounded-full bg-[#d84315] opacity-20 animate-ping"></div>

                {/* Logo Image */}
                <div className="relative z-10 p-2">
                    <img src={nsdLogo} alt="Loading..." className="w-full h-full object-contain animate-pulse" />
                </div>
            </div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-[#fff8f0] z-50 flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
}
