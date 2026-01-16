import '../styles/courseStyles.css';
import { useContext, useEffect, useState } from "react";
import { NavLink } from 'react-router';
import AssignmentListing from '~/Components/Courses/Course/AssignmentListing';
import ExamListing from '~/Components/Courses/Course/ExamListing';
import ModuleListing from '~/Components/Courses/Course/ModuleListing';
import ResourceListing from '~/Components/Courses/Course/ResourceListing';
import { CourseContext } from "~/context/CourseContext";
import type { IOrderable } from '~/interfaces/IOrderable';

type CourseItem = IOrderable & {
    type: 'topicSeparator' | 'module' | 'exam' | 'assignment' | 'resource';
    id: number;
    title?: string;

    dueDate?: string;

    startTime?: string;
    endTime?: string;

    url?: string;
    linkText?: string;
    resourceType?: number;
};

export default function Course() {
    const course = useContext(CourseContext);
    const [courseData, setCourseData] = useState<CourseItem[]>([]);

    useEffect(() => {
        if (!course) return;

        const allItems: CourseItem[] = [
            ...(course.topicSeparators?.map(ts => ({ ...ts, type: 'topicSeparator' as const })) || []),
            ...(course.modules?.map(m => ({ ...m, type: 'module' as const })) || []),
            ...(course.resources?.map(r => ({ ...r, type: 'resource' as const })) || []),
            ...(course.exams?.map(e => ({ ...e, type: 'exam' as const })) || []),
            ...(course.assignments?.map(a => ({ ...a, type: 'assignment' as const })) || [])
        ];

        const sortedItems = allItems.sort((a, b) => a.displayOrder - b.displayOrder);
        setCourseData(sortedItems);

        console.log(course);

    }, [course])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) return "Fecha no disponible";
        return date.toLocaleString('es-AR', {
            timeZone: 'UTC',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    };

    const getMinutesDifference = (date1: string, date2: string): number => {
        const start = new Date(date1).getTime();
        const end = new Date(date2).getTime();

        const diffInMs = end - start;
        return Math.floor(diffInMs / (1000 * 60));
    };

    return (
        <div>
            <div className="d-flex justify-content-between">
                <div>
                    <h1>{course?.title}</h1>
                    <p>{course?.description}</p>
                </div>
                {
                    course?.currentUserIsOwner &&
                    <div className="dropdown">
                        <button
                            className="btn btn-primary dropdown-toggle d-flex align-items-center"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span className="me-2">Crear</span>
                        </button>
                        <ul className="dropdown-menu">
                            <li><NavLink className="dropdown-item" to="./m/crear">Modulo</NavLink></li>
                            <li><NavLink className="dropdown-item" to="./r/crear">Recurso</NavLink></li>
                            <li><NavLink className="dropdown-item" to="./tp/crear">Trabajo practico</NavLink></li>
                            <li><NavLink className="dropdown-item" to="./e/crear">Examen</NavLink></li>
                        </ul>
                    </div>
                }
            </div>
            <div className="mt-4">
                {
                    courseData.map((item, i) => {
                        switch (item.type) {
                            case 'topicSeparator':
                                return (
                                    <div key={i} className='my-3'>
                                        <h3>{item.title}</h3>
                                    </div>
                                )
                            case 'module':
                                return <ModuleListing
                                    key={i}
                                    id={item.id}
                                    title={item.title!}
                                />
                            case 'resource':
                                return <ResourceListing
                                    key={i}
                                    id={item.id}
                                    url={item.url!}
                                    linkText={item.linkText!}
                                    resourceType={item.resourceType!}
                                />
                            case 'assignment':
                                return <AssignmentListing
                                    key={i}
                                    id={item.id}
                                    title={item.title!}
                                    dueDate={item.dueDate!}
                                    formatDate={formatDate}
                                />
                            case 'exam':
                                return <ExamListing
                                    key={i}
                                    id={item.id}
                                    title={item.title!}
                                    startTime={item.startTime!}
                                    endTime={item.endTime!}
                                    getMinutesDifference={getMinutesDifference}
                                    formatDate={formatDate}
                                />
                            default: ''
                        }
                    })
                }
            </div>
        </div>
    );
}