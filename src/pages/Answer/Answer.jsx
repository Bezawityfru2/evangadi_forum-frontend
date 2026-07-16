import React, { useState, useEffect } from "react";
import classes from "./Answer.module.css";
import { IoMdContact } from "react-icons/io";
import instance from "../../api/axios";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

function Answer() {
  const { questionId } = useParams();
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [question, setQuestion] = useState({ title: "", description: "" });
  const [answers, setAnswers] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await instance.get(`/questions/${questionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuestion({
          title: response.data.questions.title,
          description: response.data.questions.description,
        });
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAnswers = async () => {
      try {
        console.log("questionId:", questionId);
        // Backend returns answers directly
        const response = await instance.get(`/answers/${questionId}`);

        console.log("Response:", response.data);

        setAnswers(response.data.answers || []);
      } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
        console.error("Error fetching answers:", error);
      }
    };

    fetchQuestion();
    fetchAnswers();
  }, [questionId]);

  const postAnswer = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!answer.trim()) {
      setErrorMessage("Please provide an answer.");
      return;
    }

    try {
      await instance.post(
        `/answers`,
        { question_id: questionId, content: answer },
        // Fixed to match backend
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccessMessage("Answer posted successfully");
      setAnswer("");
      try {
        const { data } = await instance.get(`/answers/${questionId}`);
        setAnswers(data.answers);
      } catch (error) {
        console.error("GET answers faield:", error.response?.data || error.message);
      }
    } catch (error) {
      console.error(
        "POST answer fialed:",
        error.response?.data || error.message,
      );
      setSuccessMessage("");
      setErrorMessage("Something went wrong. Try again later.");
    }
  };
  return (
    <>
      {isloading ? (
        <Loader />
      ) : (
        <main>
          <section className={classes.question_section}>
            <h2>Question</h2>
            <h3>{question.title}</h3>
            <p className={classes.link_work}>{question.description}</p>
            <br />
          </section>

          <section className={classes.answer_section}>
            <h2>Answer From The Community</h2>
            <hr />
            {answers.length > 0 ? (
              answers.map((item, index) => (
                <div className={classes.answer} key={item.answer_id || index}>
                  <div>
                    <IoMdContact size={80} />
                    <h4 className={classes.username}>{item.username}</h4>
                  </div>
                  <div className={classes.margin}>
                    <p>{item.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>
                This question hasn't been answered yet. Share your knowledge to
                help others.
              </p>
            )}
          </section>

          <section className={classes.answer_form}>
            <h2>Answer The Question</h2>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && (
              <p className={classes.success}>{successMessage}</p>
            )}
            <textarea
              placeholder="Your Answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows="8"
              required
            />
            <button className={classes.submit_btn} onClick={postAnswer}>
              Post Your Answer
            </button>
          </section>
        </main>
      )}
    </>
  );
}
export default Answer;
