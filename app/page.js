'use client'
import styles from './page.module.css'
import { useEffect, useRef, useState } from 'react';
import Link from "next/link";
// import AnimatedCursor from 'animated-cursor';

// Icons
import { FaApple } from "react-icons/fa";


export default function Index() {
  let steps = 0;
  let currentIndex = 0;
  let nbOfImages = 0;
  let maxNumberOfImages = 8;
  let refs = [];
  const textRef = useRef(null);

  const manageMouseMove = (e) => {
    const { clientX, clientY, movementX, movementY } = e;
    steps += Math.abs(movementX) + Math.abs(movementY);

    if (steps >= currentIndex * 150) {
      moveImage(clientX, clientY);

      if (nbOfImages == maxNumberOfImages) {
        removeImage();
      }
    }

    if (currentIndex == refs.length) {
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
  //
  // useEffect(() => {
  //   const cursorOptions = {
  //       innerSize: 1,
  //     cursorInnerStyles: {
  //       backgroundColor: 'var(--cursor-color)', // white
  //       mixBlendMode: 'exclusion'
  //     },
  //     cursorOuterStyles: {
  //       backgroundColor: 'var(--cursor-color)', // white
  //       mixBlendMode: 'exclusion'
  //     }
  //   };
  //   const cursor = AnimatedCursor(cursorOptions);
  //   cursor.init();
  // }, []);

  return (
      <main className={styles.main}>

        <div onMouseMove={(e) => manageMouseMove(e)} className={styles.imageCursorSpace}>
          {
            [...Array(33).keys()].map((_, index) => {
              const ref = useRef(null);
              refs.push(ref);
              return <img key={index} onClick={() => console.log(refs)} ref={ref} src={`/images/${index}.jpg`}/>;
            })
          }
          <div className={styles.textBox}>
            <span ref={textRef} className={styles.floatingText}>lewisgoing</span>
            <span className={styles.subheader}>a multimedia project</span>

          </div>
          <div className={styles.navPanel}>


            <Link ref={textRef} className={styles.navItem} href={'https://soundcloud.com/lewisgoing'}>soundcloud</Link>{"\n"}
            <Link ref={textRef} className={styles.navItem} href={'https://open.spotify.com/artist/0Ll3UtLjep87qvzadZ2Cp4?si=kbOPgrmRQJ-nz1kS3dquQg'}>spotify</Link>{"\n"}
            <Link ref={textRef} className={styles.navItem} href={'https://music.apple.com/us/artist/lewisgoing/1563419779'}>apple music </Link>{"\n"}
            {/*<FaApple size={20} />*/}
            <Link ref={textRef} className={styles.navItem} href={'https://soundcloud.com/earth2lewis'}>livesets</Link>{"\n"}
            <Link ref={textRef} className={styles.navItem} href={'mailto:whereislewisgoing@gmail.com'}>booking</Link>{"\n"}

          </div>
        </div>

        <footer className={styles.footer}>
          Copyright 2024 © lewisgoing
        </footer>
      </main>
  )
}
