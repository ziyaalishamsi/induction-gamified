import MissionCards from "@/components/MissionCards";
import QuizModule from "@/components/QuizModule";
import { useGameState } from "@/contexts/GameStateContext";
import { Helmet } from "react-helmet";

export default function Missions() {
  const { quizzes } = useGameState();
  
  return (
    <>
      <Helmet>
        <title>Missions & Quizzes - Citi Quest Onboarding</title>
        <meta name="description" content="Complete department missions and knowledge quizzes to earn XP and advance in your Citi onboarding journey." />
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[hsl(213,56%,24%)] mb-2">
          Missions & Quizzes
        </h1>
        <p className="text-gray-600">
          Complete missions to learn about different departments and take quizzes to earn XP.
        </p>
      </div>
      
      <MissionCards />
      
      {quizzes.length > 0 && <QuizModule quizId={quizzes[0].id} />}
    </>
  );
}
