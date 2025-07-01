import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Error404() {

    const navigate = useNavigate()

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Generate floating particles
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            speed: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.3
        }));
        setParticles(newParticles);

        // Animate particles
        const animateParticles = () => {
            setParticles(prev => prev.map(particle => ({
                ...particle,
                y: particle.y > 100 ? -5 : particle.y + particle.speed * 0.1,
                x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.05
            })));
        };

        const interval = setInterval(animateParticles, 50);
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
        });
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center"
            onMouseMove={handleMouseMove}
        >
            {/* Animated background particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-white animate-pulse"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        opacity: particle.opacity,
                        transform: `translate(-50%, -50%)`
                    }}
                />
            ))}

            {/* Dynamic gradient overlay that follows mouse */}
            <div
                className="absolute inset-0 opacity-30 transition-all duration-300 ease-out"
                style={{
                    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`
                }}
            />

            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                {/* Main 404 Display */}
                <div className="relative mb-8">
                    <h1
                        className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse select-none"
                        style={{
                            textShadow: '0 0 40px rgba(139, 92, 246, 0.3)',
                            filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))'
                        }}
                    >
                        404
                    </h1>

                    {/* Floating shapes around 404 */}
                    <div className="absolute -top-4 -left-4 animate-bounce">
                        <div className="w-8 h-8 bg-yellow-400 rounded-lg rotate-45 shadow-lg"></div>
                    </div>
                    <div className="absolute -top-8 -right-8 animate-bounce delay-300">
                        <div className="w-6 h-6 bg-pink-400 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xs">✦</div>
                    </div>
                    <div className="absolute -bottom-4 left-1/4 animate-bounce delay-500">
                        <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-lg"></div>
                    </div>
                </div>

                {/* Error message with glassmorphism effect */}
                <div className="backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 p-8 mb-8 shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                        Oops! The page you're looking for seems to have wandered off into the digital void.
                        Don't worry though, even the best explorers sometimes take a wrong turn.
                    </p>

                    {/* Interactive search suggestion */}

                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => { navigate('/') }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white rounded-sm group-hover:rotate-12 transition-transform duration-300 flex items-center justify-center text-xs">🏠</div>
                            <span>Go Home</span>
                        </div>

                        {/* Ripple effect */}
                        {isHovered && (
                            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                        )}
                    </button>

                    <button
                        onClick={() => { navigate('/login') }}
                        className="group px-8 py-4 border-2 border-white/30 rounded-full font-semibold text-white hover:bg-white/10 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform duration-300 flex items-center justify-center">←</div>
                            <span>Log In</span>
                        </div>
                    </button>
                </div>

                {/* Decorative elements */}
                <div className="mt-12 flex justify-center gap-8 opacity-60">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom gradient glow */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-600/20 to-transparent" />
        </div>
    );
}