'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const HOVER_SELECTOR =
  'a, button, input, select, textarea, label, [role="button"], [data-magnetic="true"]';

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (isTouchDevice) return;

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    let activeMagnet: HTMLElement | null = null;

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Magnetic pull for special buttons
      if (activeMagnet && activeMagnet.dataset.magnetic === 'true') {
        const rect = activeMagnet.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        gsap.to(activeMagnet, {
          x: dx * 0.18,
          y: dy * 0.18,
          duration: 0.5,
          ease: 'power3.out',
        });
        gsap.to(outer, {
          x: cx - 22 + dx * 0.4,
          y: cy - 22 + dy * 0.4,
          duration: 0.22,
          ease: 'power3.out',
        });
        gsap.to(inner, {
          x: x - 3,
          y: y - 3,
          duration: 0.08,
          ease: 'power3.out',
        });
        return;
      }

      gsap.to(outer, {
        x: x - 16,
        y: y - 16,
        duration: 0.18,
        ease: 'power3.out',
      });
      gsap.to(inner, {
        x: x - 3,
        y: y - 3,
        duration: 0.08,
        ease: 'power3.out',
      });
    };

    const onEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      activeMagnet = el;
      gsap.to(outer, {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255, 107, 53, 0.22)',
        borderColor: '#FF6B35',
        boxShadow: '0 0 28px 6px rgba(255,107,53,0.35)',
        duration: 0.35,
        ease: 'power2.out',
      });
      gsap.to(inner, {
        scale: 0,
        duration: 0.25,
        ease: 'power2.out',
      });
    };

    const onLeave = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      if (el.dataset.magnetic === 'true') {
        gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.4)' });
      }
      activeMagnet = null;
      gsap.to(outer, {
        width: 32,
        height: 32,
        backgroundColor: 'transparent',
        borderColor: '#FF6B35',
        boxShadow: '0 0 14px 2px rgba(255,107,53,0.28)',
        duration: 0.35,
        ease: 'power2.out',
      });
      gsap.to(inner, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const bind = () => {
      document.querySelectorAll<HTMLElement>(HOVER_SELECTOR).forEach((el) => {
        if (el.dataset.cursorBound === 'true') return;
        el.dataset.cursorBound = 'true';
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    bind();

    document.addEventListener('mousemove', onMouseMove);
    const observer = new MutationObserver(bind);
    observer.observe(document.body, { childList: true, subtree: true });

    // Click pulse
    const onMouseDown = () => {
      gsap.to(outer, { scale: 0.85, duration: 0.12, ease: 'power2.out' });
    };
    const onMouseUp = () => {
      gsap.to(outer, { scale: 1, duration: 0.25, ease: 'power2.out' });
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      observer.disconnect();
      document.querySelectorAll<HTMLElement>(HOVER_SELECTOR).forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        delete el.dataset.cursorBound;
      });
    };
  }, []);

  return (
    <>
      <div
        ref={outerRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border-[1.5px]"
        style={{
          width: 32,
          height: 32,
          borderColor: '#FF6B35',
          boxShadow: '0 0 14px 2px rgba(255,107,53,0.28)',
        }}
      />
      <div
        ref={innerRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
        style={{
          width: 6,
          height: 6,
          backgroundColor: '#FF6B35',
        }}
      />
    </>
  );
}
