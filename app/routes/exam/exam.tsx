import { useContext } from "react";
import { ExamContext } from "~/context/ExamContext";

export default function Exam() {
    const exam = useContext(ExamContext);

    if (!exam) throw new Error("El examen no existe. Por favor intente de nuevo o contactese con el administrador.");

    return (
        <div>
            <h1>{exam.title}</h1>
        </div>
    );
}