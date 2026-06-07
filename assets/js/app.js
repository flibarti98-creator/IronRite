import { showLoading } from "./layout/loading.js";
import { showQuiz } from "./screens/quiz.js";
import { showHome } from "./screens/home.js";

function startApp() {
  const userData = localStorage.getItem("userData");

  if (!userData) {
    showLoading(() => {
      showQuiz(onQuizFinish);
    });
  } else {
    showLoading(() => {
      showHome();
    });
  }
}

function onQuizFinish(data) {
  localStorage.setItem("userData", JSON.stringify(data));

  showLoading(() => {
    showHome();
  });
}

startApp();