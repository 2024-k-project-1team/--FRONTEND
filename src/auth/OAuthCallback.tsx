import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";

interface User {
  name: string;
}

interface AuthResponse {
  accessToken?: string;
  access_token?: string;
  name?: string;
  user_name?: string;
}

const OAuthCallback = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const code = new URL(window.location.href).searchParams.get("code");
  const state = new URL(window.location.href).searchParams.get("state");
  const navigate = useNavigate();

  useEffect(() => {
    if (code && state === "google") {
      const url = `https://knbot.newspect.co.kr/api/v1/auth/google/callback?code=${code}`;

      axios
        .get<AuthResponse>(url, {
          headers: {
            Accept: "application/json",
          },
        })
        .then((response: AxiosResponse<AuthResponse>) => {
          const accessToken =
            response.data.accessToken || response.data.access_token;
          const userName = response.data.name || response.data.user_name;

          if (accessToken && userName) {
            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("name", userName);

            onLogin({ name: userName });

            navigate("/chatting");
          }
        })
        .catch((error: unknown) => {
          if (axios.isAxiosError(error)) {
            console.error(
              "Axios error:",
              error.response?.data || error.message
            );
          } else {
            console.error("Unexpected error:", error);
          }
        });
    }
  }, [code, state, navigate, onLogin]);

  return <div>로그인 중입니다. 잠시 기다려 주세요.</div>;
};

export default OAuthCallback;
