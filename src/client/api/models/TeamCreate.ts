/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonCreate } from './PersonCreate';
import type { TranslationCreate } from './TranslationCreate';
export type TeamCreate = {
    name: TranslationCreate;
    thumbId?: (number | null);
    photoId?: (number | null);
    leader: PersonCreate;
    officialName?: (string | null);
};

