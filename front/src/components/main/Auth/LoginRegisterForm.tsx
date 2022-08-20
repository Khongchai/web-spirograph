import { FormEvent, useState } from "react";
import Button from "../Shared/Button";

export type onFormSubmitType = ({
  email,
  username,
}: {
  email: string;
  username: string;
}) => Promise<void>;

export function LoginRegisterForm({
  onFormSubmit,
  isSubmitting,
}: {
  onFormSubmit: onFormSubmitType;
  isSubmitting: boolean;
}) {
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputUsername, setInputUsername] = useState<string>("");

  const _onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onFormSubmit({
      email: inputEmail!,
      username: inputUsername!,
    });
  };

  return (
    <form className="w-full max-w-sm" onSubmit={_onFormSubmit}>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="inline-full-name"
          >
            Email*
          </label>
        </div>
        <div className="md:w-2/3">
          <input
            required
            className="bg-gray-200 appearance-none border-2 
            text-purple-dark
            border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-full-name"
            type="email"
            placeholder="rick_roll@email.com"
            onChange={(e) => setInputEmail(e.target.value)}
            value={inputEmail}
          />
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="inline-password"
          >
            Username
          </label>
        </div>
        <div className="md:w-2/3">
          <input
            className="bg-gray-200 appearance-none 
            text-purple-dark
            border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-password"
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            placeholder="Rick Astley"
          />
        </div>
      </div>
      <div className="md:flex md:items-center">
        <div className="md:w-1/3" />
        <div className="md:w-2/3">
          <Button
            buttonText={isSubmitting ? "Submitting" : "Save Config"}
            isFormSubmitButton={true}
          />
        </div>
      </div>
    </form>
  );
}
