/* ============================================================
   SITA RAMAM — Scroll-Driven Cinematic Storytelling Engine
   with Dual Scroll Expansion Sections
   ============================================================ */

(function () {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        title: {
            totalFrames: 66,
            basePath: 'frames/title/frame-',
            canvasId: 'title-canvas',
            sectionId: 'section-title-card'
        },
        main: {
            totalFrames: 575,
            basePath: 'frames/main/frame-',
            sections: {
                letters: { canvasId: 'main-canvas', sectionId: 'section-letters', startFrame: 0, endFrame: 191 },
                journey: { canvasId: 'journey-canvas', sectionId: 'section-journey', startFrame: 192, endFrame: 383 },
                climax: { canvasId: 'climax-canvas', sectionId: 'section-climax', startFrame: 384, endFrame: 574 }
            }
        },
        batchSize: 20,
        frameWidth: 1920,
        frameHeight: 1080
    };

    const PHASES = {
        letters: [
            { id: 'phase-1', start: 0.05, end: 0.30 },
            { id: 'phase-2', start: 0.35, end: 0.60 },
            { id: 'phase-3', start: 0.65, end: 0.90 }
        ],
        journey: [
            { id: 'phase-4', start: 0.05, end: 0.30 },
            { id: 'phase-5', start: 0.35, end: 0.60 },
            { id: 'phase-6', start: 0.65, end: 0.90 }
        ],
        climax: [
            { id: 'phase-7', start: 0.05, end: 0.45 },
            { id: 'phase-8', start: 0.55, end: 0.90 }
        ],
        titleCard: [
            { id: 'title-fade-text', start: 0.10, end: 0.85 }
        ]
    };

    // ==================== STATE ====================
    const state = {
        titleFrames: [],
        mainFrames: [],
        totalLoaded: 0,
        totalToLoad: 0,
        isLoaded: false,
        audioPlaying: false,
        currentFrames: { title: 0, letters: 0, journey: 0, climax: 0 },
        drawnFrames: { title: -1, letters: -1, journey: -1, climax: -1 },
        isMobile: false,
        touchStartY: 0,
        // Two expansion sections
        expansions: {
            hero: { progress: 0, fullyExpanded: false },
            story: { progress: 0, fullyExpanded: false }
        }
    };

    // ==================== DOM REFERENCES ====================
    const dom = {};

    function cacheDom() {
        dom.loadingScreen = document.getElementById('loading-screen');
        dom.loadingBar = document.getElementById('loading-bar');
        dom.loadingPercent = document.getElementById('loading-percent');
        dom.scrollProgressBar = document.getElementById('scroll-progress-bar');
        dom.audioToggle = document.getElementById('audio-toggle');
        dom.audioIconOn = document.getElementById('audio-icon-on');
        dom.audioIconOff = document.getElementById('audio-icon-off');
        dom.bgAudio = document.getElementById('bg-audio');

        // Expansion HERO elements
        dom.hero = {
            section: document.getElementById('section-expansion-hero'),
            bg: document.getElementById('expansion-bg'),
            media: document.getElementById('expansion-media'),
            darkener: document.getElementById('expansion-media-darkener'),
            titleTop: document.getElementById('expansion-title-top'),
            titleBottom: document.getElementById('expansion-title-bottom'),
            text: document.getElementById('expansion-text'),
            hint: document.getElementById('expansion-hint')
        };

        // Expansion STORY elements
        dom.story = {
            section: document.getElementById('section-expansion-story'),
            bg: document.getElementById('expansion-story-bg'),
            media: document.getElementById('expansion-story-media'),
            darkener: document.getElementById('expansion-story-darkener'),
            titleTop: document.getElementById('expansion-story-top'),
            titleBottom: document.getElementById('expansion-story-bottom'),
            text: document.getElementById('expansion-story-text'),
            hint: document.getElementById('expansion-story-hint')
        };

        // Canvases
        dom.titleCanvas = document.getElementById('title-canvas');
        dom.titleCtx = dom.titleCanvas.getContext('2d');
        dom.mainCanvas = document.getElementById('main-canvas');
        dom.mainCtx = dom.mainCanvas.getContext('2d');
        dom.journeyCanvas = document.getElementById('journey-canvas');
        dom.journeyCtx = dom.journeyCanvas.getContext('2d');
        dom.climaxCanvas = document.getElementById('climax-canvas');
        dom.climaxCtx = dom.climaxCanvas.getContext('2d');

        // Sections
        dom.titleSection = document.getElementById('section-title-card');
        dom.lettersSection = document.getElementById('section-letters');
        dom.journeySection = document.getElementById('section-journey');
        dom.climaxSection = document.getElementById('section-climax');
        dom.tributeSection = document.getElementById('section-tribute');
        dom.tributeContent = document.querySelector('.tribute-content');

        // Phase elements
        dom.phases = {};
        Object.keys(PHASES).forEach(section => {
            PHASES[section].forEach(phase => {
                dom.phases[phase.id] = document.getElementById(phase.id);
            });
        });
    }

    // ==================== EXPANSION LOGIC (generic for both sections) ====================

    /**
     * Determines which expansion section (if any) should capture wheel/touch events.
     * Returns 'hero', 'story', or null.
     */
    function getActiveExpansion() {
        const heroExp = state.expansions.hero;
        const storyExp = state.expansions.story;

        // Hero takes priority — if not expanded yet, it captures
        if (!heroExp.fullyExpanded) {
            return 'hero';
        }

        // Story expansion — check if it's in view and not expanded
        if (!storyExp.fullyExpanded) {
            const storyRect = dom.story.section.getBoundingClientRect();
            // Story section is at/near the top of viewport
            if (storyRect.top <= 10 && storyRect.bottom > 0) {
                return 'story';
            }
        }

        return null;
    }

    /**
     * Check if user is trying to scroll back up into a collapsed expansion
     */
    function getCollapseTarget() {
        if (window.scrollY <= 5) {
            // At very top of page — check if hero should uncollapse
            if (state.expansions.hero.fullyExpanded) {
                return 'hero';
            }
        }

        // Check if the story expansion section is at the top and user is scrolling up
        const storyRect = dom.story.section.getBoundingClientRect();
        if (state.expansions.story.fullyExpanded && storyRect.top >= -5 && storyRect.top <= 10) {
            return 'story';
        }

        return null;
    }

    function setupExpansions() {
        // Mobile check
        function checkMobile() {
            state.isMobile = window.innerWidth < 768;
        }
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // ---- Wheel handler ----
        function onWheel(e) {
            if (!state.isLoaded) return;

            const activeExp = getActiveExpansion();

            // Scrolling down into an active expansion
            if (activeExp) {
                e.preventDefault();
                const exp = state.expansions[activeExp];
                const scrollDelta = e.deltaY * 0.001;
                exp.progress = Math.min(Math.max(exp.progress + scrollDelta, 0), 1);

                if (exp.progress >= 1) {
                    exp.fullyExpanded = true;
                }

                updateExpansionVisuals(activeExp);
                return;
            }

            // Scrolling up — check if we should collapse an expansion
            if (e.deltaY < 0) {
                const collapseTarget = getCollapseTarget();
                if (collapseTarget) {
                    e.preventDefault();
                    const exp = state.expansions[collapseTarget];
                    exp.fullyExpanded = false;
                    exp.progress = 0.99;
                    updateExpansionVisuals(collapseTarget);
                    return;
                }
            }
        }

        // ---- Touch handlers ----
        function onTouchStart(e) {
            state.touchStartY = e.touches[0].clientY;
        }

        function onTouchMove(e) {
            if (!state.touchStartY || !state.isLoaded) return;

            const touchY = e.touches[0].clientY;
            const deltaY = state.touchStartY - touchY;
            const activeExp = getActiveExpansion();

            if (activeExp) {
                e.preventDefault();
                const exp = state.expansions[activeExp];
                const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
                exp.progress = Math.min(Math.max(exp.progress + deltaY * scrollFactor, 0), 1);

                if (exp.progress >= 1) {
                    exp.fullyExpanded = true;
                }

                state.touchStartY = touchY;
                updateExpansionVisuals(activeExp);
                return;
            }

            // Scrolling up — collapse check
            if (deltaY < -20) {
                const collapseTarget = getCollapseTarget();
                if (collapseTarget) {
                    e.preventDefault();
                    const exp = state.expansions[collapseTarget];
                    exp.fullyExpanded = false;
                    exp.progress = 0.99;
                    state.touchStartY = touchY;
                    updateExpansionVisuals(collapseTarget);
                    return;
                }
            }

            state.touchStartY = touchY;
        }

        function onTouchEnd() {
            state.touchStartY = 0;
        }

        // Prevent scroll while an expansion is active
        function onScrollLock() {
            if (!state.isLoaded) return;

            const activeExp = getActiveExpansion();
            if (activeExp === 'hero') {
                window.scrollTo(0, 0);
            } else if (activeExp === 'story') {
                // Lock scroll at the story section's position
                const storyTop = dom.story.section.offsetTop;
                window.scrollTo(0, storyTop);
            }
        }

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('scroll', onScrollLock, { passive: true });
        window.addEventListener('touchstart', onTouchStart, { passive: false });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd);
    }

    function updateExpansionVisuals(which) {
        const exp = state.expansions[which];
        const d = dom[which]; // dom.hero or dom.story
        const p = exp.progress;
        const isMobile = state.isMobile;

        // Media container sizing
        const baseW = 320;
        const baseH = 400;
        const maxExtraW = isMobile ? 700 : 1600;
        const maxExtraH = isMobile ? 250 : 680;
        const mediaW = baseW + p * maxExtraW;
        const mediaH = baseH + p * maxExtraH;

        d.media.style.width = mediaW + 'px';
        d.media.style.height = mediaH + 'px';
        d.media.style.maxWidth = '100vw';
        d.media.style.maxHeight = '100vh';

        // Border radius shrinks to 0
        d.media.style.borderRadius = (16 * (1 - p)) + 'px';

        // Box shadow fades out
        d.media.style.boxShadow = `0 0 60px rgba(0,0,0,${0.4 * (1 - p)}), 0 0 120px rgba(126,184,216,${0.08 * (1 - p)})`;

        // Background fades out
        d.bg.style.opacity = 1 - p;

        // Darkener fades out
        d.darkener.style.opacity = 0.35 - p * 0.35;

        // Title text splits apart
        const textX = p * (isMobile ? 100 : 120);
        d.titleTop.style.transform = `translateX(-${textX}vw)`;
        d.titleBottom.style.transform = `translateX(${textX}vw)`;

        // Title fades out
        d.text.style.opacity = Math.max(0, 1 - p * 2.5);

        // Scroll hint fades quickly
        d.hint.style.opacity = Math.max(0, 1 - p * 4);
    }

    // ==================== FRAME LOADING ====================
    function padNumber(num, length) {
        return String(num).padStart(length, '0');
    }

    function loadSingleFrame(basePath, index) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                state.totalLoaded++;
                updateLoadingProgress();
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`Failed to load: ${basePath}${padNumber(index, 4)}.jpg`);
                state.totalLoaded++;
                updateLoadingProgress();
                resolve(null);
            };
            img.src = `${basePath}${padNumber(index, 4)}.jpg`;
        });
    }

    function updateLoadingProgress() {
        const percent = Math.min(Math.round((state.totalLoaded / state.totalToLoad) * 100), 100);
        dom.loadingBar.style.width = percent + '%';
        dom.loadingPercent.textContent = percent + '%';
    }

    async function loadAllFrames() {
        state.totalToLoad = CONFIG.title.totalFrames + CONFIG.main.totalFrames;
        state.totalLoaded = 0;

        for (let i = 0; i < CONFIG.title.totalFrames; i += CONFIG.batchSize) {
            const batch = [];
            for (let j = i; j < Math.min(i + CONFIG.batchSize, CONFIG.title.totalFrames); j++) {
                batch.push(loadSingleFrame(CONFIG.title.basePath, j + 1));
            }
            const results = await Promise.all(batch);
            state.titleFrames.push(...results);
        }

        for (let i = 0; i < CONFIG.main.totalFrames; i += CONFIG.batchSize) {
            const batch = [];
            for (let j = i; j < Math.min(i + CONFIG.batchSize, CONFIG.main.totalFrames); j++) {
                batch.push(loadSingleFrame(CONFIG.main.basePath, j + 1));
            }
            const results = await Promise.all(batch);
            state.mainFrames.push(...results);
        }

        state.isLoaded = true;
    }

    // ==================== CANVAS ====================
    function setupCanvases() {
        [dom.titleCanvas, dom.mainCanvas, dom.journeyCanvas, dom.climaxCanvas].forEach(c => {
            c.width = CONFIG.frameWidth;
            c.height = CONFIG.frameHeight;
        });
    }

    function drawFrame(ctx, frames, index) {
        if (index >= 0 && index < frames.length && frames[index]) {
            ctx.clearRect(0, 0, CONFIG.frameWidth, CONFIG.frameHeight);
            ctx.drawImage(frames[index], 0, 0, CONFIG.frameWidth, CONFIG.frameHeight);
        }
    }

    // ==================== SCROLL CALCULATION ====================
    function getSectionProgress(section) {
        const rect = section.getBoundingClientRect();
        const scrollDist = rect.height - window.innerHeight;
        if (scrollDist <= 0) return 0;
        return Math.max(0, Math.min(1, -rect.top / scrollDist));
    }

    function isSectionInView(section) {
        const rect = section.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    // ==================== MAIN SCROLL HANDLER ====================
    function onPageScroll() {
        if (!state.isLoaded) return;

        // Progress bar
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        dom.scrollProgressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';

        // Title card
        if (isSectionInView(dom.titleSection)) {
            const p = getSectionProgress(dom.titleSection);
            state.currentFrames.title = Math.min(Math.floor(p * CONFIG.title.totalFrames), CONFIG.title.totalFrames - 1);
            updatePhases(PHASES.titleCard, p);
        }

        // Letters
        if (isSectionInView(dom.lettersSection)) {
            const p = getSectionProgress(dom.lettersSection);
            const s = CONFIG.main.sections.letters;
            state.currentFrames.letters = s.startFrame + Math.min(Math.floor(p * (s.endFrame - s.startFrame)), (s.endFrame - s.startFrame) - 1);
            updatePhases(PHASES.letters, p);
        }

        // Journey
        if (isSectionInView(dom.journeySection)) {
            const p = getSectionProgress(dom.journeySection);
            const s = CONFIG.main.sections.journey;
            state.currentFrames.journey = s.startFrame + Math.min(Math.floor(p * (s.endFrame - s.startFrame)), (s.endFrame - s.startFrame) - 1);
            updatePhases(PHASES.journey, p);
        }

        // Climax
        if (isSectionInView(dom.climaxSection)) {
            const p = getSectionProgress(dom.climaxSection);
            const s = CONFIG.main.sections.climax;
            state.currentFrames.climax = s.startFrame + Math.min(Math.floor(p * (s.endFrame - s.startFrame)), (s.endFrame - s.startFrame) - 1);
            updatePhases(PHASES.climax, p);
        }

        // Tribute
        if (dom.tributeContent) {
            const rect = dom.tributeSection.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75) {
                dom.tributeContent.classList.add('visible');
            }
        }

        // Parallax transitions
        updateParallaxSections();
    }

    // ==================== PARALLAX ENGINE ====================
    function updateParallaxSections() {
        const parallaxSections = document.querySelectorAll('[data-parallax]');

        parallaxSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;

            if (!inView) return;

            // Parallax: move bg image at slower rate
            const img = section.querySelector('[data-parallax-img]');
            if (img) {
                const sectionCenter = rect.top + rect.height / 2;
                const viewCenter = window.innerHeight / 2;
                const offset = (sectionCenter - viewCenter) * 0.4; // 0.4 = parallax factor
                img.style.transform = `translateY(${offset}px)`;
            }

            // Fade in content
            const content = section.querySelector('[data-parallax-content]');
            if (content) {
                if (rect.top < window.innerHeight * 0.7) {
                    content.classList.add('visible');
                } else {
                    content.classList.remove('visible');
                }
            }
        });
    }

    function updatePhases(phases, progress) {
        phases.forEach(phase => {
            const el = dom.phases[phase.id];
            if (!el) return;
            if (progress >= phase.start && progress <= phase.end) {
                el.classList.add('visible');
            } else {
                el.classList.remove('visible');
            }
        });
    }

    // ==================== RENDER LOOP ====================
    function tick() {
        if (state.isLoaded) {
            if (state.currentFrames.title !== state.drawnFrames.title) {
                drawFrame(dom.titleCtx, state.titleFrames, state.currentFrames.title);
                state.drawnFrames.title = state.currentFrames.title;
            }
            if (state.currentFrames.letters !== state.drawnFrames.letters) {
                drawFrame(dom.mainCtx, state.mainFrames, state.currentFrames.letters);
                state.drawnFrames.letters = state.currentFrames.letters;
            }
            if (state.currentFrames.journey !== state.drawnFrames.journey) {
                drawFrame(dom.journeyCtx, state.mainFrames, state.currentFrames.journey);
                state.drawnFrames.journey = state.currentFrames.journey;
            }
            if (state.currentFrames.climax !== state.drawnFrames.climax) {
                drawFrame(dom.climaxCtx, state.mainFrames, state.currentFrames.climax);
                state.drawnFrames.climax = state.currentFrames.climax;
            }
        }
        requestAnimationFrame(tick);
    }

    // ==================== AUDIO ====================
    function setupAudio() {
        const audio = dom.bgAudio;
        audio.volume = 0;

        dom.audioToggle.addEventListener('click', () => {
            if (state.audioPlaying) {
                fadeAudio(audio, 0, 800);
                setTimeout(() => audio.pause(), 800);
                state.audioPlaying = false;
                dom.audioIconOn.classList.add('hidden');
                dom.audioIconOff.classList.remove('hidden');
            } else {
                audio.play().then(() => {
                    fadeAudio(audio, 0.5, 1200);
                    state.audioPlaying = true;
                    dom.audioIconOn.classList.remove('hidden');
                    dom.audioIconOff.classList.add('hidden');
                }).catch(err => console.warn('Audio playback failed:', err));
            }
        });
    }

    function fadeAudio(audio, targetVolume, duration) {
        const startVol = audio.volume;
        const diff = targetVolume - startVol;
        const steps = 30;
        let step = 0;
        const interval = setInterval(() => {
            step++;
            audio.volume = Math.max(0, Math.min(1, startVol + diff * (step / steps)));
            if (step >= steps) { clearInterval(interval); audio.volume = targetVolume; }
        }, duration / steps);
    }

    // ==================== INIT ====================
    async function init() {
        cacheDom();
        setupCanvases();
        setupAudio();
        setupExpansions();

        // Set both expansions to initial state
        updateExpansionVisuals('hero');
        updateExpansionVisuals('story');

        tick();

        await loadAllFrames();

        // Draw initial frames
        drawFrame(dom.titleCtx, state.titleFrames, 0);
        drawFrame(dom.mainCtx, state.mainFrames, CONFIG.main.sections.letters.startFrame);
        drawFrame(dom.journeyCtx, state.mainFrames, CONFIG.main.sections.journey.startFrame);
        drawFrame(dom.climaxCtx, state.mainFrames, CONFIG.main.sections.climax.startFrame);

        // Main scroll listener for canvas animations (separate from expansion wheel interception)
        window.addEventListener('scroll', onPageScroll, { passive: true });
        onPageScroll();

        setTimeout(() => {
            dom.loadingScreen.classList.add('hidden');
            dom.audioToggle.classList.add('visible');
        }, 600);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
