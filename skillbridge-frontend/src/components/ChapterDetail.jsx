import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaStar, FaArrowLeft, FaThumbsUp, FaBookmark, FaArrowRight, FaClipboardCheck } from "react-icons/fa";
import Navbar from "../landingPage/navbar";
import "./chapter-detail.css";
const api = import.meta.env.VITE_BASE_URL;

const ChapterDetail = () => {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const location = useLocation();

  const [chapters, setChapters] = useState([]);
  const [chapter, setChapter] = useState(null);
  const [courseInfo, setCourseInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [progress, setProgress] = useState(0);
  const [unlockedChapters, setUnlockedChapters] = useState([]);
  const [videoDuration, setVideoDuration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);
  const [prevChapter, setPrevChapter] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [userRole, setUserRole] = useState(null);
  const [allChaptersCompleted, setAllChaptersCompleted] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setUserRole(storedRole ? parseInt(storedRole) : null);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, chaptersRes, reviewsRes] = await Promise.all([
          fetch(`${api}/api/courses/${courseId}`),
          fetch(`${api}/api/courses/${courseId}/chapters`),
          fetch(`${api}/api/reviews/reviews/${chapterId}`),
        ]);

        if (!courseRes.ok || !chaptersRes.ok || !reviewsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const courseData = await courseRes.json();
        const chaptersData = await chaptersRes.json();
        const reviewsData = await reviewsRes.json();

        setCourseInfo(courseData);
        setChapters(chaptersData.chapters);

        const selectedChapter = chaptersData.chapters.find(
          (ch) => ch.chapter_id === parseInt(chapterId)
        );
        if (!selectedChapter) throw new Error("Chapter not found");

        setChapter(selectedChapter);
        setReviews(reviewsData.reviews);

        // Find the current chapter index
        const currentIndex = chaptersData.chapters.findIndex(
          (ch) => ch.chapter_id === parseInt(chapterId)
        );
        
        // Set next chapter if available
        if (currentIndex < chaptersData.chapters.length - 1) {
          setNextChapter(chaptersData.chapters[currentIndex + 1]);
        }
        
        // Set previous chapter if available
        if (currentIndex > 0) {
          setPrevChapter(chaptersData.chapters[currentIndex - 1]);
        }

        const savedProgress = localStorage.getItem(`progress_${courseId}_${chapterId}`);
        if (savedProgress) setProgress(parseFloat(savedProgress));

        const savedUnlocked = JSON.parse(localStorage.getItem(`unlockedChapters_${courseId}`)) || [];
        setUnlockedChapters(savedUnlocked);
        
        // Check if all chapters are completed
        checkAllChaptersCompleted(chaptersData.chapters);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, chapterId]);

  // Function to check if all chapters are completed
  const checkAllChaptersCompleted = (chaptersData) => {
    if (!chaptersData || chaptersData.length === 0) return;
    
    let allCompleted = true;
    
    for (const chapter of chaptersData) {
      const chapterProgress = localStorage.getItem(`progress_${courseId}_${chapter.chapter_id}`);
      if (!chapterProgress || parseFloat(chapterProgress) < 90) {
        allCompleted = false;
        break;
      }
    }
    
    setAllChaptersCompleted(allCompleted);
    
    // If all chapters are completed and we're on the last chapter, show completion message
    if (allCompleted && chaptersData.length > 0) {
      const currentIndex = chaptersData.findIndex(ch => ch.chapter_id === parseInt(chapterId));
      if (currentIndex === chaptersData.length - 1) {
        setShowCompletionMessage(true);
        setTimeout(() => {
          // Redirect to course page with query parameter to show test section
          navigate(`/course/${courseId}?showTest=true`);
        }, 3000);
      }
    }
  };

  useEffect(() => {
    if (progress >= 90) {
      // Unlock next chapter logic
      const currentIndex = chapters.findIndex((ch) => ch.chapter_id === parseInt(chapterId));
      if (currentIndex < chapters.length - 1) {
        setUnlockedChapters((prevUnlocked) => {
          const newUnlocked = [...new Set([...prevUnlocked, chapters[currentIndex + 1].chapter_id])];
          localStorage.setItem(`unlockedChapters_${courseId}`, JSON.stringify(newUnlocked));
          return newUnlocked;
        });
      }
      
      // Check if all chapters are completed after updating progress
      checkAllChaptersCompleted(chapters);
    }
  }, [progress, chapters, chapterId, courseId, navigate]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const watchedPercentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      const newProgress = Math.floor(watchedPercentage);

      if (newProgress % 5 === 0 && newProgress !== progress) {
        setProgress(newProgress);
        localStorage.setItem(`progress_${courseId}_${chapterId}`, newProgress);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      const savedTime = localStorage.getItem(`videoTime_${courseId}_${chapterId}`);
      if (savedTime) {
        videoRef.current.currentTime = parseFloat(savedTime);
      }
    }
  };

  useEffect(() => {
    const fetchPlaybackPosition = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      try {
        const response = await fetch(`${api}/api/getPlaybackPosition/${userId}/${courseId}/${chapterId}`);
        const data = await response.json();
        if (data.success) {
          videoRef.current.currentTime = data.playback_position;
        }
      } catch (error) {
        console.error("Failed to fetch playback position:", error);
      }
    };

    fetchPlaybackPosition();
  }, [courseId, chapterId]);

  useEffect(() => {
    // Save video position when component unmounts
    return () => {
      if (videoRef.current) {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        fetch('${api}/api/savePlaybackPosition', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            course_id: courseId,
            chapter_id: chapterId,
            playback_position: videoRef.current.currentTime,
          }),
        }).catch(error => console.error("Failed to save playback position:", error));
      }
    };
  }, [courseId, chapterId]);

  const handleNextChapter = () => {
    if (allChaptersCompleted) {
      // If all chapters are completed, redirect to course detail page with test section
      navigate(`/course/${courseId}?showTest=true`);
      return;
    }

    if (nextChapter && unlockedChapters.includes(nextChapter.chapter_id)) {
      navigate(`/courses/${courseId}/chapters/${nextChapter.chapter_id}`);
    } else {
      // If this is the last chapter or next chapter is locked, go back to course page
      navigate(`/course/${courseId}`);
    }
  };

  const handlePrevChapter = () => {
    if (prevChapter) {
      navigate(`/courses/${courseId}/chapters/${prevChapter.chapter_id}`);
    } else {
      // If this is the first chapter, go back to course page
      navigate(`/course/${courseId}`);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("Please log in to submit a review");
      return;
    }

    try {
      const response = await fetch(`${api}/api/reviews/reviews/${chapterId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (response.ok) {
        // Refresh reviews after successful submission
        const reviewsRes = await fetch(`${api}/api/reviews/reviews/${chapterId}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews);
        
        // Reset form
        setNewReview({ rating: 0, comment: "" });
        setShowReviewForm(false);
      } else {
        const error = await response.json();
        alert(error.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleTakeTest = () => {
    navigate(`/courses/${courseId}/test`);
  };

  useEffect(() => {
    // Check if showTest parameter exists in URL
    const params = new URLSearchParams(location.search);
    const showTest = params.get('showTest');
    
    if (showTest === 'true') {
      // Find the test section element and scroll to it
      const testSection = document.getElementById('test-section');
      if (testSection) {
        testSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;
  if (!chapter || !courseInfo) return <p className="error-text">Data not found</p>;

  return (
    <>
      <Navbar activePage="courses" setActivePage={() => {}} />
      
      {showCompletionMessage && (
        <div className="completion-message-overlay">
          <div className="completion-message-container">
            <div className="completion-icon">🎉</div>
            <h2>Congratulations!</h2>
            <p>You have successfully completed all chapters in this course.</p>
            <p className="redirect-text">Redirecting to course page...</p>
          </div>
        </div>
      )}
      
      <div className="chapter-detail-container youtube-style">
        <div className="video-main-section">
          <div className="video-player-container">
            <video
              key={chapter.video_url}
              controls
              autoPlay
              className="video-player"
              ref={videoRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            >
              <source src={`${api}${chapter.video_url}`} type="video/mp4" />
            </video>
          </div>

          <div className="video-info-section">
            <h1 className="video-title">{chapter.title}</h1>
            <div className="video-meta-info">
              <span className="course-name">{courseInfo.title}</span>
              {videoDuration && (
                <span className="video-duration">{Math.floor(videoDuration / 60)} min {Math.floor(videoDuration % 60)} sec</span>
              )}
              <div className="progress-indicator">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="progress-text">{progress}% completed</span>
              </div>
            </div>
            
            <div className="video-actions">
              <button className="action-btn like-btn">
                <FaThumbsUp /> Like
              </button>
              <button className="action-btn save-btn">
                <FaBookmark /> Save
              </button>
              
              <div className="navigation-buttons">
                {prevChapter && (
                  <button className="action-btn prev-btn" onClick={handlePrevChapter}>
                    <FaArrowLeft /> Previous
                  </button>
                )}
                
                {nextChapter && unlockedChapters.includes(nextChapter.chapter_id) && (
                  <button className="action-btn next-btn" onClick={handleNextChapter}>
                    Next <FaArrowRight />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="video-details-card">
            <h3>Chapter Details</h3>
            <p dangerouslySetInnerHTML={{ __html: chapter.description }}></p>
          </div>

          {allChaptersCompleted && userRole === 1 && (
            <div className="test-section">
              <h3>Final Assessment</h3>
              <p>You have completed all chapters in this course. You can now take the final test.</p>
              <button className="take-test-btn" onClick={handleTakeTest}>
                <FaClipboardCheck /> Take Test
              </button>
            </div>
          )}

          <div className="review-section">
            <h3>Reviews</h3>
            {userRole === 1 && (
              <button 
                className="add-review-btn"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? "Cancel Review" : "Add Review"}
              </button>
            )}

            {showReviewForm && (
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={star <= newReview.rating ? "star filled" : "star"}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    />
                  ))}
                </div>
                <textarea
                  className="review-textarea"
                  placeholder="Write your review here..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                />
                <button type="submit" className="submit-btn">Submit Review</button>
              </form>
            )}

            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review">
                  <p><strong>{review.user_name}</strong></p>
                  <p>{review.comment}</p>
                  <div className="rating">
                    {Array(review.rating).fill(<FaStar color="gold" />)}
                  </div>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
      
      <button
        className="back-to-course-btn"
        onClick={() => navigate(`/course/${courseId}`)}
        title="Back to Course"
      >
        <FaArrowLeft />
      </button>
    </>
  );
};

export default ChapterDetail;
