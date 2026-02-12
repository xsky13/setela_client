import { useContext } from "react";
import OwnerView from "~/Components/Views/Exam/OwnerView";
import { ExamContext } from "~/context/ExamContext";

export default function Exam() {
    const examData = useContext(ExamContext);

    if (!examData) throw new Error("El examen no existe. Por favor intente de nuevo o contactese con el administrador.");

    return (
        <OwnerView exam={examData} />
    );
}