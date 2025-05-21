import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { modulesData } from '../data/mockData';

const ModulePage = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const [moduleInfo, setModuleInfo] = useState(null);

    useEffect(() => {
        const data = modulesData[moduleId];
        if (data) {
            setModuleInfo(data);
        } else {
            // Handle module not found, maybe set a default or error state
            setModuleInfo({
                title: moduleId ? moduleId.replace(/_/g, ' ') : "Unknown Module",
                error: "Content for this module was not found."
            });
        }
    }, [moduleId]);

    if (!moduleInfo) return <div>Loading module...</div>;

    const pageTitle = `Module: ${moduleInfo.title}`;

    return (
        <>
            <Header pageTitle={pageTitle} showDashboardButton={true}/>
            <div className="module-container">
                <h2>{moduleInfo.error ? moduleInfo.title : `Content for ${moduleInfo.title}`}</h2>
                
                {moduleInfo.error && <p>{moduleInfo.error}</p>}

                {!moduleInfo.error && moduleInfo.videoId && (
                    <>
                        <h3>Study Video</h3>
                        <div className="video-container">
                            <iframe 
                                width="560" 
                                height="315" 
                                src={`https://www.youtube.com/embed/${moduleInfo.videoId}`} 
                                title={`YouTube video player - ${moduleInfo.title}`} 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowFullScreen>
                            </iframe>
                        </div>
                    </>
                )}

                {!moduleInfo.error && moduleInfo.references && moduleInfo.references.length > 0 && (
                    <>
                        <h3>Reference Materials & Books</h3>
                        <ul className="reference-list">
                            {moduleInfo.references.map((ref, index) => (
                                <li key={index}>
                                    <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.text}</a>
                                </li>
                            ))}
                            {/* Example of a non-link item, adapt as needed */}
                            {moduleId === "python_fundamentals" && 
                                <li>"Python Crash Course, 3rd Edition" by Eric Matthes - (Consider linking to a bookstore)</li>
                            }
                        </ul>
                    </>
                )}

                {!moduleInfo.error && moduleInfo.topics && moduleInfo.topics.length > 0 && (
                    <>
                        <h3>Key Topics Covered</h3>
                        <ul className="key-topics-list">
                            {moduleInfo.topics.map((topic, index) => (
                                <li key={index}>{topic}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </>
    );
};

export default ModulePage;