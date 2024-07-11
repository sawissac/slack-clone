import React from "react";
import { useState } from "react";
import { supabase } from "@/lib/Store";
import { AUTH_STATUS } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormData,
  FormField,
  UserSignInSchema,
  UserSignUpSchema,
} from "@/components/UserForm";
import { useForm } from "react-hook-form";
import Image from "next/image";

const Home = () => {
  const [signType, setSignType] = useState<string>(AUTH_STATUS.SIGNIN);
  const isSignIn = signType === AUTH_STATUS.SIGNIN;
  const {
    handleSubmit,
    formState: { errors },
    register,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(!isSignIn ? UserSignUpSchema : UserSignInSchema),
  });

  const handleSign = () => {
    setSignType((s) =>
      s === AUTH_STATUS.SIGNIN ? AUTH_STATUS.SIGNUP : AUTH_STATUS.SIGNIN
    );
  };

  const handleLogin = async (data: FormData) => {
    const { email, password } = data;
    try {
      const { error } =
        signType === AUTH_STATUS.SIGNIN
          ? await supabase.auth.signIn({ email, password })
          : await supabase.auth.signUp({ email, password });

      const formError = {
        type: "server",
        message: error?.message,
      };

      const invalidGrand = () => {
        setError("email", formError);
        setError("password", formError);
      };

      const alreadyExits = () => {
        setError("email", formError);
      };

      switch (error?.status) {
        case AUTH_STATUS.INVALID_GRANT:
          invalidGrand();
          break;
        case AUTH_STATUS.USER_ALREADY_EXISTS:
          alreadyExits();
          break;
        default:
          null;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-4 bg-dots">
      <div className="w-full sm:w-1/2 xl:w-1/3">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="border-teal p-8 border-t-12 bg-white mb-6 rounded-lg shadow-lg"
        >
          <div className="flex justify-center py-8">
            <Image
              src={"/slack-clone-logo.png"}
              loading="lazy"
              width={100}
              height={100}
              alt="app_logo"
            />
          </div>
          <div className="mb-4">
            <label className="font-bold text-grey-darker block mb-2">
              Email
            </label>
            <FormField
              type="email"
              placeholder="Email"
              name="email"
              register={register}
              error={errors.email}
            />
          </div>
          <div className="mb-4">
            <label className="font-bold text-grey-darker block mb-2">
              Password
            </label>
            <FormField
              type="password"
              placeholder="Password"
              name="password"
              register={register}
              error={errors.password}
            />
          </div>
          {!isSignIn && (
            <div className="mb-4">
              <label className="font-bold text-grey-darker block mb-2">
                Confirm Password
              </label>
              <FormField
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                register={register}
                error={errors.confirmPassword}
              />
            </div>
          )}
          <div className="flex flex-col gap-5 py-8">
            <button
              type="submit"
              className="bg-primary hover:bg-teal text-white py-2 px-4 rounded text-center transition duration-150 hover:bg-opacity-95 hover:text-white"
            >
              {!isSignIn ? "Sign up" : "Sign in"}
            </button>
            <button
              type="button"
              className="text-gray-600 text-sm"
              onClick={handleSign}
            >
              {!isSignIn ? (
                <>
                  Already have one?{" "}
                  <span className="text-primary font-medium">Sign in</span>.
                </>
              ) : (
                <>
                  New user?{" "}
                  <span className="text-primary font-medium">
                    Create account
                  </span>
                  .
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
