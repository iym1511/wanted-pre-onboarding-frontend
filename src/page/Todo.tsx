import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

interface todoType {
  id: number;
  todo: string;
  isCompleted: boolean;
  userId: number;
}

const Todo = () => {
  // 1씩증가하는 id
  let [nextId, setNextId] = useState<number>(0);

  // 수정 input을 띄워주는 boolean값
  const [modifyCheck, setModifyCheck] = useState<boolean>(false);

  // 할일 작성란
  const [text, setText] = useState<string>("");

  // 할일 수정란
  const [modifytext, setModifytext] = useState<string>("");

  // 백엔드에서 받아와서 할일목록 저장하는곳
  const [todoList, setTodoList] = useState<todoType[] | undefined | any>([]);

  // 내가 선택한 할일 id
  const [todoId, setTodoId] = useState<number>();

  const [loading, setLoading] = useState(false);

  const onChangeText = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setText(e.target.value);
    },
    [text]
  );

  // 로그인 할때 전송된 JWT토큰 가져옴
  const access_token: string | null = localStorage.getItem("token");

  const createTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("https://www.pre-onboarding-selection-task.shop/todos", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: nextId,
        todo: text,
        isCompleted: false,
        userId: 1,
      }),
    }).then((response) => {
      if (response.ok) {
        setNextId(nextId + 1);
        setText("");
      } else {
        alert("할일을 작성하여 주십시요.");
      }
      setLoading(false); // 로딩 상태 해제
    });
  };

  const updateTodo = (id: number) => {
    fetch(`https://www.pre-onboarding-selection-task.shop/todos/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo: modifytext,
        isCompleted: true,
      }),
    }).then((response) => {
      if (response.ok) {
        // 댓글이 성공적으로 수정되면 todoList의 상태를 업데이트
        // setTodoList((prevTodoList: todoType[]) => {
        //   const updatedList = prevTodoList.map((todo) => {
        //     if (todo.id === id) {
        //       return { ...todo, todo: modifytext, isCompleted: true };
        //     }
        //     return todo;
        //   });
        //   return updatedList;
        // });
        setModifytext("");
        setModifyCheck(false);
      } else {
        alert("수정할 텍스트를 추가하여 주십시요.");
      }
    });
  };

  const deleteTodo = (id: number) => {
    fetch(`https://www.pre-onboarding-selection-task.shop/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    // .then((response) => {
    //   if (response.ok) {
    //     // 댓글이 성공적으로 수정되면 todoList의 상태를 업데이트
    //     setTodoList((prevTodoList: todoType[]) =>
    //       prevTodoList.filter((todo) => todo.id !== id)
    //     );
    //   }
    // });
  };

  useEffect(() => {
    fetch("https://www.pre-onboarding-selection-task.shop/todos", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Todo retrieval failed.");
        }
      })
      .then((data) => {
        setTodoList(data);
      })
      .catch((error) => {
        console.error(error);
      });
  },[todoList]);

  // input을 같은 id 끼리 띄워주기위한 변수저장
  // input창을 띄워주는 boolean 을 true 지정
  const modifyInputSame = (data: number) => {
    setModifyCheck(true);
    setTodoId(data);
  };

  return (
    <div>
      <h1>Todo</h1>
      <form onSubmit={createTodo}>
        <input
          data-testid="new-todo-input"
          type="text"
          value={text}
          onChange={onChangeText}
        />
        <button data-testid="new-todo-add-button" type="submit">
          추가
        </button>
      </form>

      {todoList.map((data: todoType, index: number) => (
        <li key={index}>
          <label>
            <input type="checkbox" />
            {modifyCheck && data.id == todoId ? (
              <input
                data-testid="modify-input"
                defaultValue={data.todo}
                onChange={(e) => {
                  setModifytext(e.target.value);
                }}
              />
            ) : (
              <span>{data.todo}</span>
            )}
          </label>
          {modifyCheck && data.id === todoId ? (
            <>
              <button
                data-testid="submit-button"
                onClick={() => {
                  updateTodo(data.id);
                }}
              >
                제출
              </button>
              <button
                data-testid="cancel-button"
                onClick={() => {
                  setModifyCheck(false);
                }}
              >
                취소
              </button>
            </>
          ) : (
            <>
              <button
                data-testid="modify-button"
                onClick={() => {
                  modifyInputSame(data.id);
                }}
              >
                수정
              </button>
              <button
                data-testid="delete-button"
                onClick={() => {
                  deleteTodo(data.id);
                }}
              >
                삭제
              </button>
            </>
          )}
        </li>
      ))}
    </div>
  );
};

export default Todo;
