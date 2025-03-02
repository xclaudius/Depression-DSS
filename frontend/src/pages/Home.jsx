import SymptomAssessment from "../components/SymptomAssessment";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Depression DSS</h1>
      <SymptomAssessment />
    </div>
  );
}