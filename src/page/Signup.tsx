import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  // 버튼을 활성화 시켜주는데 사용
  const [notAllow, setNotAllow] = useState<boolean>(true);

  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");

  // 이메일,패스워드 조건이 충족하는지 확인용
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [pwValid, setPwValid] = useState<boolean>(false);

  const navigate = useNavigate();

  const idCheck = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setId(e.target.value);
      const regex = /@/;
      if (regex.test(e.target.value)) {
        setEmailValid(true);
      } else {
        setEmailValid(false);
      }
    },
    [id]
  );

  // 이메일 조건충족 확인
  const pwCheck = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    setPw(e.target.value);
    const regex = /.{8,}$/;
    if (regex.test(e.target.value)) {
      setPwValid(true);
    } else {
      setPwValid(false);
    }
  }, []);

  // 회원가입
  const createUser = () => {
    fetch("https://www.pre-onboarding-selection-task.shop/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: id,
        password: pw,
      }),
    }).then((response) => {
      if (response.ok) {
        alert("회원가입되었습니다!");
        navigate("/signin");
      } else {
        throw new Error("회원가입 실패");
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
      <h1>회원가입창</h1>
      <label>Id</label>
      <input
        data-testid="email-input"
        type="text"
        value={id}
        onChange={idCheck}
      />
      {id == "" ? null : emailValid == false ? <p>@를 입력해주세요</p> : null}

      <label>Password</label>
      <input
        data-testid="password-input"
        type="text"
        value={pw}
        onChange={pwCheck}
      />
      {pw == "" ? null : pwValid == false ? (
        <p>비밀번호를8자이상 입력해주세요</p>
      ) : null}
      <button
        data-testid="signup-button"
        disabled={notAllow}
        onClick={createUser}
      >
        회원가입
      </button>
    </div>
  );
};

export default Signup;
