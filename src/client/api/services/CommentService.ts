/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Comment } from '../models/Comment';
import type { CommentCreate } from '../models/CommentCreate';
import type { CommentList } from '../models/CommentList';
import type { CommentPatch } from '../models/CommentPatch';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CommentService {
    /**
     * Comment Post
     * @param postId
     * @param requestBody
     * @returns Comment Successful Response
     * @throws ApiError
     */
    public static commentPostCommentPostPostIdPost(
        postId: number,
        requestBody: CommentCreate,
    ): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/comment/post/{post_id}',
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
     * Get Comments From Post
     * @param postId
     * @returns CommentList Successful Response
     * @throws ApiError
     */
    public static getCommentsFromPostCommentPostPostIdGet(
        postId: number,
    ): CancelablePromise<CommentList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/comment/post/{post_id}',
            path: {
                'post_id': postId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Comment Comment
     * @param commentId
     * @param requestBody
     * @returns Comment Successful Response
     * @throws ApiError
     */
    public static commentCommentCommentCommentCommentIdPost(
        commentId: number,
        requestBody: CommentCreate,
    ): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/comment/comment/{comment_id}',
            path: {
                'comment_id': commentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Like Comment
     * @param commentId
     * @returns Comment Successful Response
     * @throws ApiError
     */
    public static likeCommentCommentLikeCommentIdPost(
        commentId: number,
    ): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/comment/like/{comment_id}',
            path: {
                'comment_id': commentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unlike Comment
     * @param commentId
     * @returns Comment Successful Response
     * @throws ApiError
     */
    public static unlikeCommentCommentUnlikeCommentIdPost(
        commentId: number,
    ): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/comment/unlike/{comment_id}',
            path: {
                'comment_id': commentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Comment
     * @param commentId
     * @returns number Successful Response
     * @throws ApiError
     */
    public static deleteCommentCommentCommentIdDelete(
        commentId: number,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/comment/{comment_id}',
            path: {
                'comment_id': commentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch Comment
     * @param commentId
     * @param requestBody
     * @returns Comment Successful Response
     * @throws ApiError
     */
    public static patchCommentCommentCommentIdPatch(
        commentId: number,
        requestBody: CommentPatch,
    ): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/comment/{comment_id}',
            path: {
                'comment_id': commentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
