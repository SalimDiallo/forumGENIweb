import BackButton from "@/components/BackButton";
import EditEventForm from "./EditEventForm";
import { prisma } from "@/lib/db";

export default async function EditEventPage(props:{
  params: Promise<{ eventId: string }>;
}){
  const params = await props.params;
    const eventId = Number(params.eventId)


    let event = null;
    if (eventId) {
        event = await prisma.event.findUnique({
            where: { id: eventId }
        });
        console.log(event);
        
        if (!event) {
            return (
                <div className="container py-12 text-center text-red-600">
                    Événement introuvable.
                </div>
            );
        }
    } else {
        return (
            <div className="container py-12 text-center text-red-600">
                  Événement introuvable.
            </div>
        );
    }
    return(
        <div>
            <BackButton />
            <div >
                <EditEventForm event={event} />
            </div>
        </div>
    );
}