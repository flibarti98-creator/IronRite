export function showQuiz(onFinish) {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div>
      <input id="age" placeholder="wiek">
      <button id="btn">Dalej</button>
    </div>
  `;

  document.getElementById("btn").onclick = () => {
    const data = {
      age: document.getElementById("age").value
    };

    onFinish(data);
  };
}