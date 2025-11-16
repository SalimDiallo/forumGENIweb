import BackButton from "@/components/BackButton";
import EditJobForm from "./EditJobForm";
import { prisma } from "@/lib/db";

export default async function EditJobPage(props: {
  params: Promise<{ jobId: string }>;
}) {
  const params = await props.params;
  const jobId = Number(params.jobId);

  let job = null;
  if (jobId) {
    job = await prisma.jobOffer.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return (
        <div className="container py-12 text-center text-red-600">
          Offre d'emploi introuvable.
        </div>
      );
    }
  } else {
    return (
      <div className="container py-12 text-center text-red-600">
        Offre d'emploi introuvable.
      </div>
    );
  }

  return (
    <div>
      <BackButton />
      <div>
        <EditJobForm job={job} />
      </div>
    </div>
  );
}
