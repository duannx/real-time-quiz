import "normalize.css";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { FirebaseQuizBackend } from "@/services/quiz-service/firebase";
import quizAppBackend from "@/services/quiz-service";
import NextNProgress from "nextjs-progressbar";
import { useEffect } from "react";

if (typeof window != "undefined") {
  const firebase = new FirebaseQuizBackend();
  quizAppBackend.setBackend(firebase);
}

export default function App({ Component, pageProps }: AppProps) {
  // run bootstrap js on the client side
  useEffect(() => {
    import("bootstrap");
  }, []);
  return (
    <>
      <NextNProgress color="#1a8755"></NextNProgress>
      <div className="app-container">
        <Component {...pageProps} />
      </div>
    </>
  );
}
