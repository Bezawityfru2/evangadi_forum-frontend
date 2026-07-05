import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../components/DataContext/DataContext";
import { IoMdContact, IoIosArrowForward } from "react-icons/io";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import instance from "../../api/axios";
import classes from "./Home.module.css";

function Home() {
  const { User, setUser } = useContext(AppContext);
  const token = localStorage.getItem("token");
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [filteredQuestions, setfilteredQuestions] = useState([]);

  const navigate = useNavigate();
  const location = useLocation(); // Get navigation state

  async function loadQuestions() {
    try {
      setIsLoading(true);
      const { data } = await instance.get("/questions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Questions:", data);

      setQuestions(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error loading questions:", error);
      navigate("/login");
    }
  }

  async function checkUser() {
    const token = localStorage.getItem("token");
    try {
      const { data } = await instance.get("/users/checkUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);

      setUser(data.user);
      console.log("Token in Home:", token);
    } catch (error) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      console.log(error);

      navigate("/login");
    }
  }

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      checkUser();
      loadQuestions();
    }
    init();
  }, []);

  useEffect(() => {
    // Add new question from state if it exists
    if (location.state?.newQuestion) {
      setQuestions((prev) => {
        // Avoid duplicates by checking question_id
        if (
          prev.some(
            (q) => q.question_id === location.state.newQuestion.question_id,
          )
        ) {
          return prev;
        }
        return [location.state.newQuestion, ...prev];
      });
    }
  }, [location.state]);

  useEffect(() => {
    if (!Array.isArray(questions)) return;
    const filtered = questions.filter((question) =>
      question.title.toLowerCase().includes(searchItem.toLowerCase()),
    );
    console.log("questions:", questions);
    console.log("Is array?", Array.isArray(questions));

    setfilteredQuestions(filtered);
  }, [searchItem, questions]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <section className={classes.home__container}>
          <div className={classes.home__topcontainer}>
            <div>
              <Link to="/questions">Ask Question</Link>
            </div>
            <div style={{ fontSize: "20px", fontWeight: "600" }}>
              <p>
                Welcome,{" "}
                <span style={{ color: "orange" }}>{checkUser.username}!</span>
              </p>
            </div>
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "300",
              marginBottom: "20px",
            }}
          >
            <div className={classes.search}>
              <input
                type="text"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                placeholder="Search question"
              />
            </div>
          </div>
          <div>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question, i) => (
                <div
                  className={classes.question__outercontainer}
                  key={question.question_id || i}
                >
                  <hr />
                  <div className={classes.home__questioncontainer}>
                    <div className={classes.home__iconandusernamecontainer}>
                      <div>
                        <IoMdContact size={80} />
                        <div className={classes.home__questionusername}>
                          <h3>{questions.username}</h3>{" "}
                          {/* Changed from user_name to username */}
                        </div>
                      </div>
                      <div className={classes.home__questiontitle}>
                        <p>{question.title}</p>
                      </div>
                    </div>
                    <div style={{ marginTop: "30px" }}>
                      <Link to={`/home/answers/${question.question_id}`}>
                        <IoIosArrowForward
                          size={30}
                          className={classes.arrow_icon}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No questions found.</p>
            )}
          </div>
        </section>
      )}
    </>
  );
}

export default Home;
