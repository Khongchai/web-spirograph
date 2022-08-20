import { FormEvent, useState } from "react";
import Button from "../Shared/Button";

export function OtpVerificationForm({
  onFormSubmit,
  isSubmitting,
}: {
  onFormSubmit: ({ otp }: { otp: string }) => Promise<void>;
  isSubmitting: boolean;
}) {
  const [otp, setOtp] = useState<string>("");

  const _onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onFormSubmit({
      otp,
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
            Otp
          </label>
        </div>
        <div className="md:w-2/3">
          <input
            required
            className="bg-gray-200 appearance-none border-2 
            text-purple-dark
            border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-full-name"
            type="text"
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
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
