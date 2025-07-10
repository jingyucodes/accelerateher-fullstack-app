import React, { useEffect, useRef, useState } from 'react';

const ReadingTracker = ({
    moduleId,
    readingContent,
    onReadingTimeUpdate,
    initialReadingTime = 0,
    initialReadingProgress = 0,
    isAuthenticated
}) => {
    const [readingTime, setReadingTime] = useState(initialReadingTime);
    const [readingProgress, setReadingProgress] = useState(initialReadingProgress);
    const [currentSection, setCurrentSection] = useState(0);

    const readingTrackerRef = useRef({
        lastActiveTime: null,
        totalReadingTime: initialReadingTime * 60, // Convert to seconds
        isReading: false,
        isVisible: true,
        progressTimer: null,
        scrollThreshold: 0,
        lastScrollPosition: 0,
        sectionsRead: new Set()
    });

    const readingContainerRef = useRef(null);
    const sectionRefs = useRef([]);

    // 初始化阅读追踪器
    useEffect(() => {
        if (!readingContent || !isAuthenticated) return;

        const tracker = readingTrackerRef.current;
        tracker.totalReadingTime = initialReadingTime * 60;

        // 页面可见性检测
        const handleVisibilityChange = () => {
            tracker.isVisible = !document.hidden;

            if (document.hidden) {
                // 页面隐藏时停止计时
                if (tracker.isReading && tracker.lastActiveTime) {
                    const sessionTime = (Date.now() - tracker.lastActiveTime) / 1000;
                    tracker.totalReadingTime += sessionTime;
                    updateDisplayTime();
                }
                tracker.isReading = false;
                tracker.lastActiveTime = null;
            } else {
                // 页面可见时开始计时
                if (tracker.isVisible) {
                    tracker.lastActiveTime = Date.now();
                    tracker.isReading = true;
                }
            }
        };

        // 滚动检测 - 判断用户是否在积极阅读
        const handleScroll = () => {
            if (!tracker.isVisible) return;

            const container = readingContainerRef.current;
            if (!container) return;

            const currentScrollPosition = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;

            // 计算阅读进度
            const progressPercentage = Math.min(100, (currentScrollPosition / (scrollHeight - clientHeight)) * 100);
            setReadingProgress(progressPercentage);

            // 检测哪些章节被阅读
            updateSectionProgress();

            // 如果用户滚动了足够的距离，认为是在积极阅读
            const scrollDifference = Math.abs(currentScrollPosition - tracker.lastScrollPosition);
            tracker.lastScrollPosition = currentScrollPosition;

            if (scrollDifference > 50) { // 滚动超过50px算作活跃
                if (!tracker.isReading) {
                    tracker.isReading = true;
                    tracker.lastActiveTime = Date.now();
                    startProgressTimer();
                }
            }
        };

        // 鼠标活动检测
        const handleMouseActivity = () => {
            if (!tracker.isVisible) return;

            if (!tracker.isReading) {
                tracker.isReading = true;
                tracker.lastActiveTime = Date.now();
                startProgressTimer();
            }
        };

        // 键盘活动检测（如复制文本等）
        const handleKeyActivity = () => {
            if (!tracker.isVisible) return;
            handleMouseActivity(); // 使用相同的逻辑
        };

        // 鼠标停止活动检测
        let inactivityTimer;
        const handleMouseMove = () => {
            handleMouseActivity();

            // 重置不活跃计时器
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                if (tracker.isReading && tracker.lastActiveTime) {
                    const sessionTime = (Date.now() - tracker.lastActiveTime) / 1000;
                    tracker.totalReadingTime += sessionTime;
                    updateDisplayTime();
                    sendReadingProgress();
                }
                tracker.isReading = false;
                tracker.lastActiveTime = null;
                stopProgressTimer();
            }, 30000); // 30秒无活动则停止计时
        };

        // 启动进度计时器
        const startProgressTimer = () => {
            if (tracker.progressTimer) return;

            tracker.progressTimer = setInterval(() => {
                if (tracker.isReading && tracker.lastActiveTime && tracker.isVisible) {
                    const now = Date.now();
                    const sessionTime = (now - tracker.lastActiveTime) / 1000;
                    const newTotalTime = tracker.totalReadingTime + sessionTime;

                    // 更新最后活跃时间以进行下次计算
                    tracker.lastActiveTime = now;
                    tracker.totalReadingTime = newTotalTime;

                    updateDisplayTime();
                    sendReadingProgress();
                }
            }, 5000); // 每5秒更新一次
        };

        // 停止进度计时器
        const stopProgressTimer = () => {
            if (tracker.progressTimer) {
                clearInterval(tracker.progressTimer);
                tracker.progressTimer = null;
            }
        };

        // 添加事件监听器
        document.addEventListener('visibilitychange', handleVisibilityChange);

        const container = readingContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('click', handleMouseActivity);
            container.addEventListener('keydown', handleKeyActivity);
        }

        // 初始状态设置
        if (!document.hidden) {
            tracker.isVisible = true;
            tracker.isReading = true;
            tracker.lastActiveTime = Date.now();
            startProgressTimer();
        }

        // 清理函数
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);

            if (container) {
                container.removeEventListener('scroll', handleScroll);
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('click', handleMouseActivity);
                container.removeEventListener('keydown', handleKeyActivity);
            }

            stopProgressTimer();
            clearTimeout(inactivityTimer);

            // 最后一次保存阅读时间
            if (tracker.isReading && tracker.lastActiveTime) {
                const sessionTime = (Date.now() - tracker.lastActiveTime) / 1000;
                tracker.totalReadingTime += sessionTime;
                sendReadingProgress();
            }
        };
    }, [readingContent, isAuthenticated, moduleId]);

    // 更新显示时间
    const updateDisplayTime = () => {
        const minutes = Math.floor(readingTrackerRef.current.totalReadingTime / 60);
        setReadingTime(minutes);
    };

    // 更新章节进度
    const updateSectionProgress = () => {
        if (!sectionRefs.current.length) return;

        const container = readingContainerRef.current;
        if (!container) return;

        const containerTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const viewportMiddle = containerTop + containerHeight / 2;

        // 找到当前正在阅读的章节
        sectionRefs.current.forEach((sectionRef, index) => {
            if (!sectionRef) return;

            const sectionTop = sectionRef.offsetTop;
            const sectionBottom = sectionTop + sectionRef.offsetHeight;

            if (viewportMiddle >= sectionTop && viewportMiddle <= sectionBottom) {
                setCurrentSection(index);
                readingTrackerRef.current.sectionsRead.add(index);
            }
        });
    };

    // 发送阅读进度到后端
    const sendReadingProgress = async () => {
        if (!isAuthenticated || !onReadingTimeUpdate) return;

        const currentReadingTime = Math.floor(readingTrackerRef.current.totalReadingTime / 60);

        try {
            await onReadingTimeUpdate({
                actual_reading_time_minutes: currentReadingTime,
                reading_progress_percentage: readingProgress,
                sections_read: Array.from(readingTrackerRef.current.sectionsRead)
            });
        } catch (error) {
            console.error('Error sending reading progress:', error);
        }
    };

    if (!readingContent) {
        return <div>No reading content available</div>;
    }

    return (
        <div className="reading-tracker-container">
            {/* 阅读进度显示 */}
            <div className="reading-progress-header">
                <div className="reading-stats">
                    <div className="stat-item">
                        <span className="stat-label">Reading Time:</span>
                        <span className="stat-value">{readingTime} minutes</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Reading Progress:</span>
                        <span className="stat-value">{readingProgress.toFixed(1)}%</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Estimated Time:</span>
                        <span className="stat-value">{readingContent.estimatedReadingTime} minutes</span>
                    </div>
                </div>

                <div className="reading-progress-bar">
                    <div
                        className="reading-progress-fill"
                        style={{ width: `${readingProgress}%` }}
                    ></div>
                </div>
            </div>

            {/* 章节导航 */}
            <div className="reading-sections-nav">
                {readingContent.sections.map((section, index) => (
                    <button
                        key={index}
                        className={`section-nav-btn ${currentSection === index ? 'active' : ''} ${readingTrackerRef.current.sectionsRead.has(index) ? 'read' : ''}`}
                        onClick={() => {
                            const sectionElement = sectionRefs.current[index];
                            if (sectionElement && readingContainerRef.current) {
                                readingContainerRef.current.scrollTo({
                                    top: sectionElement.offsetTop - 20,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                    >
                        {section.title}
                        {readingTrackerRef.current.sectionsRead.has(index) && (
                            <span className="section-read-indicator">✓</span>
                        )}
                    </button>
                ))}
            </div>

            {/* 阅读内容 */}
            <div
                ref={readingContainerRef}
                className="reading-content-container"
            >
                {readingContent.sections.map((section, index) => (
                    <div
                        key={index}
                        ref={el => sectionRefs.current[index] = el}
                        className="reading-section"
                    >
                        <h2 className="section-title">{section.title}</h2>
                        <div
                            className="section-content"
                            dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReadingTracker; 