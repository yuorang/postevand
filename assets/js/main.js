$(function () {
    // 1. 공통 설정 (Lenis 스무스 스크롤)
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 600);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. 공통 설정 (모바일 메뉴 로직 - 모든 해상도)
    const menuBtn = document.querySelector('.btn-menu');
    const closeBtn = document.querySelector('.btn-close');
    const menuOverlay = document.querySelector('#mobile-menu-overlay');

    if (menuBtn && closeBtn && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            gsap.set(menuOverlay, { display: 'flex', opacity: 0 });
            gsap.to(menuOverlay, { opacity: 1, duration: 0.3 });
            document.body.style.overflow = 'hidden';
        });

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

    // 3. 데스크탑 전용 (1024px 이상) GSAP 애니메이션
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
        intro.to(".intro img", {
            yPercent: 30,
            filter: "brightness(0.8)",
        }, "a");

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
        sect1.to(".col-right", { width: "100%" });
        sect1.to(".sect-scroll-1 span", { y: 0, stagger: 0.2 });
        sect1.to(".sect-scroll-1 .contents-text-4", { opacity: 1, stagger: 0.2 });

        // --- Sect Scroll 2 ---
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
        sect2.to(".component.cap .component-line", { width: "8vw" });
        sect2.to(".component.cap .component-title span", { y: 0 }, "<");
        sect2.to(".component.cap .desc span", { y: 0 });

        // Carton
        sect2.to(".component.carton .component-line", { width: "8vw" });
        sect2.to(".component.carton .component-title span", { y: 0 }, "<");
        sect2.to(".component.carton .desc span", { y: 0 });

        // Lining
        sect2.to(".component.lining .component-line", { width: "8vw" });
        sect2.to(".component.lining .component-title span", { y: 0 }, "<");
        sect2.to(".component.lining .desc span", { y: 0 });

        sect2.to(".sect-scroll-2 .sect2-badge", { opacity: 1 });
        sect2.to(".sect-scroll-2 video", { currentTime: 5 });

        // --- Sect Scroll 3 ---
        const sect3 = gsap.timeline({
            scrollTrigger: {
                trigger: ".sect-scroll-3",
                start: "0% 0%",
                end: "100% 100%",
                scrub: true,
            },
        });
        sect3.to(".sect-scroll-3 video", { currentTime: 3 }, "a");
        sect3.to(".sect-scroll-3 .video-caption1 span", { y: 0 }, "a");
        sect3.to(".sect-scroll-3 video", { currentTime: 5 }, "b");
        sect3.to(".sect-scroll-3 .video-caption1 span", { opacity: 0 }, "b");
        sect3.to(".sect-scroll-3 video", { currentTime: 6 }, "c");
        sect3.to(".sect-scroll-3 .video-caption2 span", { y: 0 }, "c");
        sect3.to(".sect-scroll-3 video", { currentTime: 8 }, "d");
        sect3.to(".sect-scroll-3 .video-caption2 span", { opacity: 0 }, "d");
        sect3.to(".sect-scroll-3 video", { currentTime: 11 });

        // 1024px 이상에서 cleanup이 필요하면 여기서 return 가능
        return () => {
            // 필요시 초기화 로직
        };
    });







    const items = document.querySelectorAll('.gallery-item');
    const mobileMediaQuery = window.matchMedia("(max-width: 1024px)");
    const itemScales = new Map();

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
            // 실행 도중 화면이 커졌을 경우를 대비해 다시 한번 체크
            if (mobileMediaQuery.matches) {
                smoothScale(img, targetScale);
            }
        });
    }

    function updateGalleryItems() {
        // 1024px 초과(PC)일 때는 실행 방지 및 초기화
        if (!mobileMediaQuery.matches) {
            items.forEach(item => {
                const img = item.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1)'; // PC에서는 원래 크기로
                    itemScales.set(img, 1);
                }
            });
            return;
        }

        // 모바일 로직 실행
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

    let ticking = false;
    function requestUpdate() {
        if (!ticking && mobileMediaQuery.matches) { // 모바일일 때만 프레임 요청
            requestAnimationFrame(() => {
                updateGalleryItems();
                ticking = false;
            });
            ticking = true;
        }
    }

    // 기능 컨트롤러: 화면 크기에 따라 이벤트 붙였다 뗐다 하기
    function handleGalleryFeature() {
        if (mobileMediaQuery.matches) {
            // 모바일 진입 시
            updateGalleryItems();
            window.addEventListener('scroll', requestUpdate, { passive: true });
            window.addEventListener('resize', updateGalleryItems);
        } else {
            // PC 진입 시: 이벤트 제거 및 스타일 초기화
            window.removeEventListener('scroll', requestUpdate);
            window.removeEventListener('resize', updateGalleryItems);
            updateGalleryItems(); // 내부 로직에 의해 scale(1)로 초기화됨
        }
    }

    // 최초 실행 및 상태 변경 감지
    handleGalleryFeature();
    mobileMediaQuery.addEventListener('change', handleGalleryFeature);









});