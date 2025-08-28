export interface Project {
    id: string,
    name: string,
    type: string
}

export type ProjectType = 'table' | 'document' | 'tasks';

