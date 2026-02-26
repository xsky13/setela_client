import { useMutation, useQuery } from '@tanstack/react-query';
import '../styles/courseStyles.css';
import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from 'react-router';
import AssignmentListing from '~/Components/Courses/Course/AssignmentListing';
import ExamListing from '~/Components/Courses/Course/ExamListing';
import ModuleListing from '~/Components/Courses/Course/ModuleListing';
import ResourceListing from '~/Components/Courses/Course/ResourceListing';
import LoadingButton from '~/Components/LoadingButton';
import AddResourcesModal from '~/Components/Resource/AddResourcesModal';
import CreateTopicSeparatorModal from '~/Components/TopicSeparator/CreateTopicSeparatorModal';
import TopicSeparatorListing from '~/Components/TopicSeparator/TopicSeparatorListing';
import { CourseContext } from "~/context/CourseContext";
import type { IOrderable } from '~/interfaces/IOrderable';
import type { Assignment } from '~/types/assignment';
import type { Module, ResourceListing as ResourceListingType, TopicSeparator } from '~/types/course';
import type { Exam, ExamSimple } from '~/types/exam';
import api from '~/api';
import { toast } from 'sonner';
import { AuthContext } from '~/context/AuthContext';
import { UserRole } from '~/types/roles';
import type { UserProgress } from '~/types/userProgress';
import { CourseItemType } from '~/types/CourseItemType';
import { OrderingContext } from '~/context/OrderingContext';
import { getErrors } from '~/utils/error';

type SentObject = {
    id: number,
    newOrder: number
}

type DataObject = {
    courseId: number,
    topicSeparators: SentObject[],
    modules: SentObject[],
    assignments: SentObject[],
    exams: SentObject[],
    resources: SentObject[],
}

type CourseItem = IOrderable & {
    type: CourseItemType;
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
    const user = useContext(AuthContext);
    const [courseData, setCourseData] = useState<CourseItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!course) return;

        const allItems: CourseItem[] = [
            ...(course.topicSeparators?.map(ts => ({ ...ts, key: `ts-${ts.id}`, type: CourseItemType.TopicSeparator as const })) || []),
            ...(course.modules?.map(m => ({ ...m, key: `m-${m.id}`, type: CourseItemType.Module as const })) || []),
            ...(course.resources?.map(r => ({ ...r, visible: true, key: `r-${r.id}`, type: CourseItemType.Resource as const })) || []),
            ...(course.exams?.map(e => ({ ...e, key: `e-${e.id}`, type: CourseItemType.Exam as const })) || []),
            ...(course.assignments?.map(a => ({ ...a, key: `a-${a.id}`, type: CourseItemType.Assignment as const })) || [])
        ];

        const sortedItems = allItems.sort((a, b) => a.displayOrder - b.displayOrder);
        setCourseData(sortedItems);

        // remove all none visible items
        if (!course.currentUserIsOwner) {
            setCourseData(prevData => prevData.filter(item => item.visible));
        }

    }, [course]);

    const deleteCourseMutation = useMutation({
        mutationFn: async () => {
            let path = user?.roles.includes(UserRole.admin) ? `/course/${course?.id}/hardDelete` : `/course/${course?.id}`;
            const response = await api.delete(path)
            return response.data;
        },
        onError: error => toast(error.message),
        onSuccess: () => {
            navigate("/");
        }
    });

    const deleteCourse = () => {
        let message = "Esta seguro que quiere eliminar este curso?";
        if (user?.roles.includes(UserRole.admin)) message = "Esta seguro que quiere eliminar este curso? Todos los examenes, recursos, modulos, etc. van a ser eliminados"

        if (confirm(message)) {
            deleteCourseMutation.mutate();
        }
    }

    const getProgressItemsQuery = useQuery<UserProgress[]>({
        queryKey: ['get_progress_items', { courseId: course?.id }],
        queryFn: async () => (await api.get(`/userProgress/${course?.id}/get_items`)).data,
        retry: 2
    });
    const [mode, setMode] = useState<'course' | 'editing'>('course');

    const moveUpwards = (itemType: CourseItemType, itemId: number) => {
        setCourseData(prevData => {
            const currentIndex = prevData.findIndex(item => item.type === itemType && item.id === itemId);
            if (currentIndex <= 0) return prevData;

            const newData = [...prevData];

            const itemGoinUp = { ...newData[currentIndex] };
            const itemToReplace = { ...newData[currentIndex - 1] };

            const savedOrder = itemGoinUp.displayOrder;
            itemGoinUp.displayOrder = itemToReplace.displayOrder;
            itemToReplace.displayOrder = savedOrder;

            newData[currentIndex - 1] = itemGoinUp;
            newData[currentIndex] = itemToReplace;

            return newData;
        });
    };

    const moveDownwards = (itemType: CourseItemType, itemId: number) => {
        setCourseData(prevData => {
            const currentIndex = prevData.findIndex(item => item.type === itemType && item.id === itemId);
            if (currentIndex >= prevData.length - 1) return prevData;

            const newData = [...prevData];

            const itemGoingDown = { ...newData[currentIndex] };
            const itemToReplace = { ...newData[currentIndex + 1] };

            const savedOrder = itemGoingDown.displayOrder;
            itemGoingDown.displayOrder = itemToReplace.displayOrder;
            itemToReplace.displayOrder = savedOrder;

            newData[currentIndex + 1] = itemGoingDown;
            newData[currentIndex] = itemToReplace;

            return newData;
        });
    }

    const changeOrderMutation = useMutation<{ success: boolean }, Error, DataObject>({
        mutationFn: async data => (await api.post("/ordering", data)).data,
        onError: error => {
            const errors = getErrors(error);
            toast.error(<div>
                <span className="fw-semibold">Hubo un error:</span>
                {
                    errors.map(e => <p>{e}</p>)
                }
            </div>)
        },
        onSuccess: data => {

        }
    });

    const handleOrderChange = () => {
        const dataObject: DataObject = {
            courseId: course!.id,
            topicSeparators: [],
            modules: [],
            assignments: [],
            exams: [],
            resources: [],
        }
        for (const item of courseData) {
            switch (item.type) {
                case CourseItemType.TopicSeparator:
                    dataObject.topicSeparators.push({ id: item.id, newOrder: item.displayOrder });
                    break;
                case CourseItemType.Module:
                    dataObject.modules.push({ id: item.id, newOrder: item.displayOrder });
                    break;
                case CourseItemType.Assignment:
                    dataObject.assignments.push({ id: item.id, newOrder: item.displayOrder });
                    break;
                case CourseItemType.Exam:
                    dataObject.exams.push({ id: item.id, newOrder: item.displayOrder });
                    break;
                case CourseItemType.Resource:
                    dataObject.resources.push({ id: item.id, newOrder: item.displayOrder });
                    break;
            }
        }

        changeOrderMutation.mutate(dataObject);
    }

    return (
        <OrderingContext value={{ mode, moveUpwards, moveDownwards }}>
            <div className="d-flex justify-content-between">
                <div>
                    <h1>{course?.title}</h1>
                    <p>{course?.description}</p>
                </div>
                {
                    course?.currentUserIsOwner &&
                    <div className="hstack gap-2">
                        {
                            mode != 'editing' &&
                            <>
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
                                <NavLink to="editar" className="btn btn-light mx-2"><i className="bi bi-pencil me-1" /> Editar</NavLink>

                                <LoadingButton
                                    loading={deleteCourseMutation.isPending}
                                    onClick={deleteCourse}
                                    className="btn btn-danger"
                                >
                                    <i className="bi bi-trash me-1" />
                                    Eliminar
                                </LoadingButton>
                            </>
                        }
                        {
                            mode == 'editing' &&
                            <LoadingButton
                                className='btn btn-primary'
                                loading={changeOrderMutation.isPending}
                                onClick={handleOrderChange}
                            >
                                Guardar cambios
                            </LoadingButton>
                        }
                        <button
                            className={`btn btn-${mode == 'course' ? 'light' : 'dark'} mx-2`}
                            onClick={() => setMode(prevMode => prevMode == 'course' ? 'editing' : 'course')}
                        >
                            <i className="bi bi-grid-fill me-1"></i>    Modo edicion
                        </button>
                    </div>
                }
            </div>
            <div className="mt-4">
                {
                    courseData.map((item, i) => {
                        switch (item.type) {
                            case CourseItemType.TopicSeparator:
                                return <TopicSeparatorListing
                                    key={i}
                                    topicSeparator={item as unknown as TopicSeparator}
                                    currentUserIsOwner={course!.currentUserIsOwner}
                                />
                            case CourseItemType.Module:
                                return <ModuleListing
                                    key={i}
                                    module={item as unknown as Module}
                                    currentUserIsOwner={course!.currentUserIsOwner}
                                    progressItems={{
                                        data: getProgressItemsQuery.data,
                                        isLoading: getProgressItemsQuery.isLoading,
                                        isError: getProgressItemsQuery.isError
                                    }}
                                />
                            case CourseItemType.Resource:
                                return <ResourceListing
                                    key={i}
                                    resource={item as unknown as ResourceListingType}
                                    currentUserIsOwner={course!.currentUserIsOwner}
                                    progressItems={{
                                        data: getProgressItemsQuery.data,
                                        isLoading: getProgressItemsQuery.isLoading,
                                        isError: getProgressItemsQuery.isError
                                    }}
                                />
                            case CourseItemType.Assignment:
                                return <AssignmentListing
                                    key={i}
                                    assignment={item as unknown as Assignment}
                                    currentUserIsOwner={course!.currentUserIsOwner}
                                    progressItems={{
                                        data: getProgressItemsQuery.data,
                                        isLoading: getProgressItemsQuery.isLoading,
                                        isError: getProgressItemsQuery.isError
                                    }}
                                />
                            case CourseItemType.Exam:
                                return <ExamListing
                                    key={i}
                                    exam={item as unknown as ExamSimple}
                                    currentUserIsOwner={course!.currentUserIsOwner}
                                    progressItems={{
                                        data: getProgressItemsQuery.data,
                                        isLoading: getProgressItemsQuery.isLoading,
                                        isError: getProgressItemsQuery.isError
                                    }}
                                />
                            default: ''
                        }
                    })
                }
            </div>
        </OrderingContext>
    );
}