import Head from "next/head";
import styles from "@/styles/Home.module.css";
import JoiningQuiz from "@/components/JoiningQuiz";

export default function Home() {
  return (
    <>
      <Head>
        <title>Vocabulary Quiz App</title>
        <meta name="description" content="Real-time Vocabulary Quiz App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/avatar-icons/avatar-1.png" />
      </Head>
      <main className={styles['home-page']}>
        <div className={`container`}>
          <h1 className="text-center">Vocabulary Quiz</h1>
          <JoiningQuiz></JoiningQuiz>
        </div>
      </main>
    </>
  );
}
