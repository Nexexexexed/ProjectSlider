import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { TimeSegment } from "../../types/type";
import CircleNavigation from "../CircleNavigation/CircleNavigation";
import { gsap } from "gsap";
import styles from "./TimeSegmentBlock.module.scss";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface TimeSegmentBlockProps {
  data: TimeSegment[];
}

const TimeSegmentBlock: React.FC<TimeSegmentBlockProps> = ({ data }) => {
  const [activeSegment, setActiveSegment] = useState(0);
  const [displayFrom, setDisplayFrom] = useState(data[0].periodFrom);
  const [displayTo, setDisplayTo] = useState(data[0].periodTo);
  const [isSwitching, setIsSwitching] = useState(false);

  const periodFromRef = useRef<HTMLDivElement>(null);
  const periodToRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);
  const sliderSectionRef = useRef<HTMLDivElement>(null);

  const currentSegment = data[activeSegment];

  const animateNumbers = (
    from: number,
    to: number,
    setNumber: (num: number) => void
  ) => {
    const duration = 0.6;
    const steps = Math.abs(to - from);
    const stepTime = duration / steps;

    let current = from;
    const timer = setInterval(() => {
      if ((from < to && current >= to) || (from > to && current <= to)) {
        clearInterval(timer);
        setNumber(to);
        return;
      }

      if (from < to) {
        current++;
      } else {
        current--;
      }
      setNumber(current);
    }, stepTime * 1000);
  };

  const handleSegmentChange = (index: number) => {
    if (isSwitching) return;

    setIsSwitching(true);
    const targetSegment = data[index];

    if (sliderSectionRef.current) {
      gsap.to(sliderSectionRef.current, {
        duration: 0.3,
        opacity: 0,
        y: 20,
        onComplete: () => {
          setActiveSegment(index);

          animateNumbers(displayFrom, targetSegment.periodFrom, setDisplayFrom);
          animateNumbers(displayTo, targetSegment.periodTo, setDisplayTo);

          if (swiperRef.current) {
            swiperRef.current.swiper.slideTo(0);
          }
          setTimeout(() => {
            if (sliderSectionRef.current) {
              gsap.fromTo(
                sliderSectionRef.current,
                { opacity: 0, y: 20 },
                { duration: 0.3, opacity: 1, y: 0 }
              );
            }
            setIsSwitching(false);
          }, 100);
        },
      });
    } else {
      setActiveSegment(index);
      setDisplayFrom(targetSegment.periodFrom);
      setDisplayTo(targetSegment.periodTo);
      setIsSwitching(false);
    }
  };

  const handlePrev = () => {
    const prevIndex = activeSegment === 0 ? data.length - 1 : activeSegment - 1;
    handleSegmentChange(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = activeSegment === data.length - 1 ? 0 : activeSegment + 1;
    handleSegmentChange(nextIndex);
  };

  return (
    <div className={styles.timeSegmentBlock}>
      <div className={styles.titleBlock}>
        <div className={styles.mainTitle}>Исторические даты</div>
      </div>
      <div className={styles.container}>
        <div className={styles.circleSection}>
          <div className={styles.centralCircle}>
            <div className={styles.timeBlock}>
              <div ref={titleRef} className={styles.currentTitle}>
                {currentSegment.title}
              </div>
            </div>
            <CircleNavigation
              segmentsCount={data.length}
              activeSegment={activeSegment}
              onSegmentChange={handleSegmentChange}
              titles={data.map((segment) => segment.title)}
              ids={data.map((segment) => segment.id)}
            />
          </div>
        </div>
        <div className={styles.periodContainer}>
          <div ref={periodFromRef} className={styles.periodFrom}>
            {displayFrom}
          </div>
          <div ref={periodToRef} className={styles.periodTo}>
            {displayTo}
          </div>
        </div>

        <div ref={sliderSectionRef} className={styles.sliderSection}>
          <div className={styles.segmentSwitcher}>
            <div className={styles.currentSegmentInfo}>
              <span className={styles.segmentId}>
                {String(currentSegment.id).padStart(2, "0")}
              </span>
              <span className={styles.segmentSeparator}>/</span>
              <span className={styles.totalSegments}>
                {String(data.length).padStart(2, "0")}
              </span>
            </div>
            <div className={styles.switcherControls}>
              <button
                className={styles.switcherButton}
                onClick={handlePrev}
                disabled={isSwitching}
              >
                &lt;
              </button>

              <button
                className={styles.switcherButton}
                onClick={handleNext}
                disabled={isSwitching}
              >
                &gt;
              </button>
              <div className={styles.dotsIndicator}>
                {data.map((_, index) => (
                  <div
                    key={index}
                    className={`${styles.dot} ${
                      index === activeSegment ? styles.dotActive : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.sliderContainer}>
            <button className={`${styles.swiperButtonPrev} swiperButtonPrev`}>
              &lt;
            </button>
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination]}
              navigation={{
                nextEl: `.${styles.swiperButtonNext}`,
                prevEl: `.${styles.swiperButtonPrev}`,
              }}
              pagination={{
                type: "fraction",
                el: `.${styles.swiperPagination}`,
                formatFractionCurrent: (number) =>
                  String(number).padStart(2, "0"),
                formatFractionTotal: (number) =>
                  String(number).padStart(2, "0"),
              }}
              spaceBetween={30}
              slidesPerView={3}
              breakpoints={{
                480: {
                  slidesPerView: 1.5,
                  spaceBetween: 25,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
            >
              {currentSegment.events.map((event) => (
                <SwiperSlide key={event.id}>
                  <div className={styles.event}>
                    <div className={styles.eventDate}>{event.date}</div>
                    <div className={styles.eventDescription}>
                      {event.description}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button className={`${styles.swiperButtonNext} swiperButtonNext`}>
              &gt;
            </button>
          </div>
          <div className={styles.mobileDivider}></div>
        </div>
      </div>
    </div>
  );
};

export default TimeSegmentBlock;
