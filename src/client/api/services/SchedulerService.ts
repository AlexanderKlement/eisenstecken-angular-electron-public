/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class SchedulerService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Check Offline Clients
     * @returns any Successful Response
     * @throws ApiError
     */
    public checkOfflineClientsSchedulerCheckNotificationGet(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/scheduler/check_notification',
        });
    }
    /**
     * Export Contacts
     * @returns any Successful Response
     * @throws ApiError
     */
    public exportContactsSchedulerExportContactsGet(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/scheduler/export_contacts',
        });
    }
    /**
     * Get Order Confirmations
     * @returns any Successful Response
     * @throws ApiError
     */
    public getOrderConfirmationsSchedulerGetOrderConfirmationsGet(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/scheduler/get_order_confirmations',
        });
    }
    /**
     * Archive Work Hours
     * @returns any Successful Response
     * @throws ApiError
     */
    public archiveWorkHoursSchedulerArchiveWorkHoursGet(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/scheduler/archive_work_hours',
        });
    }
    /**
     * Create Calendar Entries
     * @returns any Successful Response
     * @throws ApiError
     */
    public createCalendarEntriesSchedulerCreateCalendarEntriesGet(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/scheduler/create_calendar_entries',
        });
    }
}
