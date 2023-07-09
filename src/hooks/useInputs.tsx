import { ChangeEvent, ChangeEventHandler, useState } from "react";

export type Inputhandle = [ChangeEventHandler<HTMLInputElement> | undefined, string, string];

const useInput = (): Inputhandle => {
  const [userInputs, setUserInputs] = useState({
    email: "",
    password: "",
  });

  const { email, password } = userInputs;

  const saveUserInputs = (e: ChangeEvent<HTMLInputElement>): void => {
    const {value, name} = e.target;
    setUserInputs((prev) => ({...prev, [name]: value}))
  }
  return [saveUserInputs, email, password]
}

export default useInput;