import "normalize.css";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { FirebaseQuizBackend } from "@/services/quiz-service/firebase";
import quizAppBackend from "@/services/quiz-service";

if(typeof window != 'undefined') {
  const firebase = new FirebaseQuizBackend()
  quizAppBackend.setBackend(firebase)
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="app-container">
      <Component {...pageProps} />
    </div>
  );
}
