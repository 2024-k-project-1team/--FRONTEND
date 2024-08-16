import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import Spinner from "../components/spinner/Spinner";

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
  const [loading, setLoading] = useState(true);
  const code = new URL(window.location.href).searchParams.get("code");
  const state = new URL(window.location.href).searchParams.get("state");
  const navigate = useNavigate();

  useEffect(() => {
    if (code && state === "google") {
      const url = `https://knbot.xyz/api/v1/auth/google/callback?code=${code}`;

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
          else {
            setLoading(false); // 로딩 상태를 false로 
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
          setLoading(false); // 로딩 상태를 false로 
        });
    } else {
      setLoading(false); 
    }
  }, [code, state, navigate, onLogin]);

  return (
    <div>
      {loading ? (
        <Spinner /> // 로딩 상태일 때 Spinner 
      ) : (
        <div>로그인 중입니다. 잠시 기다려 주세요.</div>
      )}
    </div>
  );
};
export default OAuthCallback;
