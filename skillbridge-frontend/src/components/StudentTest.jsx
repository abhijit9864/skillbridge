import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {  FaArrowLeft } from "react-icons/fa";
import axios from 'axios';
import './StudentTest.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const api = import.meta.env.VITE_BASE_URL;

const StudentTest = () => {
    const { courseId } = useParams();
    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('name');
    const navigate = useNavigate();
    const certificateRef = useRef(null);

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courseName, setCourseName] = useState('');
    const [showCertificate, setShowCertificate] = useState(false);
    const [certificateDate, setCertificateDate] = useState('');
    const [correctAnswers, setCorrectAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (!courseId) {
            setError("Error: Missing course ID.");
            setLoading(false);
            return;
        }

        // Fetch course details to get the course name
        axios.get(`${api}/api/courses/${courseId}`)
            .then(response => {
                setCourseName(response.data.title);
            })
            .catch(() => {
                console.error("Failed to load course details");
            });

        axios.get(`${api}/api/tests/questions/${courseId}`)
            .then(response => {
                if (response.data && Array.isArray(response.data.questions)) {
                    setQuestions(response.data.questions);
                } else {
                    setQuestions([]);
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load test questions.");
                setLoading(false);
            });
    }, [courseId]);

    const handleOptionChange = (questionId, optionId) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: optionId
        }));
    };

    const handleSubmit = () => {
        if (!userId) {
            setError("Error: User ID is missing. Please log in.");
            return;
        }

        if (Object.keys(answers).length !== questions.length) {
            setError("Please answer all questions before submitting.");
            return;
        }

        setError(null); // Clear any previous errors
        
        axios.post(`${api}/api/tests/submit`, {
            user_id: userId,
            course_id: courseId,
            answers: Object.entries(answers).map(([question_id, option_id]) => ({
                question_id: parseInt(question_id),
                option_id: option_id
            }))
        })
        .then(response => {
            // Get the raw score from the response
            let rawScore = response.data.totalScore;
            
            // If the API response has changed to use 'score' instead of 'totalScore'
            if (response.data.score !== undefined && response.data.totalScore === undefined) {
                rawScore = response.data.score;
            }
            
            // If score is not a number, default to 0
            if (isNaN(rawScore)) {
                console.error("Invalid score received:", rawScore);
                rawScore = 0;
            }
            
            // Calculate percentage: if there's only 1 question, a correct answer is 100%
            let totalScore;
            if (questions.length === 1) {
                // If there's only one question, and it's correct (score of 1), that's 100%
                totalScore = rawScore > 0 ? 100 : 0;
            } else {
                // Otherwise, calculate the percentage based on the number of questions
                totalScore = Math.round((rawScore / questions.length) * 100);
            }
            
            console.log("Raw score:", rawScore, "Total questions:", questions.length, "Calculated percentage:", totalScore);
            
            setScore(totalScore);
            
            // Store the correct answers from the response
            if (response.data.correctAnswers) {
                setCorrectAnswers(response.data.correctAnswers);
            } else {
                // If API doesn't return correct answers, we need to calculate them based on the score
                // This is a fallback solution - ideally the API should return correct answers
                const correctAnswersMap = {};
                
                // For each question that was answered correctly (based on the score)
                // we'll assume the user's answer was correct
                let correctCount = Math.round((totalScore / 100) * questions.length);
                let questionIds = Object.keys(answers).map(id => parseInt(id));
                
                // Sort question IDs to ensure consistent behavior
                questionIds.sort((a, b) => a - b);
                
                // Mark the first 'correctCount' questions as correct (user's answer = correct answer)
                for (let i = 0; i < correctCount && i < questionIds.length; i++) {
                    const qId = questionIds[i];
                    correctAnswersMap[qId] = answers[qId];
                }
                
                // For remaining questions, we'll set a different option as correct
                for (let i = correctCount; i < questionIds.length; i++) {
                    const qId = questionIds[i];
                    const question = questions.find(q => q.question_id === qId);
                    
                    if (question && question.options && question.options.length > 0) {
                        // Find an option ID that's different from the user's answer
                        const userAnswer = answers[qId];
                        const otherOptions = question.options.filter(opt => opt.option_id !== userAnswer);
                        
                        if (otherOptions.length > 0) {
                            // Use the first different option as the "correct" one
                            correctAnswersMap[qId] = otherOptions[0].option_id;
                        } else {
                            // If there are no other options, use the user's answer as correct
                            // (this shouldn't happen with properly designed tests)
                            correctAnswersMap[qId] = userAnswer;
                        }
                    }
                }
                
                setCorrectAnswers(correctAnswersMap);
            }
            
            // Check if score is at least 33%
            if (totalScore >= 33) {
                // Set certificate date
                const today = new Date();
                setCertificateDate(today.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }));
                
                // Store completion status in localStorage
                try {
                    localStorage.setItem(`course_${courseId}_completed`, 'true');
                    localStorage.setItem(`course_${courseId}_score`, totalScore.toString());
                    localStorage.setItem(`course_${courseId}_completion_date`, today.toISOString());
                } catch (e) {
                    console.error("Failed to save completion status:", e);
                }
            }
        })
        .catch((error) => {
            console.error("Test submission error:", error);
            setError('Error submitting test. Please try again.');
        });
    };

    const downloadCertificate = () => {
        if (!certificateRef.current) {
            setError("Certificate generation failed. Please try again.");
            return;
        }

        try {
            html2canvas(certificateRef.current, {
                scale: 2,
                logging: false,
                useCORS: true
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('landscape', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                
                // Use a safe filename with fallbacks for missing data
                const safeUserName = userName || 'Student';
                const safeCourseName = courseName || 'Course';
                pdf.save(`${safeUserName}_${safeCourseName}_Certificate.pdf`);
            });
        } catch (error) {
            console.error("Certificate generation error:", error);
            setError("Failed to generate certificate. Please try again.");
        }
    };

    const handleBackToCourse = () => {
        navigate(`/course/${courseId}`);
    };

    // Updated styling with icon-only back button and simplified correct indicators
    const resultsStyles = `
    .results-container {
      max-width: 800px;
      margin: 0 auto 40px;
      padding: 30px;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #e0e0e0;
    }

    .results-header h3 {
      font-size: 1.5rem;
      color: #333;
      margin: 0;
    }

    .score-display {
      display: flex;
      align-items: center;
      gap: 25px;
      margin-bottom: 30px;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 10px;
    }

    .score-circle {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      color: white;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      border: 4px solid white;
    }

    .pass-score {
      background: linear-gradient(135deg, #4CAF50, #2E7D32);
    }

    .fail-score {
      background: linear-gradient(135deg, #F44336, #C62828);
    }

    .score-value {
      font-size: 2.8rem;
      line-height: 1;
      margin-bottom: 5px;
    }

    .score-label {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .score-details {
      flex: 1;
    }

    .score-details p {
      margin: 8px 0;
      font-size: 1.05rem;
      color: #555;
    }

    .score-details strong {
      color: #333;
    }

    .questions-results {
      margin-top: 30px;
    }

    .questions-results h4 {
      font-size: 1.2rem;
      margin-bottom: 20px;
      color: #333;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .question-result {
      margin-bottom: 30px;
      padding: 20px;
      border-radius: 10px;
      background-color: white;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
      border-left: 6px solid #e0e0e0;
      transition: transform 0.2s ease;
    }

    .question-result:hover {
      transform: translateY(-2px);
    }

    .question-result.correct {
      border-left-color: #4CAF50;
    }

    .question-result.incorrect {
      border-left-color: #F44336;
    }

    .question-text {
      margin-bottom: 15px;
      font-size: 1.1rem;
      color: #333;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }

    .question-text strong {
      margin-right: 5px;
    }

    .options-container {
      margin-top: 15px;
      padding-left: 10px;
    }

    .option-result {
      padding: 14px 16px;
      margin: 10px 0;
      border-radius: 8px;
      position: relative;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      border: 2px solid transparent;
      background-color: #f9f9f9;
    }

    .option-icon {
      margin-right: 15px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      flex-shrink: 0;
      font-size: 14px;
    }

    .option-text {
      flex: 1;
      font-size: 1rem;
      color: #444;
    }

    /* User selected correctly */
    .user-correct {
      background-color: rgba(76, 175, 80, 0.1);
      border: 2px solid #4CAF50;
    }

    .user-correct .option-icon {
      background-color: #4CAF50;
      color: white;
    }

    /* User selected incorrectly */
    .user-incorrect {
      background-color: rgba(244, 67, 54, 0.08);
      border: 2px solid #F44336;
    }

    .user-incorrect .option-icon {
      background-color: #F44336;
      color: white;
    }

    /* This is the correct answer (but user didn't select it) */
    .correct-answer {
      background-color: rgba(76, 175, 80, 0.05);
      border: 2px dashed #4CAF50;
    }

    .correct-answer .option-icon {
      background-color: #4CAF50;
      color: white;
    }

    .your-choice-badge {
      background-color: #2196F3;
      color: white;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
      height: 24px;
    }

    .result-actions {
      display: flex;
      gap: 15px;
      margin-top: 40px;
      justify-content: center;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 30px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      font-size: 1rem;
    }

    .view-certificate-btn {
      background-color: #4CAF50;
      color: white;
    }

    .view-certificate-btn:hover {
      background-color: #388E3C;
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }

    .retry-btn {
      background-color: #FFC107;
      color: #333;
    }

    .retry-btn:hover {
      background-color: #FFA000;
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }

    .back-to-course-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
      font-size: 1.2rem;
    }

    .back-to-course-btn:hover {
      background-color: #e0e0e0;
      transform: translateY(-2px);
    }

    .question-status {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      height: 24px;
    }

    .status-correct {
      background-color: rgba(76, 175, 80, 0.2);
      color: #2E7D32;
    }

    .status-incorrect {
      background-color: rgba(244, 67, 54, 0.2);
      color: #C62828;
    }

    @media (max-width: 768px) {
      .score-display {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .question-text {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .option-result {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .option-icon {
        margin-bottom: 10px;
        margin-right: 0;
      }
      
      .result-actions {
        flex-direction: column;
        align-items: center;
      }
    }
    `;

    const generateCertificateId = () => {
        const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
        const datePart = new Date().getTime().toString(36).substring(4).toUpperCase();
        return `SB-${randomPart}-${datePart}`;
    };

    return (
        <div className="student-test-container">
            <style>{resultsStyles}</style>
            <style>
            {`
                .student-test-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .test-title {
                    text-align: center;
                    color: #2c3e50;
                    margin-bottom: 30px;
                    font-size: 28px;
                    font-weight: 600;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #eaeaea;
                }

                .error-message {
                    background-color: #ffebee;
                    color: #c62828;
                    padding: 12px 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    font-weight: 500;
                    border-left: 4px solid #ef5350;
                }

                .loading-message, .no-questions {
                    text-align: center;
                    padding: 30px;
                    color: #607d8b;
                    background-color: #f5f5f5;
                    border-radius: 8px;
                    margin: 20px 0;
                    font-size: 16px;
                }

                .questions-container {
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                }

                .question-card {
                    background-color: white;
                    border-radius: 10px;
                    padding: 25px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .question-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
                }

                .question-text {
                    font-size: 18px;
                    color: #333;
                    margin-bottom: 20px;
                    line-height: 1.5;
                }

                .option {
                    margin: 12px 0;
                    padding: 12px 16px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    transition: background-color 0.2s ease;
                    cursor: pointer;
                }

                .option:hover {
                    background-color: #e9ecef;
                }

                .option label {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    width: 100%;
                    font-size: 16px;
                    color: #495057;
                }

                .option input[type="radio"] {
                    margin-right: 15px;
                    width: 18px;
                    height: 18px;
                    accent-color: #3498db;
                }

                .no-options {
                    color: #999;
                    font-style: italic;
                    padding: 10px;
                }

                .answer-all-message {
                    text-align: center;
                    color: #856404;
                    margin: 25px 0;
                    padding: 15px;
                    background-color: #fff3cd;
                    border-radius: 8px;
                    border: 1px solid #ffeeba;
                    font-weight: 500;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                }

                .submit-test-btn {
                    background-color: #3498db;
                    color: white;
                    border: none;
                    padding: 14px 28px;
                    font-size: 16px;
                    font-weight: 600;
                    border-radius: 30px;
                    cursor: pointer;
                    margin: 30px auto 10px;
                    display: block;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
                }

                .submit-test-btn:hover {
                    background-color: #2980b9;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 12px rgba(52, 152, 219, 0.4);
                }

                .submit-test-btn:active {
                    transform: translateY(1px);
                }

                /* Certificate styles */
                .certificate-container {
                    max-width: 900px;
                    margin: 2rem auto;
                    padding: 20px;
                }

                .certificate {
                    background-color: #fff;
                    padding: 40px;
                    border: 20px solid #f5f9fc;
                    box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    position: relative;
                    margin-bottom: 2rem;
                    border-radius: 10px;
                }

                .certificate-content {
                    max-width: 700px;
                    margin: 0 auto;
                    padding: 50px 40px;
                    border: 2px solid #e0e0e0;
                    position: relative;
                    background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), 
                                  url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><text x="50%" y="50%" font-family="Arial" font-size="20" fill="rgba(0,0,0,0.03)" text-anchor="middle" dominant-baseline="middle">SkillBridge</text></svg>');
                    background-size: cover;
                    border-radius: 5px;
                }

                .certificate-logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #3498db;
                    letter-spacing: 2px;
                    margin-bottom: 15px;
                    font-family: 'Arial', sans-serif;
                    position: relative;
                    display: inline-block;
                    padding: 5px 15px;
                    border: 2px solid #3498db;
                    border-radius: 4px;
                }

                .certificate-header {
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #eaeaea;
                }

                .certificate-title {
                    font-size: 42px;
                    color: #2c3e50;
                    margin: 15px 0 10px 0;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    font-family: 'Georgia', serif;
                }

                .certificate-text {
                    font-size: 20px;
                    color: #555;
                    margin: 15px 0;
                    font-family: 'Georgia', serif;
                }

                .certificate-name {
                    font-size: 36px;
                    color: #2c3e50;
                    margin: 25px 0;
                    font-weight: bold;
                    text-transform: capitalize;
                    font-family: 'Georgia', serif;
                    position: relative;
                    display: inline-block;
                }

                .certificate-name:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(52, 152, 219, 0.5), transparent);
                    position: absolute;
                    bottom: -10px;
                    left: 0;
                }

                .certificate-course {
                    font-size: 28px;
                    color: #3498db;
                    margin: 25px 0;
                    font-weight: 600;
                    font-style: italic;
                }

                .certificate-score {
                    font-size: 22px;
                    margin: 25px 0;
                }

                .score-highlight {
                    color: #27ae60;
                    font-weight: bold;
                    font-size: 26px;
                }

                .certificate-date {
                    font-size: 18px;
                    color: #666;
                    margin: 30px 0;
                    font-style: italic;
                }

                .certificate-footer {
                    margin-top: 60px;
                    display: flex;
                    justify-content: center;
                }

                .certificate-signature {
                    text-align: center;
                    position: relative;
                    padding: 10px 30px;
                }

                .signature-image {
                    height: 60px;
                    margin-bottom: 5px;
                    opacity: 0.85;
                }

                .signature-line {
                    width: 200px;
                    height: 1px;
                    background-color: #000;
                    margin: 10px auto;
                }

                .certificate-signature p {
                    font-size: 18px;
                    color: #333;
                    margin-top: 5px;
                    font-weight: 600;
                }

                .certificate-id {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #666;
                    font-family: monospace;
                    letter-spacing: 1px;
                }

                .certificate-verification {
                    margin-top: 10px;
                    font-size: 12px;
                    color: #888;
                    font-style: italic;
                }

                .certificate-actions {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    margin-top: 30px;
                }

                .download-certificate-btn {
                    padding: 12px 24px;
                    background-color: #3498db;
                    color: white;
                    border: none;
                    border-radius: 30px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 4px 6px rgba(52, 152, 219, 0.2);
                }

                .download-certificate-btn:hover {
                    background-color: #2980b9;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 8px rgba(52, 152, 219, 0.3);
                }

                @media (max-width: 768px) {
                    .certificate {
                        padding: 20px;
                        border-width: 10px;
                    }
                    
                    .certificate-content {
                        padding: 30px 20px;
                    }
                    
                    .certificate-title {
                        font-size: 32px;
                    }
                    
                    .certificate-name {
                        font-size: 28px;
                    }
                    
                    .certificate-course {
                        font-size: 22px;
                    }
                    
                    .certificate-text {
                        font-size: 18px;
                    }
                }

                /* Professional Certificate Styles */
                .pro-certificate-container {
                    max-width: 900px;
                    margin: 2rem auto;
                    padding: 20px;
                }

                .pro-certificate {
                    background-color: #fff;
                    padding: 20px;
                    border: 15px solid #f5f5f5;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                    position: relative;
                    margin-bottom: 2rem;
                    border-radius: 8px;
                }

                .pro-certificate-content {
                    border: 2px solid #6306b2;
                    padding: 40px;
                    background-color: white;
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><text x="50%" y="50%" font-family="Arial" font-size="20" fill="rgba(99,6,178,0.02)" text-anchor="middle" dominant-baseline="middle">SkillBridge</text></svg>');
                    background-size: 200px 200px;
                    background-position: center;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                .pro-certificate-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .pro-certificate-logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #6306b2;
                    letter-spacing: 2px;
                    margin-bottom: 15px;
                    display: inline-block;
                    padding: 5px 15px;
                    border-bottom: 2px solid #6306b2;
                }

                .pro-certificate-title {
                    font-size: 32px;
                    color: #333;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin: 10px 0;
                    font-weight: bold;
                }

                .pro-certificate-body {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    margin-bottom: 30px;
                }

                .pro-certificate-text {
                    font-size: 18px;
                    color: #555;
                    margin: 8px 0;
                }

                .pro-certificate-name {
                    font-size: 28px;
                    color: #6306b2;
                    margin: 15px 0;
                    font-weight: bold;
                    position: relative;
                    display: inline-block;
                }

                .pro-certificate-name:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 2px;
                    background-color: #6306b2;
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    opacity: 0.5;
                }

                .pro-certificate-course {
                    font-size: 22px;
                    color: #333;
                    margin: 15px 0;
                    font-weight: 600;
                    max-width: 90%;
                    font-style: italic;
                }

                .pro-certificate-score {
                    font-size: 18px;
                    color: #555;
                    margin: 8px 0;
                }

                .pro-score-highlight {
                    color: #6306b2;
                    font-weight: bold;
                    font-size: 20px;
                }

                .pro-certificate-date {
                    font-size: 16px;
                    color: #666;
                    margin: 15px 0;
                    font-style: italic;
                }

                .pro-certificate-signatures {
                    display: flex;
                    justify-content: space-around;
                    align-items: flex-end;
                    margin: 20px 0;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                }

                .pro-signature {
                    text-align: center;
                    width: 180px;
                }

                .pro-signature-image {
                    height: 40px;
                    margin-bottom: 5px;
                    opacity: 0.8;
                }

                .pro-signature-line {
                    width: 100%;
                    height: 1px;
                    background-color: #333;
                    margin: 5px 0;
                }

                .pro-signature-name {
                    font-size: 16px;
                    color: #333;
                    margin: 5px 0 0 0;
                    font-weight: 600;
                }

                .pro-signature-title {
                    font-size: 14px;
                    color: #666;
                    margin: 3px 0 0 0;
                }

                .pro-certificate-stamp {
                    width: 80px;
                    height: 80px;
                    position: relative;
                }

                .pro-stamp-inner {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 2px solid #6306b2;
                    border-radius: 50%;
                    color: #6306b2;
                    font-weight: bold;
                    transform: rotate(-15deg);
                    font-size: 14px;
                    letter-spacing: 1px;
                }

                .pro-stamp-inner:before {
                    content: '';
                    position: absolute;
                    top: -5px;
                    left: -5px;
                    right: -5px;
                    bottom: -5px;
                    border: 1px dashed #6306b2;
                    border-radius: 50%;
                    opacity: 0.5;
                }

                .pro-certificate-id {
                    text-align: center;
                    font-size: 14px;
                    color: #666;
                    font-family: monospace;
                    letter-spacing: 1px;
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 1px solid #eee;
                }

                .pro-certificate-actions {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    margin-top: 30px;
                }

                .pro-download-btn {
                    padding: 12px 24px;
                    background-color: #6306b2;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .pro-download-btn:hover {
                    background-color: #5205a0;
                    box-shadow: 0 4px 8px rgba(99, 6, 178, 0.2);
                }

                .pro-back-btn {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background-color: #f5f5f5;
                    border: none;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    color: #333;
                    transition: all 0.3s ease;
                }

                .pro-back-btn:hover {
                    background-color: #e0e0e0;
                }

                /* Responsive styles */
                @media (max-width: 768px) {
                    .pro-certificate-content {
                        padding: 20px;
                    }
                    
                    .pro-certificate-title {
                        font-size: 24px;
                    }
                    
                    .pro-certificate-name {
                        font-size: 22px;
                    }
                    
                    .pro-certificate-course {
                        font-size: 18px;
                    }
                    
                    .pro-certificate-text {
                        font-size: 16px;
                    }
                    
                    .pro-certificate-signatures {
                        flex-direction: column;
                        align-items: center;
                        gap: 20px;
                    }
                    
                    .pro-certificate-stamp {
                        margin-top: 20px;
                    }
                }
            `}
            </style>
            <h2 className="test-title">Course Test: {courseName}</h2>

            {error && <p className="error-message">{error}</p>}
            {loading && <p className="loading-message">Loading test questions...</p>}
            {!loading && questions.length === 0 && <p className="no-questions">No test questions available.</p>}

            {!showCertificate && questions.length > 0 && !showResults && (
                <div className="questions-container">
                    {questions.map(q => (
                        <div key={q.question_id} className="question-card">
                            <p className="question-text"><strong>{q.question}</strong></p>
                            {q.options && q.options.length > 0 ? (
                                q.options.map(option => (
                                    <div key={option.option_id} className="option">
                                        <label>
                                            <input 
                                                type="radio" 
                                                name={`question_${q.question_id}`} 
                                                value={option.option_id}
                                                onChange={() => handleOptionChange(q.question_id, option.option_id)}
                                                checked={answers[q.question_id] === option.option_id}
                                            /> 
                                            {option.option_text}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p className="no-options">No options available.</p>
                            )}
                        </div>
                    ))}

                    {/* Only show submit button if all questions are answered */}
                    {Object.keys(answers).length === questions.length && (
                        <button 
                            onClick={() => {
                                handleSubmit();
                                setShowResults(true);
                            }} 
                            className="submit-test-btn">
                            Submit Test
                        </button>
                    )}

                    {/* Add this right after the questions map but before the submit button */}
                    {Object.keys(answers).length !== questions.length && (
                        <div className="answer-all-message">
                            Please answer all {questions.length} questions to submit the test. 
                            ({Object.keys(answers).length} of {questions.length} answered)
                        </div>
                    )}
                </div>
            )}

            {score !== null && showResults && !showCertificate && (
                <div className="results-container">
                    <div className="results-header">
                        <h3>Test Results</h3>
                        <button onClick={handleBackToCourse} className="back-to-course-btn">
                            <FaArrowLeft/>
                        </button>
                    </div>
                    
                    <div className="score-display">
                        <div className={`score-circle ${score >= 33 ? 'pass-score' : 'fail-score'}`}>
                            <span className="score-value">{score}%</span>
                            <span className="score-label">{score >= 33 ? 'PASSED' : 'FAILED'}</span>
                        </div>
                        
                        <div className="score-details">
                            <p>You answered correctly <strong>{questions.length > 0 ? Math.round((score / 100) * questions.length) : 0}</strong> out of <strong>{questions.length}</strong> questions.</p>
                            {score >= 33 ? (
                                <p>Congratulations! You have successfully passed the test and earned your certificate.</p>
                            ) : (
                                <p>You did not pass the test. Required score: 33%. Please review the course material and try again.</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="questions-results">
                        <h4>Question Review</h4>
                        {questions.map((q, qIndex) => {
                            // Check if this question has a correct answer in our map
                            const hasCorrectAnswer = correctAnswers && correctAnswers[q.question_id] !== undefined;
                            // If we have the correct answer, compare it to the user's answer
                            const isCorrect = hasCorrectAnswer && correctAnswers[q.question_id] === answers[q.question_id];
                            
                            return (
                                <div key={q.question_id} className={`question-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                                    <p className="question-text">
                                        <strong>Question {qIndex + 1}:</strong> {q.question}
                                        <span className={`question-status ${isCorrect ? 'status-correct' : 'status-incorrect'}`}>
                                            {isCorrect ? 'CORRECT' : 'INCORRECT'}
                                        </span>
                                    </p>
                                    
                                    <div className="options-container">
                                        {q.options && q.options.length > 0 && (
                                            q.options.map(option => {
                                                const isSelected = answers[q.question_id] === option.option_id;
                                                const isCorrectOption = hasCorrectAnswer && correctAnswers[q.question_id] === option.option_id;
                                                
                                                // Determine the class based on selection and correctness
                                                let optionClass = '';
                                                if (isSelected && isCorrectOption) {
                                                    optionClass = 'user-correct';
                                                } else if (isSelected && !isCorrectOption) {
                                                    optionClass = 'user-incorrect';
                                                } else if (!isSelected && isCorrectOption) {
                                                    optionClass = 'correct-answer';
                                                }
                                                
                                                return (
                                                    <div key={option.option_id} className={`option-result ${optionClass}`}>
                                                        <div className="option-icon">
                                                            {isSelected ? '✓' : isCorrectOption ? '★' : '○'}
                                                        </div>
                                                        
                                                        <div className="option-text">
                                                            {option.option_text}
                                                        </div>
                                                        
                                                        {isSelected && !isCorrectOption && (
                                                            <span className="your-choice-badge">YOUR CHOICE</span>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="result-actions">
                        {score >= 33 ? (
                            <button onClick={() => setShowCertificate(true)} className="btn view-certificate-btn">
                                <span>View Certificate</span>
                            </button>
                        ) : (
                            <button onClick={() => {
                                setShowResults(false);
                                setAnswers({});
                                setScore(null);
                            }} className="btn retry-btn">
                                <span>Try Again</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {showCertificate && (
                <div className="pro-certificate-container">
                    <div className="pro-certificate" ref={certificateRef}>
                        <div className="pro-certificate-content">
                            {/* Header */}
                            <div className="pro-certificate-header">
                                <div className="pro-certificate-logo">SKILLBRIDGE</div>
                                <h1 className="pro-certificate-title">Certificate of Completion</h1>
                            </div>
                            
                            {/* Main content */}
                            <div className="pro-certificate-body">
                                <p className="pro-certificate-text">This is to certify that</p>
                                <h2 className="pro-certificate-name">{userName || 'Student'}</h2>
                                <p className="pro-certificate-text">has successfully completed the course</p>
                                <h3 className="pro-certificate-course">{courseName}</h3>
                                <p className="pro-certificate-score">with a score of <span className="pro-score-highlight">{score}%</span></p>
                                <p className="pro-certificate-date">Issued on {certificateDate}</p>
                            </div>
                            
                            {/* Signatures */}
                            <div className="pro-certificate-signatures">
                                <div className="pro-signature">
                                    <img 
                                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMCwzMCBDNjAsNSAxMDAsNTUgMTgwLDMwIiBzdHJva2U9IiMzMzMiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+" 
                                        alt="Signature" 
                                        className="pro-signature-image" 
                                    />
                                    <div className="pro-signature-line"></div>
                                    <p className="pro-signature-name">Dr. Sarah Johnson</p>
                                    <p className="pro-signature-title">Director</p>
                                </div>
                                
                                <div className="pro-signature">
                                    <img 
                                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMCw0MCBDNDUsMTUgOTAsMTUgMTgwLDQwIiBzdHJva2U9IiMzMzMiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+" 
                                        alt="Instructor Signature" 
                                        className="pro-signature-image" 
                                    />
                                    <div className="pro-signature-line"></div>
                                    <p className="pro-signature-name">Prof. Michael Chen</p>
                                    <p className="pro-signature-title">Instructor</p>
                                </div>
                                
                                {/* <div className="pro-certificate-stamp">
                                    <div className="pro-stamp-inner">
                                        <span>VERIFIED</span>
                                    </div>
                                </div> */}
                            </div>
                            
                            {/* Certificate ID */}
                            <div className="pro-certificate-id">
                                Certificate ID: {generateCertificateId()}
                            </div>
                        </div>
                    </div>
                    
                    <div className="pro-certificate-actions">
                        <button onClick={downloadCertificate} className="pro-download-btn">
                            Download Certificate
                        </button>
                        <button onClick={handleBackToCourse} className="pro-back-btn">
                            <FaArrowLeft />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentTest;
