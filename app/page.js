"use client";
import AnimatedCursor from 'animated-cursor';
import styles from './page.module.css'
import { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import classNames from 'classnames'; // Import classNames library
import Image from 'next/image';
import { getPlaceholderImage } from '@/utils/images';

export default function Index() {
  let steps = 0;
  let currentIndex = 0;
  let nbOfImages = 0;
  let maxNumberOfImages = 8;
  let refs = [];
  const textRef = useRef(null);
  const [isInverted, setIsInverted] = useState(false); // State to manage color inversion
  const [images, setImages] = useState([...Array(10).keys()]); // Initially load only 10 images

  const manageMouseMove = (e) => {
    const { clientX, clientY, movementX, movementY } = e;
    steps += Math.abs(movementX) + Math.abs(movementY);

    if (steps >= currentIndex * 150) {
      moveImage(clientX, clientY);

      if (nbOfImages === maxNumberOfImages) {
        removeImage();
      }
    }

    if (currentIndex === refs.length) {
      currentIndex = 0;
      steps = -150;
    }
  }

  const moveImage = (x, y) => {
    const currentImage = refs[currentIndex].current;
    currentImage.style.left = x + "px";
    currentImage.style.top = y + "px";
    currentImage.style.display = "block";
    currentIndex++;
    nbOfImages++;
    setZIndex();
  }

  const setZIndex = () => {
    const images = getCurrentImages();
    for (let i = 0; i < images.length; i++) {
      images[i].style.zIndex = i;
    }
  }

  const removeImage = () => {
    const images = getCurrentImages();
    images[0].style.display = "none";
    nbOfImages--;
  }

  const getCurrentImages = () => {
    let images = [];
    let indexOfFirst = currentIndex - nbOfImages;
    for (let i = indexOfFirst; i < currentIndex; i++) {
      let targetIndex = i;
      if (targetIndex < 0) targetIndex += refs.length;
      images.push(refs[targetIndex].current);
    }
    return images;
  }

  const handleClick = (ref) => {
    ref.current.classList.add(styles.clicked);
    setTimeout(() => {
      ref.current.classList.remove(styles.clicked);
    }, 500);
  }

  const handleInvertColors = () => {
    setIsInverted(!isInverted);
  }

  useEffect(() => {
    const cursorOptions = {
      outerAlpha: 0,
      cursorInnerStyles: {
        backgroundColor: '#000000',
        mixBlendMode: 'exclusion'
      },
      cursorOuterStyles: {
        backgroundColor: '#fff',
        mixBlendMode: 'exclusion',
        outerSize: 1,
      },
      outerSize: 1,
    };
    const cursor = AnimatedCursor(cursorOptions);
    cursor.init();
  }, []);

  // Lazy load images as the user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setImages(prevImages => [...prevImages, ...Array.from({length: 10}, (_, i) => i + prevImages.length)]);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
      <main className={styles.main}>
        <div onMouseMove={(e) => manageMouseMove(e)} className={classNames(styles.imageCursorSpace, { [styles.inverted]: isInverted })} onClick={handleInvertColors}>
          {
            images.map((index) => {
              const ref = useRef(null);
              refs.push(ref);
              return (
                  <Image
                      key={index}
                      onClick={() => handleClick(ref)}
                      ref={ref}
                      src={`/images/${index}.webp`}
                      alt="img-cursor"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={`/images-blur/${index}-blur.webp`}
                      width={600}
                      height={400}
                      layout="intrinsic"
                  />
              );
            })
          }
          <div className={styles.textBox} >
            <div>
              <span ref={textRef} className={styles.floatingText}>lewisgoing</span>
              <span className={styles.subheader}>a multimedia project</span>
            </div>
          </div>
          <div className={styles.navPanel}>
            <Link ref={textRef} className={styles.navItem} href={'https://soundcloud.com/lewisgoing'}>soundcloud</Link>
            <Link ref={textRef} className={styles.navItem} href={'https://open.spotify.com/artist/0Ll3UtLjep87qvzadZ2Cp4?si=kbOPgrmRQJ-nz1kS3dquQg'}>spotify</Link>
            <Link ref={textRef} className={styles.navItem} href={'https://music.apple.com/us/artist/lewisgoing/1563419779'}>apple music</Link>
            <Link ref={textRef} className={styles.navItem} href={'https://soundcloud.com/earth2lewis'}>livesets</Link>
            <Link ref={textRef} className={styles.navItem} href={'mailto:whereislewisgoing@gmail.com'}>booking</Link>
          </div>
          <div id="cursor">
            <div id="cursor-inner" className={styles.cursorInner}></div>
            <div id="cursor-outer" className={styles.cursorOuter}></div>
          </div>
        </div>
        <footer className={styles.footer}>
          Copyright 2024 © lewisgoing
        </footer>
      </main>
  )
}
