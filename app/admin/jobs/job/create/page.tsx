import BackButton from "@/components/BackButton";
import CreateJobForm from "./CreateJobForm";

export default function CreateJobPage() {
  return (
    <div>
      <BackButton />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Créer une offre d'emploi</h1>
       <CreateJobForm />
       </div>
    </div>
  );
}
