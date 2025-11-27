"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ContentCard from "./components/ContentCard";
import EmailGateModal from "./components/EmailGateModal";
import ProgressIndicator from "./components/ProgressIndicator";
import { contentData } from "./data/content";

/**
 * Main content browsing page with Swiper integration and email gate.
 * 
 * State Management:
 * - currentIndex: Tracks which content item is currently displayed (0-based)
 * - viewedCount: Tracks how many unique items the user has viewed in this session
 * - hasUnlocked: Boolean flag indicating if user has submitted email to unlock more content
 * - showEmailGate: Controls visibility of the email gate modal
 * 
 * 10-Item Limit Logic:
 * - When viewedCount reaches 10 and user tries to go forward, showEmailGate is set to true
 * - The email gate blocks navigation forward until a valid email is submitted
 * - After email submission, hasUnlocked becomes true, showEmailGate becomes false, and user can continue
 * - Navigation is blocked at index 9 (10th item) until email is submitted
 * 
 * Swiper Integration:
 * - Uses Swiper library for smooth swipe gestures and transitions
 * - Swiper handles touch/mouse drag, keyboard navigation, and smooth animations
 * - Custom navigation control to prevent going past index 9 until unlocked
 */
export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedCount, setViewedCount] = useState(1);
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  // Track which items have been viewed to count unique views
  const viewedItemsRef = useRef<Set<number>>(new Set([0]));

  /**
   * Updates viewedCount when currentIndex changes.
   * Only counts unique items viewed (not revisiting the same item).
   */
  useEffect(() => {
    if (!viewedItemsRef.current.has(currentIndex)) {
      viewedItemsRef.current.add(currentIndex);
      setViewedCount(viewedItemsRef.current.size);
    }
  }, [currentIndex]);

  /**
   * Update Swiper's allowSlideNext when hasUnlocked changes.
   * This ensures Swiper can navigate past slide 9 after unlocking.
   */
  useEffect(() => {
    if (swiperRef.current) {
      // Force Swiper to update its navigation state
      // Allow swipe gesture even on slide 9 so we can detect it and show email gate
      const canSlideNext = hasUnlocked || currentIndex < 10;
      swiperRef.current.allowSlideNext = canSlideNext;
      // Update resistance ratio - set to 0 when locked to prevent elastic effect
      swiperRef.current.params.resistanceRatio = hasUnlocked ? 0.85 : 0;
      // Force update to apply changes
      swiperRef.current.update();
      swiperRef.current.updateSlides();
    }
  }, [hasUnlocked, currentIndex]);

  /**
   * Handle Swiper slide change.
   * Updates currentIndex and checks if we need to show email gate.
   */
  const handleSlideChange = (swiper: SwiperType) => {
    const newIndex = swiper.activeIndex;
    
    // If user somehow reached slide 10+ without unlocking, show email gate and revert
    if (!hasUnlocked && newIndex >= 10) {
      setShowEmailGate(true);
      swiper.slideTo(9, 0);
      return;
    }
    
    setCurrentIndex(newIndex);
  };

  /**
   * Handle when user tries to slide.
   * Blocks navigation past index 9 if not unlocked.
   */
  const handleSlideChangeTransitionStart = (swiper: SwiperType) => {
    // If unlocked, allow all navigation
    if (hasUnlocked) {
      return;
    }
    
    const targetIndex = swiper.activeIndex;
    
    // Block navigation to index 10+ if not unlocked
    if (targetIndex >= 10) {
      setShowEmailGate(true);
      // Prevent the slide change by reverting to slide 9 immediately
      swiper.slideTo(9, 0); // 0 = no animation
    }
  };

  /**
   * Handle touch end to detect swipe attempts at the limit.
   * This is called when user finishes a swipe gesture.
   */
  const handleTouchEnd = (swiper: SwiperType) => {
    if (!hasUnlocked && swiper.activeIndex === 9) {
      const touchEventsData = (swiper as any).touchEventsData;
      if (touchEventsData && touchEventsData.startX !== undefined) {
        const currentX = touchEventsData.currentX || touchEventsData.startX;
        const deltaX = currentX - touchEventsData.startX;
        // If swiping left (negative deltaX) past threshold, show email gate
        if (deltaX < -50) {
          setShowEmailGate(true);
          // Prevent the slide change
          swiper.slideTo(9, 0);
        }
      }
    }
  };

  /**
   * Handle touch move to detect swipe attempts and show email gate early.
   */
  const handleTouchMove = (swiper: SwiperType, event: TouchEvent) => {
    if (!hasUnlocked && swiper.activeIndex === 9) {
      const touch = event.touches[0];
      const touchEventsData = (swiper as any).touchEventsData;
      if (touchEventsData && touchEventsData.startX !== undefined) {
        const deltaX = touch.clientX - touchEventsData.startX;
        // If swiping left (negative deltaX) past threshold, show email gate immediately
        if (deltaX < -50) {
          setShowEmailGate(true);
          // Try to prevent the slide change
          event.preventDefault();
        }
      }
    }
  };

  /**
   * Handle email submission from the email gate modal.
   * Unlocks access to more content and hides the modal.
   */
  const handleEmailSubmit = (email: string) => {
    console.log("Email submitted:", email);
    // In a real app, you would send this to your backend
    // For now, we just log it and update state
    
    setHasUnlocked(true);
    setShowEmailGate(false);
    
    // Update Swiper to allow navigation and move to next slide
    if (swiperRef.current) {
      // Enable next slide navigation
      swiperRef.current.allowSlideNext = true;
      swiperRef.current.update();
      
      // Automatically move to next item after unlocking
      if (currentIndex === 9) {
        setTimeout(() => {
          swiperRef.current?.slideTo(10, 300); // 300ms animation
        }, 100);
      }
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Progress Indicator - Fixed at top */}
      <div className="absolute top-4 left-0 right-0 z-20 px-4">
        <ProgressIndicator
          currentIndex={currentIndex}
          totalItems={contentData.length}
          isUnlocked={hasUnlocked}
        />
      </div>

      {/* Swiper Container - Full Screen */}
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          // Always allow gesture to start so we can detect swipe attempts
          swiper.allowSlideNext = true;
        }}
        onSlideChange={handleSlideChange}
        onSlideChangeTransitionStart={handleSlideChangeTransitionStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        allowTouchMove={true}
        touchStartPreventDefault={false}
        touchMoveStopPropagation={false}
        speed={300}
        className="h-full w-full"
        resistance={true}
        resistanceRatio={0}
        allowSlideNext={true}
      >
        {contentData.map((content, index) => (
          <SwiperSlide key={content.id} className="h-full w-full">
            <ContentCard content={content} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Email Gate Modal */}
      <EmailGateModal
        isOpen={showEmailGate}
        onSubmit={handleEmailSubmit}
      />
    </div>
  );
}
