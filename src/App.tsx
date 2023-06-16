import React, { useCallback, useEffect } from "react";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Signup from "./page/Signup";
import Signin from "./page/Signin";
import Home from "./page/Home";
import Todo from "./page/Todo";

function App() {
  const navigate = useNavigate();

  const redirectIfLoggedIn = useCallback(() => {
    const token: string | null = localStorage.getItem("token");

    //현재 페이지의 경로를 나타내는 속성
    const path: string = window.location.pathname;

    // 토큰이 있고 페이지가 /signin 이나 /signup 일 경우 /todo로
    // 토큰이 없고 페이지가 /todo면 /signin 으로 이동
    if (token) {
      if (path === "/signin" || path === "/signup" || path === "/") {
        navigate("/todo");
      }
    } else {
      if (path === "/todo") {
        navigate("/signin");
      }
    }
  }, []);

  //페이지 로드시 실행된다.
  useEffect(() => {
    redirectIfLoggedIn();
  });


  return (
    <div className="App">
      <Routes>
        <Route>
          <Route index path="/" element={<Signin />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/todo" element={<Todo />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;