$(function () {
    /* Lenis */
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 600);
    });
    gsap.ticker.lagSmoothing(0);

    /* 2. 모바일 메뉴 제어 (All Resolutions) */
    const menuBtn = document.querySelector('.btn-menu');
    const closeBtn = document.querySelector('.btn-close');
    const menuOverlay = document.querySelector('#mobile-menu-overlay');

    if (menuBtn && closeBtn && menuOverlay) {
        // 메뉴 열기
        menuBtn.addEventListener('click', () => {
            gsap.set(menuOverlay, { display: 'flex', opacity: 0 });
            gsap.to(menuOverlay, { opacity: 1, duration: 0.3 });
            document.body.style.overflow = 'hidden';
        });

        // 메뉴 닫기
        closeBtn.addEventListener('click', () => {
            gsap.to(menuOverlay, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    gsap.set(menuOverlay, { display: 'none' });
                    document.body.style.overflow = '';
                }
            });
        });
    }

    /* 3. 데스크탑 애니메이션 (min-width: 1024px) */
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
        // --- Intro GSAP ---
        gsap.from(".intro-logo__svg path", {
            y: 400,
            stagger: 0.1,
            opacity: 0,
            duration: 0.7,
        });

        const intro = gsap.timeline({
            scrollTrigger: {
                trigger: ".intro",
                start: "0% 0%",
                end: "100% 0%",
                scrub: 0,
            },
        });
        intro.to(".intro img", { yPercent: 30, filter: "brightness(0.8)" }, "a");

        gsap.from(".intro-corp__svg", {
            y: 100,
            opacity: 0,
            stagger: 0.03,
            duration: 0.7,
            delay: 1.3
        });

        // --- Sect Scroll 1 ---
        const sect1 = gsap.timeline({
            scrollTrigger: {
                trigger: ".sect-scroll-1",
                start: "0% 0%",
                end: "100% 100%",
                scrub: 0,
            },
        });
        sect1.to(".col-right", { width: "100%" })
            .to(".sect-scroll-1 span", { y: 0, stagger: 0.2 })
            .to(".sect-scroll-1 .contents-text-4", { opacity: 1, stagger: 0.2 });

        // --- Sect Scroll 2 (Video Timeline) ---
        const sect2 = gsap.timeline({
            scrollTrigger: {
                trigger: ".sect-scroll-2",
                start: "0% 0%",
                end: "100% 100%",
                scrub: 0,
            },
        });

        sect2.to(".sect-scroll-2 video", { currentTime: 2 });
        // Cap
        sect2.to(".component.cap .component-line", { width: "8vw" })
            .to(".component.cap .component-title span", { y: 0 }, "<")
            .to(".component.cap .desc span", { y: 0 });
        // Carton
        sect2.to(".component.carton .component-line", { width: "8vw" })
            .to(".component.carton .component-title span", { y: 0 }, "<")
            .to(".component.carton .desc span", { y: 0 });
        // Lining
        sect2.to(".component.lining .component-line", { width: "8vw" })
            .to(".component.lining .component-title span", { y: 0 }, "<")
            .to(".component.lining .desc span", { y: 0 });

        sect2.to(".sect-scroll-2 .sect2-badge", { opacity: 1 })
            .to(".sect-scroll-2 video", { currentTime: 5 });

        // --- Sect Scroll 3 (Video Timeline) ---
        const sect3 = gsap.timeline({
            scrollTrigger: {
                trigger: ".sect-scroll-3",
                start: "0% 0%",
                end: "100% 100%",
                scrub: true,
            },
        });

        sect3.to(".sect-scroll-3 video", { currentTime: 3 }, "a")
            .to(".sect-scroll-3 .video-caption1 span", { y: 0 }, "a")
            .to(".sect-scroll-3 video", { currentTime: 5 }, "b")
            .to(".sect-scroll-3 .video-caption1 span", { opacity: 0 }, "b")
            .to(".sect-scroll-3 video", { currentTime: 6 }, "c")
            .to(".sect-scroll-3 .video-caption2 span", { y: 0 }, "c")
            .to(".sect-scroll-3 video", { currentTime: 8 }, "d")
            .to(".sect-scroll-3 .video-caption2 span", { opacity: 0 }, "d")
            .to(".sect-scroll-3 video", { currentTime: 11 });

        return () => { /* Cleanup if needed */ };
    });

    /* 4. 모바일 갤러리 인터랙션 (max-width: 1024px) */
    const items = document.querySelectorAll('.gallery-item');
    const mobileMediaQuery = window.matchMedia("(max-width: 1024px)");
    const itemScales = new Map();

    // 부드러운 스케일 애니메이션 함수
    function smoothScale(img, targetScale) {
        let currentScale = itemScales.get(img) ?? 0.8;
        const speed = 0.12;
        const diff = targetScale - currentScale;

        if (Math.abs(diff) < 0.001) {
            img.style.transform = `scale(${targetScale})`;
            itemScales.set(img, targetScale);
            return;
        }

        currentScale += diff * speed;
        img.style.transform = `scale(${currentScale})`;
        itemScales.set(img, currentScale);

        requestAnimationFrame(() => {
            if (mobileMediaQuery.matches) {
                smoothScale(img, targetScale);
            }
        });
    }

    // 위치 기반 업데이트 로직
    function updateGalleryItems() {
        if (!mobileMediaQuery.matches) {
            items.forEach(item => {
                const img = item.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1)';
                    itemScales.set(img, 1);
                }
            });
            return;
        }

        const viewportHeight = window.innerHeight;
        const centerY = viewportHeight / 2;
        const threshold = viewportHeight * 0.25;

        items.forEach(item => {
            const img = item.querySelector('img');
            if (!img) return;

            const rect = item.getBoundingClientRect();
            const itemMid = rect.top + rect.height / 2;
            const dist = Math.abs(itemMid - centerY);
            const ratio = Math.min(dist / threshold, 1);

            const scale = 1.08 - (1.08 - 0.8) * ratio;
            smoothScale(img, scale);
        });
    }

    // 최적화된 프레임 요청
    let ticking = false;
    function requestUpdate() {
        if (!ticking && mobileMediaQuery.matches) {
            requestAnimationFrame(() => {
                updateGalleryItems();
                ticking = false;
            });
            ticking = true;
        }
    }

    // 기능 제어 컨트롤러
    function handleGalleryFeature() {
        if (mobileMediaQuery.matches) {
            updateGalleryItems();
            window.addEventListener('scroll', requestUpdate, { passive: true });
            window.addEventListener('resize', updateGalleryItems);
        } else {
            window.removeEventListener('scroll', requestUpdate);
            window.removeEventListener('resize', updateGalleryItems);
            updateGalleryItems();
        }
    }

    // 초기 실행 및 상태 감지
    handleGalleryFeature();
    mobileMediaQuery.addEventListener('change', handleGalleryFeature);
});