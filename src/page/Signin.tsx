import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Signin = () => {
  // 버튼을 활성화 시켜주는데 사용
  const [notAllow, setNotAllow] = useState<boolean>(true);

  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");

  // 이메일,패스워드 조건이 충족하는지 확인용
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [pwValid, setPwValid] = useState<boolean>(false);

  const [userInputs, setUserInputs] = useState({
    email: "",
    password: "",
  });


  const navigate = useNavigate();

  // 아이디 확인 (@가 있는지 확인)
  const idCheck = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    setId(e.target.value);
    const regex = /@/;
    if (regex.test(e.target.value)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  }, []);

  // 패스워드 확인 (8글자 이하일때)
  const pwCheck = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setPw(e.target.value);
      const regex = /.{8,}$/;
      if (regex.test(e.target.value)) {
        setPwValid(true);
      } else {
        setPwValid(false);
      }
    },
    [pw]
  );

  // 로그인
  const login = () => {
    fetch("https://www.pre-onboarding-selection-task.shop/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: id,
        password: pw,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.access_token) {
          alert("로그인되었습니다!");
          navigate("/todo");
          localStorage.setItem("token", data.access_token);
        } else {
          alert("로그인 실패");
          // throw new Error('로그인 실패');
        }
      });
  };

  useEffect(() => {
    if (emailValid && pwValid) {
      setNotAllow(false);
    } else {
      setNotAllow(true);
    }
  }, [emailValid, pwValid]);

  return (
    <div>
      <p>로그인창</p>
      <label>Id</label>
      <input
        data-testid="email-input"
        type="text"
        value={id}
        name="Id"
        onChange={idCheck}
      />
      {id == "" ? null : emailValid == false ? (
        <p>@를 입력해주세요</p>
      ) : (
        <p></p>
      )}

      <label>Password</label>
      <input
        data-testid="password-input"
        type="text"
        value={pw}
        name="password"
        onChange={pwCheck}
      />
      {pw == "" ? null : pwValid == false ? (
        <p>비밀번호를8자이상 입력해주세요</p>
      ) : (
        <p></p>
      )}
      <button data-testid="signin-button" disabled={notAllow} onClick={login}>
        로그인
      </button>
      <button onClick={() => navigate("/signup")}>회원가입하러가기</button>
    </div>
  );
};

export default Signin;
