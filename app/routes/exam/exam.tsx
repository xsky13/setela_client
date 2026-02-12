import { useContext } from "react";
import ExamOwnerView from "~/Components/Views/Exam/ExamOwnerView";
import { ExamContext } from "~/context/ExamContext";

export default function Exam() {
    const examData = useContext(ExamContext);

    if (!examData) throw new Error("El examen no existe. Por favor intente de nuevo o contactese con el administrador.");

    return (
        <ExamOwnerView exam={examData} />
    );
}