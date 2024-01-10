/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_image_new_upload_image_new_post } from '../models/Body_upload_image_new_upload_image_new_post';
import type { Body_upload_image_upload_image_post } from '../models/Body_upload_image_upload_image_post';
import type { File } from '../models/File';
import type { FormatTypeEnum } from '../models/FormatTypeEnum';
import type { ImageTypeEnum } from '../models/ImageTypeEnum';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FileService {
    /**
     * Upload Image
     * @param caption
     * @param filename
     * @param imageTypeEnum
     * @param formData
     * @returns File Successful Response
     * @throws ApiError
     */
    public static uploadImageUploadImagePost(
        caption: string,
        filename: string,
        imageTypeEnum: ImageTypeEnum,
        formData: Body_upload_image_upload_image_post,
    ): CancelablePromise<File> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload/image',
            query: {
                'caption': caption,
                'filename': filename,
                'image_type_enum': imageTypeEnum,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Image New
     * @param imageTypeEnum
     * @param formData
     * @param removeBackgroundAndCrop
     * @returns File Successful Response
     * @throws ApiError
     */
    public static uploadImageNewUploadImageNewPost(
        imageTypeEnum: ImageTypeEnum,
        formData: Body_upload_image_new_upload_image_new_post,
        removeBackgroundAndCrop: boolean = false,
    ): CancelablePromise<File> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload/image_new',
            query: {
                'image_type_enum': imageTypeEnum,
                'remove_background_and_crop': removeBackgroundAndCrop,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get File
     * @param fileId
     * @returns File Successful Response
     * @throws ApiError
     */
    public static getFileUploadFileIdGet(
        fileId: number,
    ): CancelablePromise<File> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/upload/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Stream File
     * @param fileId
     * @param formatType
     * @returns any Successful Response
     * @throws ApiError
     */
    public static streamFileUploadStreamFileIdGet(
        fileId: number,
        formatType?: FormatTypeEnum,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/upload/stream/{file_id}',
            path: {
                'file_id': fileId,
            },
            query: {
                'format_type': formatType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Download File
     * @param fileId
     * @param formatType
     * @returns any Successful Response
     * @throws ApiError
     */
    public static downloadFileUploadDownloadFileIdGet(
        fileId: number,
        formatType?: FormatTypeEnum,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/upload/download/{file_id}',
            path: {
                'file_id': fileId,
            },
            query: {
                'format_type': formatType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Aspect Ration
     * @param imageType
     * @returns number Successful Response
     * @throws ApiError
     */
    public static getAspectRationUploadRatioImageTypeGet(
        imageType: ImageTypeEnum,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/upload/ratio/{image_type}',
            path: {
                'image_type': imageType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
