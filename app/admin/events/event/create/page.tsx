import BackButton from "@/components/BackButton";
import CreateEventForm from "./CreateEventForm";

export default function CreateEventPage(){
    return(
        <div>
            <BackButton />
            <div >
                <CreateEventForm />
            </div>
        </div>
    );
}