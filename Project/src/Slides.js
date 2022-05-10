import React, { useState } from "react";
import {Carousel, CarouselItem, CarouselControl, CarouselIndicators} from "reactstrap";
import one from './images/1.png';
import two from './images/2.png';
import three from './images/3.png';
import four from './images/4.png';
import five from './images/5.png';

const items = [
  {
  id: 1,
  src: one,
  },
  {
  id: 2,
  src: two,
  },
  {
  id: 3,
  src: three,
  },
  {
  id: 4,
  src: four,
  },
  {
  id: 5,
  src: five,
  },
];
  const Slides = () => {
      const [activeIndex, setActiveIndex] = useState(0);
      const [animating, setAnimating] = useState(false);
    
      const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
      };
    
      const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
      };
    
      const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
      };
    
      const slides = items.map((item) => {
        return (
          <CarouselItem
            onExiting={() => setAnimating(true)}
            onExited={() => setAnimating(false)}
            key={item.id}
          >
            <img src={item.src} alt={item.altText} />
          </CarouselItem>
      );
  });

  return (
      <>
        <Carousel activeIndex={activeIndex} next={next} previous={previous}>
          <CarouselIndicators
            items={items}
            activeIndex={activeIndex}
            onClickHandler={goToIndex}
          />
          {slides}
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={next}
          />
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={previous}
          />
        </Carousel>
      </>
  );
};

export default Slides;