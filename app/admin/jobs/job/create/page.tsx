import BackButton from "@/components/BackButton";

export default function CreateJobPage() {
  return (
    <div>
      <BackButton />
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-6">Créer une offre d'emploi</h1>
        <p className="text-gray-600">Utilisez le bouton "Créer un job" depuis la liste des jobs pour ouvrir le formulaire modal.</p>
      </div>
    </div>
  );
}
