"use client";

import React, { useRef } from 'react';
import { useIsVisible } from '~/lib/useIsVisible';

interface TimingOptions {
    delay?: number;
    duration?: number;
}

interface ScrollAnimateProps {
    children: React.ReactNode;
    opacity?: boolean;
    slideUp?: boolean;
    slideDown?: boolean;
    scaleUp?: boolean;
    scaleDown?: boolean;
    threshold?: number;
    keepState?: boolean;
    rotateIn?: boolean;
    rotateOut?: boolean;
    timing?: TimingOptions;
}

const ScrollAnimate: React.FC<ScrollAnimateProps> = ({
    children,
    opacity = false,
    scaleUp = false,
    scaleDown = false,
    slideUp = false,
    slideDown = false,
    keepState = true,
    rotateIn = false,
    rotateOut = false,
    timing = {},
    threshold = 1,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isVisible = useIsVisible(containerRef, { threshold, triggerOnce: keepState });

    const { delay = 0, duration = 300 } = timing;

    // Container styles
    const containerStyle: React.CSSProperties = {
        height: '100%',
        width: '100%',
        perspective: rotateIn || rotateOut ? '1000px' : 'none', // Apply perspective here
    };

    // Inner div styles for animation
    const innerStyle: React.CSSProperties = {
        transitionProperty: 'opacity, transform',
        transitionTimingFunction: 'cubic-bezier(.25,.79,.45,.97)',
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        opacity: opacity ? (isVisible ? 1 : 0) : 1,
        transform: '',
        height: '100%',
        width: '100%',
        position: 'relative', // Relative positioning within the span container
    };

    if (slideUp) {
        innerStyle.transform += ` translateY(${isVisible ? '0' : '40%'})`;
    }

    if (slideDown) {
        innerStyle.transform += ` translateY(${isVisible ? '0' : '-40%'})`;

    }

    if (scaleUp) {
        innerStyle.transform += ` scale(${isVisible ? 1 : 0.8})`;
    }

    if (scaleDown) {
        innerStyle.transform += ` scale(${isVisible ? 1 : 1.2})`;
    }
    if (rotateIn) {
        innerStyle.transform += ` rotateX(${isVisible ? '360deg' : '330deg'})`;
    }
    if (rotateOut) {
        innerStyle.transform += ` rotateX(${isVisible ? '0deg' : '30deg'})`;
    }

    return (
        <div ref={containerRef} style={containerStyle}>
            <div style={innerStyle}>
                {children}
            </div>
        </div>
    );
};

export default ScrollAnimate;
