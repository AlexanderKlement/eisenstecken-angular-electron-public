/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_media_post_upload_post } from '../models/Body_upload_media_post_upload_post';
import type { File } from '../models/File';
import type { Post } from '../models/Post';
import type { PostCreate } from '../models/PostCreate';
import type { PostPatch } from '../models/PostPatch';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PostService {
    /**
     * Create Post
     * @param requestBody
     * @returns Post Successful Response
     * @throws ApiError
     */
    public static createPostPostPost(
        requestBody: PostCreate,
    ): CancelablePromise<Post> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/post/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Post
     * @param postId
     * @returns Post Successful Response
     * @throws ApiError
     */
    public static getPostPostPostIdGet(
        postId: number,
    ): CancelablePromise<Post> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/post/{post_id}',
            path: {
                'post_id': postId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch Post
     * @param postId
     * @param requestBody
     * @returns Post Successful Response
     * @throws ApiError
     */
    public static patchPostPostPostIdPatch(
        postId: number,
        requestBody: PostPatch,
    ): CancelablePromise<Post> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/post/{post_id}',
            path: {
                'post_id': postId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Post
     * @param postId
     * @returns Post Successful Response
     * @throws ApiError
     */
    public static deletePostPostPostIdDelete(
        postId: number,
    ): CancelablePromise<Post> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/post/{post_id}',
            path: {
                'post_id': postId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Like Post
     * @param postId
     * @returns Post Successful Response
     * @throws ApiError
     */
    public static likePostPostLikePostIdPost(
        postId: number,
    ): CancelablePromise<Post> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/post/like/{post_id}',
            path: {
                'post_id': postId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unlike Post
     * @param postId
     * @returns Post Successful Response
     * @throws ApiError
     */
    public static unlikePostPostUnlikePostIdPost(
        postId: number,
    ): CancelablePromise<Post> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/post/unlike/{post_id}',
            path: {
                'post_id': postId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Media
     * @param caption
     * @param filename
     * @param formData
     * @returns File Successful Response
     * @throws ApiError
     */
    public static uploadMediaPostUploadPost(
        caption: string,
        filename: string,
        formData: Body_upload_media_post_upload_post,
    ): CancelablePromise<File> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/post/upload',
            query: {
                'caption': caption,
                'filename': filename,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Test Upload Files
     * @returns File Successful Response
     * @throws ApiError
     */
    public static testUploadFilesPostTestUploadFeldthurnsPost(): CancelablePromise<File> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/post/test_upload_feldthurns',
        });
    }
    /**
     * Test Create Custom Formats
     * @param fileId
     * @returns File Successful Response
     * @throws ApiError
     */
    public static testCreateCustomFormatsPostTestCreateCustomFormatsPost(
        fileId: number,
    ): CancelablePromise<File> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/post/test_create_custom_formats',
            query: {
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
