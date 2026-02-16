import { useEffect, useState } from "react";
import type { Exam, ExamSubmission } from "~/types/exam";
import { formatDate, getMinutesDifference } from "~/utils/date";

export default function ExamStatusBar({ exam, examSubmission }: { exam: Exam, examSubmission?: ExamSubmission | null | undefined }) {
    const duration = getMinutesDifference(exam.startTime, exam.endTime);

    const calculateTimeLeft = () => {
        if (examSubmission) {
            const startTime = new Date(examSubmission.startTime).getTime();
            const durationMs = duration * 60 * 1000;
            const endTime = startTime + durationMs;
            const now = new Date().getTime();

            const difference = endTime - now;

            if (difference <= 0) return { minutes: 0, seconds: 0 };

            return {
                minutes: Math.floor(difference / (1000 * 60)),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return { minutes: duration, seconds: 0 };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        if (!examSubmission) return;
        if (examSubmission?.finished || !examSubmission) return;

        const timer = setInterval(() => {
            const newTime = calculateTimeLeft();
            setTimeLeft(newTime);

            if (newTime.minutes === 0 && newTime.seconds === 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [exam.endTime, examSubmission]);

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    return (
        <div className="d-flex justify-content-between w-100 py-2 px-4 rounded-2 border bg-body-tertiary mb-3">
            <div className="small text-muted d-flex align-items-center">
                <i className="bi bi-clock" />
                <div className="ms-2">
                    <span className="fw-semibold">Duracion: </span>
                    <div>{getMinutesDifference(exam.startTime, exam.endTime)} minutos</div>
                </div>
            </div>
            {
                examSubmission &&
                <div className="small text-muted d-flex align-items-center">
                    <i className="bi bi-hourglass" />
                    <div className="ms-2">
                        <span className="fw-semibold">Tiempo restante: </span>
                        {formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
                    </div>
                </div>
            }
            <div className="small text-muted d-flex align-items-center">
                <i className="bi bi-hourglass-top" />
                <div className="ms-2">
                    <span className="fw-semibold">Hora de comienzo: </span>
                    <div>{formatDate(exam.startTime)}</div>
                </div>
            </div>
            <div className="small text-muted d-flex align-items-center">
                <i className="bi bi-hourglass-bottom" />
                <div className="ms-2">
                    <span className="fw-semibold">Hora de finalizacion: </span>
                    <div>{formatDate(exam.endTime)}</div>
                </div>
            </div>
        </div>
    );
}