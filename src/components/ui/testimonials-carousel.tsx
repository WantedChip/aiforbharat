"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

export interface Testimonial {
    text: string;
    highlight?: string;
    image?: string;
    initials?: string;
    icon?: React.ReactNode;
    name: string;
    role: string;
}

interface TestimonialsCarouselProps {
    testimonials: Testimonial[];
    speed?: number; // Duration in seconds for one full scroll
    direction?: "left" | "right"; // Scroll direction
    cardHeight?: number; // Height of the testimonial card
    className?: string;
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
    testimonials,
    speed = 20,
    direction = "left",
    cardHeight = 200,
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [carouselWidth, setCarouselWidth] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            setCarouselWidth(containerRef.current.scrollWidth / 2);
        }
    }, [testimonials]);

    const loopTestimonials = [...testimonials, ...testimonials];

    return (
        <div className={`overflow-hidden w-full ${className}`} ref={containerRef}>
            <motion.div
                animate={{
                    x:
                        direction === "left"
                            ? [0, -carouselWidth]
                            : [-carouselWidth, 0],
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="flex gap-6"
            >
                {loopTestimonials.map(({ text, highlight, image, initials, icon, name, role }, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        className={`bg-white dark:bg-black my-3 border-2 shadow-md rounded-3xl p-4 shadow-lg flex-shrink-0 w-[320px]`}
                        style={{ height: cardHeight }}
                    >
                        <p className="text-sm leading-relaxed text-justify break-words whitespace-normal overflow-hidden">
                            {highlight
                                ? text.split(highlight).map((part, idx, arr) => (
                                    <React.Fragment key={idx}>
                                        {part}
                                        {idx !== arr.length - 1 && (
                                            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                                {highlight}
                                            </span>
                                        )}
                                    </React.Fragment>
                                ))
                                : text}
                        </p>

                        <div className="flex items-center gap-3 mt-4">
                            {image ? (
                                <img
                                    src={image}
                                    alt={name}
                                    width={50}
                                    height={50}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            ) : initials ? (
                                <div className="h-12 w-12 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                                    {initials}
                                </div>
                            ) : icon ? (
                                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                                    {icon}
                                </div>
                            ) : (
                                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 mt-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                            )}
                            <div className="flex flex-col">
                                <div className="font-medium leading-tight">{name}</div>
                                <div className="opacity-60 text-sm">{role}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};
