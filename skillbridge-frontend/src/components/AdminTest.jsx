import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
import "./AdminTest.css";
import Navbar from "../landingPage/navbar";
const api = import.meta.env.VITE_BASE_URL;

export const AdminTest = () => {
  const { courseId } = useParams(); // Get courseId from URL
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Course ID from URL:", courseId); // Debugging log
    if (!courseId) return;

    axios
      .get(`${api}/api/tests/questions/${courseId}`)
      .then((response) => {
        console.log("Fetched questions:", response.data);
        setQuestions(Array.isArray(response.data.questions) ? response.data.questions : []);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, [courseId]);

  const addOrUpdateQuestion = async () => {
    if (!newQuestion.trim()) {
      setError("Question cannot be empty.");
      return;
    }
    
    // Validate options - ensure we have at least 2 non-empty options
    const nonEmptyOptions = options.filter(opt => typeof opt === 'string' ? opt.trim() !== '' : opt.option_text.trim() !== '');
    if (nonEmptyOptions.length < 2) {
      setError("At least 2 options are required.");
      return;
    }
    
    // Prepare options for API - ensure we're sending strings
    const optionsForAPI = options.map(opt => 
      typeof opt === 'string' ? opt : opt.option_text
    );
  
    const payload = {
      course_id: Number(courseId),
      question: newQuestion,
      options: optionsForAPI,
      correct_option: correctOption,
    };
  
    try {
      if (editingQuestion) {
        console.log("Updating question with payload:", payload);
        await axios.put(
          `${api}/api/tests/questions/${editingQuestion.question_id}`,
          payload
        );
        
        // Refresh questions after update
        const refreshResponse = await axios.get(`${api}/api/tests/questions/${courseId}`);
        setQuestions(Array.isArray(refreshResponse.data.questions) ? refreshResponse.data.questions : []);
        
      } else {
        console.log("Adding new question with payload:", payload);
        await axios.post(
          `${api}/api/tests/questions`, 
          payload
        );
        
        // Refresh questions after adding
        const refreshResponse = await axios.get(`${api}/api/tests/questions/${courseId}`);
        setQuestions(Array.isArray(refreshResponse.data.questions) ? refreshResponse.data.questions : []);
      }
  
      // Reset fields
      setNewQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectOption(0);
      setEditingQuestion(null);
      setError(null);
    } catch (error) {
      console.error("Error saving question:", error);
      setError("Error saving question: " + (error.response?.data?.error || error.message));
    }
  };
  
  const deleteQuestion = async (questionId) => {
    try {
      await axios.delete(`${api}/api/tests/questions/${questionId}`);
      setQuestions(questions.filter((q) => q.question_id !== questionId));
    } catch (err) {
      console.error("Error deleting question:", err);
      setError("Failed to delete question. Please try again.");
    }
  };

  const startEditing = (question) => {
    console.log("Editing question:", question);
    setEditingQuestion(question);
    setNewQuestion(question.question);
    
    // Extract option texts from the options objects
    const optionTexts = question.options.map(opt => opt.option_text);
    
    // Pad with empty strings if less than 4 options
    while (optionTexts.length < 4) {
      optionTexts.push("");
    }
    
    setOptions(optionTexts);
    
    // Find the index of the correct option
    const correctOptionIndex = question.options.findIndex(
      opt => opt.option_id === question.correct_option_id
    );
    
    setCorrectOption(correctOptionIndex !== -1 ? correctOptionIndex : 0);
    
    // Scroll to the test container
    document.querySelector('.admin-test-container').scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingQuestion(null);
    setNewQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectOption(0);
    setError(null);
  };

  return (
    <>
      <Navbar />
      <div className="admin-test-container">
        <h2 className="admin-test-header">
          {editingQuestion ? "Edit Question" : "Add New Question"}
        </h2>

        {/* Add or Edit Question */}
        <div className="input-group">
          {/* <h3 className="form-section-title">
            {editingQuestion ? "Edit Question" : "Create New Question"}
          </h3> */}
          
          <div className="question-section">
            <div className="question-input-container">
              <textarea
                id="question-input"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter your question here..."
                className="question-input"
              ></textarea>
            </div>
          </div>
          
          <div className="options-section">
            <label>Answer Options</label>
            <p className="options-hint">Add multiple options and select the correct answer</p>
            
            <div className="options-container">
              {options.map((opt, index) => (
                <div 
                  key={index} 
                  className={`option-input-container ${correctOption === index ? 'selected' : ''}`}
                >
                  <div className="option-number">{String.fromCharCode(65 + index)}</div>
                  <input
                    type="text"
                    value={typeof opt === 'string' ? opt : opt.option_text}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="option-input"
                  />
                  <label 
                    className={`radio-label ${correctOption === index ? 'selected' : ''}`}
                    onClick={() => setCorrectOption(index)}
                  >
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctOption === index}
                      onChange={() => setCorrectOption(index)}
                    />
                    Correct
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <div className="action-buttons-container">
            {editingQuestion && (
              <button className="cancel-btn" onClick={cancelEditing}>
                Cancel Editing
              </button>
            )}
            <button className="add-btn" onClick={addOrUpdateQuestion}>
              {editingQuestion ? "Update Question" : "Save Question"}
            </button>
          </div>
        </div>

        <h2 className="admin-test-header">Existing Questions</h2>
        
        {/* Display Questions */}
        <div className="questions-list">
          {questions.length > 0 ? (
            questions.map((q) => (
              <div key={q.question_id} className="question-item">
                <h3>{q.question}</h3>
                <ul className="options-list">
                  {(q.options && Array.isArray(q.options)) ? (
                    q.options.map((opt, index) => (
                      <li key={index} className={opt.option_id === q.correct_option_id ? "correct-option" : ""}>
                        {String.fromCharCode(65 + index)}. {opt.option_text} {opt.option_id === q.correct_option_id && <span className="correct-badge">✓</span>}
                      </li>
                    ))
                  ) : (
                    <li className="error-message">No options available</li>
                  )}
                </ul>
                <div className="question-actions">
                  <button className="edit-btn" onClick={() => startEditing(q)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => deleteQuestion(q.question_id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-questions">No questions available. Add your first question above.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminTest;
