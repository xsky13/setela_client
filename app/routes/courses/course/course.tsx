import '../styles/courseStyles.css';
import { useContext, useEffect, useState } from "react";
import { NavLink } from 'react-router';
import AssignmentListing from '~/Components/Courses/Course/AssignmentListing';
import ExamListing from '~/Components/Courses/Course/ExamListing';
import ModuleListing from '~/Components/Courses/Course/ModuleListing';
import ResourceListing from '~/Components/Courses/Course/ResourceListing';
import AddResourcesModal from '~/Components/Resource/AddResourcesModal';
import CreateTopicSeparatorModal from '~/Components/TopicSeparator/CreateTopicSeparatorModal';
import TopicSeparatorListing from '~/Components/TopicSeparator/TopicSeparatorListing';
import { CourseContext } from "~/context/CourseContext";
import type { IOrderable } from '~/interfaces/IOrderable';
import type { Assignment } from '~/types/assignment';
import type { Module, ResourceListing as ResourceListingType, TopicSeparator } from '~/types/course';
import type { Exam, ExamSimple } from '~/types/exam';

type CourseItem = IOrderable & {
    type: 'topicSeparator' | 'module' | 'exam' | 'assignment' | 'resource';
    id: number;

    key: string;

    title?: string;

    visible?: boolean;

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
            ...(course.topicSeparators?.map(ts => ({ ...ts, key: `ts-${ts.id}`, type: 'topicSeparator' as const })) || []),
            ...(course.modules?.map(m => ({ ...m, key: `m-${m.id}`, type: 'module' as const })) || []),
            ...(course.resources?.map(r => ({ ...r, key: `r-${r.id}`, type: 'resource' as const })) || []),
            ...(course.exams?.map(e => ({ ...e, key: `e-${e.id}`, type: 'exam' as const })) || []),
            ...(course.assignments?.map(a => ({ ...a, key: `a-${a.id}`, type: 'assignment' as const })) || [])
        ];

        const sortedItems = allItems.sort((a, b) => a.displayOrder - b.displayOrder);
        setCourseData(sortedItems);

        // remove all none visible items
        if (!course.currentUserIsOwner) {
            setCourseData(prevData => prevData.filter(item => item.visible));
        }

    }, [course]);

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
                            <li>
                                <AddResourcesModal parentId={course.id} type="course" courseId={course.id} />
                            </li>
                            <li><NavLink className="dropdown-item" to="./a/crear">Trabajo practico</NavLink></li>
                            <li><NavLink className="dropdown-item" to="./e/crear">Examen</NavLink></li>
                            <li>
                                <CreateTopicSeparatorModal courseId={course.id} />
                            </li>
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
                                    <TopicSeparatorListing
                                        key={i}
                                        topicSeparator={item as unknown as TopicSeparator}
                                        currentUserIsOwner={course!.currentUserIsOwner}
                                    />
                                )
                            case 'module':
                                return <ModuleListing
                                    key={i}
                                    module={item as unknown as Module}
                                    currentUserIsOwner={course!.currentUserIsOwner}
                                />
                            case 'resource':
                                return <ResourceListing
                                    key={i}
                                    resource={item as unknown as ResourceListingType}
                                    currentUserIsOwner={course!.currentUserIsOwner}
                                />
                            case 'assignment':
                                return <AssignmentListing
                                    key={i}
                                    assignment={item as unknown as Assignment}
                                    currentUserIsOwner={course!.currentUserIsOwner}
                                />
                            case 'exam':
                                return <ExamListing
                                    key={i}
                                    exam={item as unknown as ExamSimple}
                                    currentUserIsOwner={course!.currentUserIsOwner}
                                />
                            default: ''
                        }
                    })
                }
            </div>
        </div>
    );
}