"use client";

import useGoBack from "@/utils/useGoBack";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export default function BackButton() {
    const onback = useGoBack();
    return (
        <Button variant="outline" size="sm" onClick={onback}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
      </Button>
    );
}