import React, { useState, useRef } from "react";
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
  const periodRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);

  const currentSegment = data[activeSegment];

  const handleSegmentChange = (index: number) => {
    if (periodRef.current && categoryRef.current) {
      gsap.to([periodRef.current, categoryRef.current], {
        duration: 0.3,
        opacity: 0,
        y: -20,
        onComplete: () => {
          setActiveSegment(index);
          if (swiperRef.current) {
            swiperRef.current.swiper.slideTo(0);
          }
          gsap.to([periodRef.current, categoryRef.current], {
            duration: 0.3,
            opacity: 1,
            y: 0,
          });
        },
      });
    } else {
      setActiveSegment(index);
    }
  };

  return (
    <div className={styles.timeSegmentBlock}>
      <div className={styles.container}>
        <div className={styles.circleSection}>
          <div className={styles.centralCircle}>
            <div ref={periodRef} className={styles.period}>
              {currentSegment.periodFrom}
            </div>
            <div ref={periodRef} className={styles.period}>
              {currentSegment.periodTo}
            </div>
            <CircleNavigation
              segmentsCount={data.length}
              activeSegment={activeSegment}
              onSegmentChange={handleSegmentChange}
              titles={data.map((segment) => segment.title)}
            />
          </div>
        </div>

        <div className={styles.sliderSection}>
          <div className={styles.sliderContainer}>
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination]}
              navigation={{
                nextEl: `.swiper-button-next`,
                prevEl: `.swiper-button-prev`,
              }}
              pagination={{
                type: "fraction",
                el: `.swiper-pagination`,
                formatFractionCurrent: (number) =>
                  String(number).padStart(2, "0"),
                formatFractionTotal: (number) =>
                  String(number).padStart(2, "0"),
              }}
              spaceBetween={30}
              slidesPerView={3}
              breakpoints={{
                480: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
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

            <div className={styles.sliderControls}>
              <div className="swiper-pagination"></div>
              <div className={styles.navigationButtons}>
                <button className="swiper-button-prev">←</button>
                <button className="swiper-button-next">→</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSegmentBlock;
