import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <p>홈화면</p>
      <button onClick={() => navigate("/signup")}>회원가입페이지</button>
      <button onClick={() => navigate("/signin")}>로그인페이지</button>
    </div>
  );
};

export default Home;
