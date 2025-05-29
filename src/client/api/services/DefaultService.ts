/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { AdditionalWorkload } from '../models/AdditionalWorkload';
import type { Article } from '../models/Article';
import type { ArticleCreate } from '../models/ArticleCreate';
import type { ArticleUpdate } from '../models/ArticleUpdate';
import type { ArticleUpdateFull } from '../models/ArticleUpdateFull';
import type { Body_login_for_access_token_token_post } from '../models/Body_login_for_access_token_token_post';
import type { Calendar } from '../models/Calendar';
import type { CalendarEntry } from '../models/CalendarEntry';
import type { CalendarEntryCreate } from '../models/CalendarEntryCreate';
import type { Car } from '../models/Car';
import type { Category } from '../models/Category';
import type { CategoryCreate } from '../models/CategoryCreate';
import type { ChatMessage } from '../models/ChatMessage';
import type { ChatMessageCreate } from '../models/ChatMessageCreate';
import type { ChatRecipient } from '../models/ChatRecipient';
import type { Client } from '../models/Client';
import type { ClientCreate } from '../models/ClientCreate';
import type { ClientValidation } from '../models/ClientValidation';
import type { CompanyEvent } from '../models/CompanyEvent';
import type { CompanyEventCreate } from '../models/CompanyEventCreate';
import type { CompanyEventUpdate } from '../models/CompanyEventUpdate';
import type { Contact } from '../models/Contact';
import type { ContactCreate } from '../models/ContactCreate';
import type { ContactTypeEnum } from '../models/ContactTypeEnum';
import type { ContactUpdate } from '../models/ContactUpdate';
import type { Country } from '../models/Country';
import type { Credential } from '../models/Credential';
import type { CredentialCreate } from '../models/CredentialCreate';
import type { CredentialUpdate } from '../models/CredentialUpdate';
import type { DeliveryNote } from '../models/DeliveryNote';
import type { DeliveryNoteCreate } from '../models/DeliveryNoteCreate';
import type { DeliveryNoteReason } from '../models/DeliveryNoteReason';
import type { DeliveryNoteUpdate } from '../models/DeliveryNoteUpdate';
import type { DescriptiveArticle } from '../models/DescriptiveArticle';
import type { EatingPlace } from '../models/EatingPlace';
import type { Expense } from '../models/Expense';
import type { Fee } from '../models/Fee';
import type { Gender } from '../models/Gender';
import type { InfoPage } from '../models/InfoPage';
import type { InfoPageCreate } from '../models/InfoPageCreate';
import type { InfoPageUpdate } from '../models/InfoPageUpdate';
import type { IngoingInvoice } from '../models/IngoingInvoice';
import type { IngoingInvoiceCreate } from '../models/IngoingInvoiceCreate';
import type { Job } from '../models/Job';
import type { JobCreate } from '../models/JobCreate';
import type { JobStatus } from '../models/JobStatus';
import type { JobStatusType } from '../models/JobStatusType';
import type { JobStatusUpdateResponse } from '../models/JobStatusUpdateResponse';
import type { JobUpdate } from '../models/JobUpdate';
import type { Journey } from '../models/Journey';
import type { Language } from '../models/Language';
import type { Lock } from '../models/Lock';
import type { Maintenance } from '../models/Maintenance';
import type { MaintenanceCreate } from '../models/MaintenanceCreate';
import type { MaintenanceUpdate } from '../models/MaintenanceUpdate';
import type { Meal } from '../models/Meal';
import type { MealSum } from '../models/MealSum';
import type { Note } from '../models/Note';
import type { NoteCreate } from '../models/NoteCreate';
import type { NoteUpdate } from '../models/NoteUpdate';
import type { Offer } from '../models/Offer';
import type { OfferCreate } from '../models/OfferCreate';
import type { OfferUpdate } from '../models/OfferUpdate';
import type { Order } from '../models/Order';
import type { OrderBundle } from '../models/OrderBundle';
import type { OrderBundleCreate } from '../models/OrderBundleCreate';
import type { OrderCreate } from '../models/OrderCreate';
import type { OrderedArticle } from '../models/OrderedArticle';
import type { OrderedArticleCreate } from '../models/OrderedArticleCreate';
import type { OrderedArticlePriceUpdate } from '../models/OrderedArticlePriceUpdate';
import type { OrderStatusType } from '../models/OrderStatusType';
import type { OrderUpdate } from '../models/OrderUpdate';
import type { OutgoingInvoice } from '../models/OutgoingInvoice';
import type { OutgoingInvoiceCreate } from '../models/OutgoingInvoiceCreate';
import type { OutgoingInvoiceUpdate } from '../models/OutgoingInvoiceUpdate';
import type { Paint } from '../models/Paint';
import type { Parameter } from '../models/Parameter';
import type { ParameterCreate } from '../models/ParameterCreate';
import type { PaymentCreate } from '../models/PaymentCreate';
import type { Price } from '../models/Price';
import type { PriceCreate } from '../models/PriceCreate';
import type { PriceUpdate } from '../models/PriceUpdate';
import type { Recalculation } from '../models/Recalculation';
import type { RecalculationCreate } from '../models/RecalculationCreate';
import type { RecalculationUpdate } from '../models/RecalculationUpdate';
import type { ReminderCreate } from '../models/ReminderCreate';
import type { Right } from '../models/Right';
import type { Service } from '../models/Service';
import type { ServiceCreate } from '../models/ServiceCreate';
import type { ServiceSum } from '../models/ServiceSum';
import type { ServiceUpdate } from '../models/ServiceUpdate';
import type { Stock } from '../models/Stock';
import type { StockCreate } from '../models/StockCreate';
import type { StockUpdate } from '../models/StockUpdate';
import type { SubJobCreate } from '../models/SubJobCreate';
import type { Supplier } from '../models/Supplier';
import type { SupplierCreate } from '../models/SupplierCreate';
import type { TechnicalData } from '../models/TechnicalData';
import type { TechnicalDataCreate } from '../models/TechnicalDataCreate';
import type { TechnicalDataUpdate } from '../models/TechnicalDataUpdate';
import type { TemplatePaint } from '../models/TemplatePaint';
import type { TemplatePaintCreate } from '../models/TemplatePaintCreate';
import type { TemplatePaintUpdate } from '../models/TemplatePaintUpdate';
import type { Token } from '../models/Token';
import type { Unit } from '../models/Unit';
import type { UnitCreate } from '../models/UnitCreate';
import type { User } from '../models/User';
import type { UserCreate } from '../models/UserCreate';
import type { UserPassword } from '../models/UserPassword';
import type { UserUpdate } from '../models/UserUpdate';
import type { Vat } from '../models/Vat';
import type { VatCreate } from '../models/VatCreate';
import type { WoodList } from '../models/WoodList';
import type { WorkDay } from '../models/WorkDay';
import type { WorkDayCreate } from '../models/WorkDayCreate';
import type { WorkDayUpdate } from '../models/WorkDayUpdate';
import type { Workload } from '../models/Workload';
import type { WorkloadCreate } from '../models/WorkloadCreate';
import type { WorkloadUpdate } from '../models/WorkloadUpdate';
import type { XmlFileBytes } from '../models/XmlFileBytes';
import type { XmlFileStr } from '../models/XmlFileStr';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class DefaultService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Read Users
     * @param skip
     * @param filterString
     * @param limit
     * @param employeesOnly
     * @returns User Successful Response
     * @throws ApiError
     */
    public readUsersUsersGet(
        skip?: number,
        filterString: string = '',
        limit: number = 100,
        employeesOnly: boolean = false,
    ): Observable<Array<User>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/',
            query: {
                'skip': skip,
                'filter_string': filterString,
                'limit': limit,
                'employees_only': employeesOnly,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create User
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public createUserUsersPost(
        requestBody: UserCreate,
    ): Observable<User> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/users/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Users Me
     * @returns User Successful Response
     * @throws ApiError
     */
    public readUsersMeUsersMeGet(): Observable<User> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/me',
        });
    }
    /**
     * Update User Me
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public updateUserMeUsersMePut(
        requestBody: UserUpdate,
    ): Observable<User> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/users/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read User Count
     * @param employeesOnly
     * @returns number Successful Response
     * @throws ApiError
     */
    public readUserCountUsersCountGet(
        employeesOnly: boolean = false,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/count',
            query: {
                'employees_only': employeesOnly,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read User Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public readUserCountUsersEmployeeGet(): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/employee',
        });
    }
    /**
     * Read User Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public readUserCountUsersEmployeeCountGet(): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/employee/count',
        });
    }
    /**
     * Read User
     * @param userId
     * @returns User Successful Response
     * @throws ApiError
     */
    public readUserUsersUserIdGet(
        userId: number,
    ): Observable<User> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update User
     * @param userId
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public updateUserUsersUserIdPut(
        userId: number,
        requestBody: UserUpdate,
    ): Observable<User> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete User
     * @param userId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteUserUsersUserIdDelete(
        userId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock User
     * @param userId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockUserUsersLockUserIdGet(
        userId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/lock/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unlock User
     * @param userId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public unlockUserUsersUnlockUserIdGet(
        userId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/unlock/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Islocked User
     * @param userId
     * @returns Lock Successful Response
     * @throws ApiError
     */
    public islockedUserUsersIslockedUserIdGet(
        userId: number,
    ): Observable<Lock> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/users/islocked/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update User Password
     * @param userId
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public updateUserPasswordUsersPasswordUserIdPut(
        userId: number,
        requestBody: UserPassword,
    ): Observable<User> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/users/password/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Grant Rights To User
     * @param userId
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public grantRightsToUserUsersRightsUserIdPost(
        userId: number,
        requestBody: Array<string>,
    ): Observable<User> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/users/rights/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Login For Access Token
     * @param formData
     * @param allScopes
     * @returns Token Successful Response
     * @throws ApiError
     */
    public loginForAccessTokenTokenPost(
        formData: Body_login_for_access_token_token_post,
        allScopes: boolean = false,
    ): Observable<Token> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/token',
            query: {
                'all_scopes': allScopes,
            },
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Login For Access Token Simple
     * @param username
     * @param password
     * @returns Token Successful Response
     * @throws ApiError
     */
    public loginForAccessTokenSimpleTokenSimplePost(
        username: string,
        password: string,
    ): Observable<Token> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/token_simple',
            query: {
                'username': username,
                'password': password,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Logged In
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public loggedInTokenValidationGet(): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/token_validation',
        });
    }
    /**
     * Get Rights
     * @param skip
     * @param limit
     * @returns Right Successful Response
     * @throws ApiError
     */
    public getRightsRightsGet(
        skip?: number,
        limit: number = 100,
    ): Observable<Array<Right>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/rights/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Chat Recipients
     * @returns ChatRecipient Successful Response
     * @throws ApiError
     */
    public readChatRecipientsChatsRecipientsGet(): Observable<Array<ChatRecipient>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/chats/recipients',
        });
    }
    /**
     * Read Chat Messages Since Id
     * @param lastId
     * @returns ChatMessage Successful Response
     * @throws ApiError
     */
    public readChatMessagesSinceIdChatsLastIdGet(
        lastId: number,
    ): Observable<Array<ChatMessage>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/chats/{last_id}',
            path: {
                'last_id': lastId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Chat Message
     * @param userId
     * @param requestBody
     * @returns ChatMessage Successful Response
     * @throws ApiError
     */
    public createChatMessageChatsUserIdPost(
        userId: number,
        requestBody: ChatMessageCreate,
    ): Observable<ChatMessage> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/chats/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Calendars
     * @returns Calendar Successful Response
     * @throws ApiError
     */
    public readCalendarsCalendarGet(): Observable<Array<Calendar>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/calendar/',
        });
    }
    /**
     * Read Calendar Entries By Day Me
     * @param day
     * @returns CalendarEntry Successful Response
     * @throws ApiError
     */
    public readCalendarEntriesByDayMeCalendarMeGet(
        day: number,
    ): Observable<Array<CalendarEntry>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/calendar/me',
            query: {
                'day': day,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Next Calendar Entries In
     * @param timeMinutes
     * @returns CalendarEntry Successful Response
     * @throws ApiError
     */
    public readNextCalendarEntriesInCalendarNextTimeMinutesGet(
        timeMinutes: number,
    ): Observable<Array<CalendarEntry>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/calendar/next/{time_minutes}',
            path: {
                'time_minutes': timeMinutes,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Calendar Entries By Day
     * @param calendarId
     * @param day
     * @returns CalendarEntry Successful Response
     * @throws ApiError
     */
    public readCalendarEntriesByDayCalendarCalendarsCalendarIdGet(
        calendarId: number,
        day: number,
    ): Observable<Array<CalendarEntry>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/calendar/calendars/{calendar_id}',
            path: {
                'calendar_id': calendarId,
            },
            query: {
                'day': day,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Calendar Entry
     * @param calendarEntryId
     * @returns CalendarEntry Successful Response
     * @throws ApiError
     */
    public readCalendarEntryCalendarCalendarEntryIdGet(
        calendarEntryId: number,
    ): Observable<CalendarEntry> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/calendar/{calendar_entry_id}',
            path: {
                'calendar_entry_id': calendarEntryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Calendar Entry
     * @param calendarEntryId
     * @param requestBody
     * @returns CalendarEntry Successful Response
     * @throws ApiError
     */
    public updateCalendarEntryCalendarCalendarEntryIdPut(
        calendarEntryId: number,
        requestBody: CalendarEntryCreate,
    ): Observable<CalendarEntry> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/calendar/{calendar_entry_id}',
            path: {
                'calendar_entry_id': calendarEntryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Calendar Entries By Key
     * @param calendarKey
     * @param fromDate
     * @param toDate
     * @returns CalendarEntry Successful Response
     * @throws ApiError
     */
    public readCalendarEntriesByKeyCalendarKeyCalendarKeyGet(
        calendarKey: string,
        fromDate: string,
        toDate: string,
    ): Observable<Array<CalendarEntry>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/calendar/key/{calendar_key}',
            path: {
                'calendar_key': calendarKey,
            },
            query: {
                'from_date': fromDate,
                'to_date': toDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Calendar Entry
     * @param calendarId
     * @param requestBody
     * @returns CalendarEntry Successful Response
     * @throws ApiError
     */
    public createCalendarEntryCalendarCalendarIdPost(
        calendarId: number,
        requestBody: CalendarEntryCreate,
    ): Observable<CalendarEntry> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/calendar/{calendar_id}',
            path: {
                'calendar_id': calendarId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Calendar Entry
     * @param calendarId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteCalendarEntryCalendarCalendarIdDelete(
        calendarId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/calendar/{calendar_id}',
            path: {
                'calendar_id': calendarId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Units
     * @param skip
     * @param limit
     * @returns Unit Successful Response
     * @throws ApiError
     */
    public readUnitsUnitGet(
        skip?: number,
        limit: number = 100,
    ): Observable<Array<Unit>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/unit/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Unit
     * @param requestBody
     * @returns Unit Successful Response
     * @throws ApiError
     */
    public createUnitUnitPost(
        requestBody: UnitCreate,
    ): Observable<Unit> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/unit/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Unit
     * @param unitId
     * @param requestBody
     * @returns Unit Successful Response
     * @throws ApiError
     */
    public updateUnitUnitUnitIdPut(
        unitId: number,
        requestBody: UnitCreate,
    ): Observable<Unit> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/unit/{unit_id}',
            path: {
                'unit_id': unitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Unit
     * @param unitId
     * @returns Unit Successful Response
     * @throws ApiError
     */
    public deleteUnitUnitUnitIdDelete(
        unitId: number,
    ): Observable<Unit> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/unit/unit_id}',
            query: {
                'unit_id': unitId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Unit
     * @param unitId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockUnitUnitLockUnitIdPost(
        unitId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/unit/lock/{unit_id}',
            path: {
                'unit_id': unitId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Unit
     * @param unitId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockUnitUnitUnlockUnitIdPost(
        unitId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/unit/unlock/{unit_id}',
            path: {
                'unit_id': unitId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Vats
     * @param skip
     * @param limit
     * @returns Vat Successful Response
     * @throws ApiError
     */
    public readVatsVatGet(
        skip?: number,
        limit: number = 100,
    ): Observable<Array<Vat>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/vat/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Vat
     * @param requestBody
     * @returns Vat Successful Response
     * @throws ApiError
     */
    public createVatVatPost(
        requestBody: VatCreate,
    ): Observable<Vat> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/vat/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Vat By Amount
     * @param vatAmount
     * @returns Vat Successful Response
     * @throws ApiError
     */
    public readVatByAmountVatVatAmountGet(
        vatAmount: number,
    ): Observable<Vat> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/vat/{vat_amount}',
            path: {
                'vat_amount': vatAmount,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Vat
     * @param vatId
     * @param requestBody
     * @returns Vat Successful Response
     * @throws ApiError
     */
    public updateVatVatVatIdPut(
        vatId: number,
        requestBody: VatCreate,
    ): Observable<Vat> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/vat/{vat_id}',
            path: {
                'vat_id': vatId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Vat
     * @param vatId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteVatVatVatIdDelete(
        vatId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/vat/{vat_id}',
            path: {
                'vat_id': vatId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Categories
     * @param skip
     * @param limit
     * @returns Category Successful Response
     * @throws ApiError
     */
    public readCategoriesCategoryGet(
        skip?: number,
        limit: number = 100,
    ): Observable<Array<Category>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/category/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Category
     * @param requestBody
     * @returns Category Successful Response
     * @throws ApiError
     */
    public createCategoryCategoryPost(
        requestBody: CategoryCreate,
    ): Observable<Category> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/category/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Category
     * @param categoryId
     * @param requestBody
     * @returns Category Successful Response
     * @throws ApiError
     */
    public updateCategoryCategoryCategoryIdPut(
        categoryId: number,
        requestBody: CategoryCreate,
    ): Observable<Category> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/category/{category_id}',
            path: {
                'category_id': categoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Category
     * @param categoryId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteCategoryCategoryCategoryIdDelete(
        categoryId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/category/{category_id}',
            path: {
                'category_id': categoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Articles
     * @param skip
     * @param limit
     * @returns Article Successful Response
     * @throws ApiError
     */
    public readArticlesArticleGet(
        skip?: number,
        limit: number = 100,
    ): Observable<Array<Article>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/article/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Article
     * @param requestBody
     * @returns Article Successful Response
     * @throws ApiError
     */
    public createArticleArticlePost(
        requestBody: ArticleCreate,
    ): Observable<Article> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/article/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Article Count By Supplier
     * @param supplierId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readArticleCountBySupplierArticleSupplierCountSupplierIdGet(
        supplierId: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/article/supplier/count/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Articles By Supplier
     * @param supplierId
     * @param skip
     * @param limit
     * @param filterString
     * @returns Article Successful Response
     * @throws ApiError
     */
    public readArticlesBySupplierArticleSupplierSupplierIdGet(
        supplierId: number,
        skip?: number,
        limit: number = 100,
        filterString: string = '',
    ): Observable<Array<Article>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/article/supplier/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Article Count By Stock
     * @param stockId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readArticleCountByStockArticleStockCountStockIdGet(
        stockId: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/article/stock/count/{stock_id}',
            path: {
                'stock_id': stockId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Articles By Stock
     * @param stockId
     * @param skip
     * @param limit
     * @param filterString
     * @returns Article Successful Response
     * @throws ApiError
     */
    public readArticlesByStockArticleStockStockIdGet(
        stockId: number,
        skip?: number,
        limit: number = 100,
        filterString: string = '',
    ): Observable<Array<Article>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/article/stock/{stock_id}',
            path: {
                'stock_id': stockId,
            },
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Article
     * @param articleId
     * @returns Article Successful Response
     * @throws ApiError
     */
    public readArticleArticleArticleIdGet(
        articleId: number,
    ): Observable<Article> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/article/{article_id}',
            path: {
                'article_id': articleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Article
     * @param articleId
     * @param requestBody
     * @returns Article Successful Response
     * @throws ApiError
     */
    public updateArticleArticleArticleIdPut(
        articleId: number,
        requestBody: ArticleUpdateFull,
    ): Observable<Article> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/article/{article_id}',
            path: {
                'article_id': articleId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Copy Article And Modify
     * @param articleId
     * @param requestBody
     * @returns Article Successful Response
     * @throws ApiError
     */
    public copyArticleAndModifyArticleArticleIdPost(
        articleId: number,
        requestBody: ArticleUpdate,
    ): Observable<Article> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/article/{article_id}',
            path: {
                'article_id': articleId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Article
     * @param articleId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteArticleArticleArticleIdDelete(
        articleId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/article/{article_id}',
            path: {
                'article_id': articleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch Article
     * @param articleId
     * @param requestBody
     * @returns Article Successful Response
     * @throws ApiError
     */
    public patchArticleArticleArticleIdPatch(
        articleId: number,
        requestBody: ArticleUpdate,
    ): Observable<Article> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/article/{article_id}',
            path: {
                'article_id': articleId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Toggle Article Favorite
     * @param articleId
     * @returns Article Successful Response
     * @throws ApiError
     */
    public toggleArticleFavoriteArticleFavoriteArticleIdPost(
        articleId: number,
    ): Observable<Article> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/article/favorite/{article_id}',
            path: {
                'article_id': articleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Article
     * @param articleId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockArticleArticleLockArticleIdPost(
        articleId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/article/lock/{article_id}',
            path: {
                'article_id': articleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Article
     * @param articleId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockArticleArticleUnlockArticleIdPost(
        articleId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/article/unlock/{article_id}',
            path: {
                'article_id': articleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Ingoing Invoices
     * @param skip
     * @param limit
     * @param filter
     * @param paid
     * @param year
     * @returns IngoingInvoice Successful Response
     * @throws ApiError
     */
    public readIngoingInvoicesIngoingInvoiceGet(
        skip?: number,
        limit: number = 100,
        filter: string = '',
        paid?: boolean,
        year?: number,
    ): Observable<Array<IngoingInvoice>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/ingoing_invoice/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter': filter,
                'paid': paid,
                'year': year,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Ingoing Invoice
     * @param requestBody
     * @returns IngoingInvoice Successful Response
     * @throws ApiError
     */
    public createIngoingInvoiceIngoingInvoicePost(
        requestBody: IngoingInvoiceCreate,
    ): Observable<IngoingInvoice> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/ingoing_invoice/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Pay
     * @param ingoingInvoiceId
     * @returns IngoingInvoice Successful Response
     * @throws ApiError
     */
    public payIngoingInvoicePaymentIngoingInvoiceIdPayPost(
        ingoingInvoiceId: number,
    ): Observable<IngoingInvoice> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/ingoing_invoice/payment/{ingoing_invoice_id}/pay',
            path: {
                'ingoing_invoice_id': ingoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unpay
     * @param ingoingInvoiceId
     * @returns IngoingInvoice Successful Response
     * @throws ApiError
     */
    public unpayIngoingInvoicePaymentIngoingInvoiceIdUnpayPost(
        ingoingInvoiceId: number,
    ): Observable<IngoingInvoice> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/ingoing_invoice/payment/{ingoing_invoice_id}/unpay',
            path: {
                'ingoing_invoice_id': ingoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Ingoing Invoice Xml
     * @param requestBody
     * @returns IngoingInvoice Successful Response
     * @throws ApiError
     */
    public uploadIngoingInvoiceXmlIngoingInvoiceUploadXmlPost(
        requestBody: Array<XmlFileBytes>,
    ): Observable<Array<IngoingInvoice>> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/ingoing_invoice/upload_xml',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Ingoing Invoice Xml As String
     * @param requestBody
     * @returns IngoingInvoice Successful Response
     * @throws ApiError
     */
    public uploadIngoingInvoiceXmlAsStringIngoingInvoiceUploadXmlAsStringPost(
        requestBody: Array<XmlFileStr>,
    ): Observable<Array<IngoingInvoice>> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/ingoing_invoice/upload_xml_as_string',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Count Ingoing Invoices
     * @param paid
     * @param year
     * @returns number Successful Response
     * @throws ApiError
     */
    public countIngoingInvoicesIngoingInvoiceCountGet(
        paid?: boolean,
        year?: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/ingoing_invoice/count',
            query: {
                'paid': paid,
                'year': year,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Ingoing Invoices
     * @param ingoingInvoiceId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readIngoingInvoicesIngoingInvoiceArticlesCountIngoingInvoiceIdGet(
        ingoingInvoiceId: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/ingoing_invoice/articles/count/{ingoing_invoice_id}',
            path: {
                'ingoing_invoice_id': ingoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Generate Unpaid Ingoing Invoices Pdf
     * @returns string Successful Response
     * @throws ApiError
     */
    public generateUnpaidIngoingInvoicesPdfIngoingInvoicePdfUnpaidGet(): Observable<string> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/ingoing_invoice/pdf/unpaid',
        });
    }
    /**
     * Read Ingoing Invoices
     * @param ingoingInvoiceId
     * @param skip
     * @param limit
     * @param filter
     * @returns DescriptiveArticle Successful Response
     * @throws ApiError
     */
    public readIngoingInvoicesIngoingInvoiceArticlesIngoingInvoiceIdGet(
        ingoingInvoiceId: number,
        skip?: number,
        limit: number = 100,
        filter: string = '',
    ): Observable<Array<DescriptiveArticle>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/ingoing_invoice/articles/{ingoing_invoice_id}',
            path: {
                'ingoing_invoice_id': ingoingInvoiceId,
            },
            query: {
                'skip': skip,
                'limit': limit,
                'filter': filter,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Available Years
     * @returns number Successful Response
     * @throws ApiError
     */
    public getAvailableYearsIngoingInvoiceAvailableYearsGet(): Observable<Array<number>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/ingoing_invoice/available_years',
        });
    }
    /**
     * Read Ingoing Invoice
     * @param ingoingInvoiceId
     * @returns IngoingInvoice Successful Response
     * @throws ApiError
     */
    public readIngoingInvoiceIngoingInvoiceIngoingInvoiceIdGet(
        ingoingInvoiceId: number,
    ): Observable<IngoingInvoice> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/ingoing_invoice/{ingoing_invoice_id}',
            path: {
                'ingoing_invoice_id': ingoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Ingoing Invoice
     * @param ingoingInvoiceId
     * @param requestBody
     * @returns IngoingInvoice Successful Response
     * @throws ApiError
     */
    public updateIngoingInvoiceIngoingInvoiceIngoingInvoiceIdPut(
        ingoingInvoiceId: number,
        requestBody: IngoingInvoiceCreate,
    ): Observable<IngoingInvoice> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/ingoing_invoice/{ingoing_invoice_id}',
            path: {
                'ingoing_invoice_id': ingoingInvoiceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Ingoing Invoice
     * @param ingoingInvoiceId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteIngoingInvoiceIngoingInvoiceIngoingInvoiceIdDelete(
        ingoingInvoiceId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/ingoing_invoice/{ingoing_invoice_id}',
            path: {
                'ingoing_invoice_id': ingoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Ingoing Invoice
     * @param ingoingInvoiceId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockIngoingInvoiceIngoingInvoiceLockIngoingInvoiceIdPost(
        ingoingInvoiceId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/ingoing_invoice/lock/{ingoing_invoice_id}',
            path: {
                'ingoing_invoice_id': ingoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unlock Ingoing Invoice
     * @param ingoingInvoiceId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public unlockIngoingInvoiceIngoingInvoiceUnlockIngoingInvoiceIdPost(
        ingoingInvoiceId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/ingoing_invoice/unlock/{ingoing_invoice_id}',
            path: {
                'ingoing_invoice_id': ingoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Islocked Ingoing Invoice
     * @param ingoingInvoiceId
     * @returns Lock Successful Response
     * @throws ApiError
     */
    public islockedIngoingInvoiceIngoingInvoiceIslockedIngoingInvoiceIdGet(
        ingoingInvoiceId: number,
    ): Observable<Lock> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/ingoing_invoice/islocked/{ingoing_invoice_id}',
            path: {
                'ingoing_invoice_id': ingoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Outgoing Invoices
     * @param skip
     * @param filterString
     * @param limit
     * @param paid
     * @param year
     * @returns OutgoingInvoice Successful Response
     * @throws ApiError
     */
    public readOutgoingInvoicesOutgoingInvoiceGet(
        skip?: number,
        filterString: string = '',
        limit: number = 100,
        paid?: boolean,
        year?: number,
    ): Observable<Array<OutgoingInvoice>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/outgoing_invoice/',
            query: {
                'skip': skip,
                'filter_string': filterString,
                'limit': limit,
                'paid': paid,
                'year': year,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Outgoing Invoice
     * @param requestBody
     * @returns OutgoingInvoice Successful Response
     * @throws ApiError
     */
    public createOutgoingInvoiceOutgoingInvoicePost(
        requestBody: OutgoingInvoiceCreate,
    ): Observable<OutgoingInvoice> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/outgoing_invoice/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Outgoing Invoices By Job
     * @param jobId
     * @param filterString
     * @param skip
     * @param limit
     * @returns OutgoingInvoice Successful Response
     * @throws ApiError
     */
    public readOutgoingInvoicesByJobOutgoingInvoiceJobJobIdGet(
        jobId: number,
        filterString: string = '',
        skip?: number,
        limit: number = 100,
    ): Observable<Array<OutgoingInvoice>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/outgoing_invoice/job/{job_id}',
            path: {
                'job_id': jobId,
            },
            query: {
                'filter_string': filterString,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Count Outgoing Invoices
     * @param paid
     * @param year
     * @returns number Successful Response
     * @throws ApiError
     */
    public countOutgoingInvoicesOutgoingInvoiceCountGet(
        paid?: boolean,
        year?: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/outgoing_invoice/count',
            query: {
                'paid': paid,
                'year': year,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Generate Unpaid Outgoing Invoices Pdf
     * @returns string Successful Response
     * @throws ApiError
     */
    public generateUnpaidOutgoingInvoicesPdfOutgoingInvoicePdfUnpaidGet(): Observable<string> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/outgoing_invoice/pdf/unpaid',
        });
    }
    /**
     * Get Available Years
     * @returns number Successful Response
     * @throws ApiError
     */
    public getAvailableYearsOutgoingInvoiceAvailableYearsGet(): Observable<Array<number>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/outgoing_invoice/available_years',
        });
    }
    /**
     * Get Next Rg Number
     * @returns string Successful Response
     * @throws ApiError
     */
    public getNextRgNumberOutgoingInvoiceRgNumberGet(): Observable<string> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/outgoing_invoice/rg_number',
        });
    }
    /**
     * Read Outgoing Invoice
     * @param outgoingInvoiceId
     * @returns OutgoingInvoice Successful Response
     * @throws ApiError
     */
    public readOutgoingInvoiceOutgoingInvoiceOutgoingInvoiceIdGet(
        outgoingInvoiceId: number,
    ): Observable<OutgoingInvoice> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/outgoing_invoice/{outgoing_invoice_id}',
            path: {
                'outgoing_invoice_id': outgoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Outgoing Invoice
     * @param outgoingInvoiceId
     * @param requestBody
     * @returns OutgoingInvoice Successful Response
     * @throws ApiError
     */
    public updateOutgoingInvoiceOutgoingInvoiceOutgoingInvoiceIdPut(
        outgoingInvoiceId: number,
        requestBody: OutgoingInvoiceUpdate,
    ): Observable<OutgoingInvoice> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/outgoing_invoice/{outgoing_invoice_id}',
            path: {
                'outgoing_invoice_id': outgoingInvoiceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Outgoing Invoice
     * @param outgoingInvoiceId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteOutgoingInvoiceOutgoingInvoiceOutgoingInvoiceIdDelete(
        outgoingInvoiceId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/outgoing_invoice/{outgoing_invoice_id}',
            path: {
                'outgoing_invoice_id': outgoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Count Outgoing Invoices By Job
     * @param jobId
     * @returns number Successful Response
     * @throws ApiError
     */
    public countOutgoingInvoicesByJobOutgoingInvoiceJobCountJobIdGet(
        jobId: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/outgoing_invoice/job/count/{job_id}',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Reminder
     * @param outgoingInvoiceId
     * @param requestBody
     * @returns OutgoingInvoice Successful Response
     * @throws ApiError
     */
    public createReminderOutgoingInvoiceReminderOutgoingInvoiceIdAddPost(
        outgoingInvoiceId: number,
        requestBody: ReminderCreate,
    ): Observable<OutgoingInvoice> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/outgoing_invoice/reminder/{outgoing_invoice_id}/add',
            path: {
                'outgoing_invoice_id': outgoingInvoiceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Reminder
     * @param outgoingInvoiceId
     * @returns OutgoingInvoice Successful Response
     * @throws ApiError
     */
    public createReminderOutgoingInvoiceReminderOutgoingInvoiceIdRemovePost(
        outgoingInvoiceId: number,
    ): Observable<OutgoingInvoice> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/outgoing_invoice/reminder/{outgoing_invoice_id}/remove',
            path: {
                'outgoing_invoice_id': outgoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Payment
     * @param outgoingInvoiceId
     * @param requestBody
     * @returns OutgoingInvoice Successful Response
     * @throws ApiError
     */
    public createPaymentOutgoingInvoicePaymentOutgoingInvoiceIdAddPost(
        outgoingInvoiceId: number,
        requestBody: PaymentCreate,
    ): Observable<OutgoingInvoice> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/outgoing_invoice/payment/{outgoing_invoice_id}/add',
            path: {
                'outgoing_invoice_id': outgoingInvoiceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Pay
     * @param outgoingInvoiceId
     * @returns OutgoingInvoice Successful Response
     * @throws ApiError
     */
    public payOutgoingInvoicePaymentOutgoingInvoiceIdPayPost(
        outgoingInvoiceId: number,
    ): Observable<OutgoingInvoice> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/outgoing_invoice/payment/{outgoing_invoice_id}/pay',
            path: {
                'outgoing_invoice_id': outgoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unpay
     * @param outgoingInvoiceId
     * @returns OutgoingInvoice Successful Response
     * @throws ApiError
     */
    public unpayOutgoingInvoicePaymentOutgoingInvoiceIdUnpayPost(
        outgoingInvoiceId: number,
    ): Observable<OutgoingInvoice> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/outgoing_invoice/payment/{outgoing_invoice_id}/unpay',
            path: {
                'outgoing_invoice_id': outgoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Payment
     * @param outgoingInvoiceId
     * @returns OutgoingInvoice Successful Response
     * @throws ApiError
     */
    public createPaymentOutgoingInvoicePaymentOutgoingInvoiceIdRemovePost(
        outgoingInvoiceId: number,
    ): Observable<OutgoingInvoice> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/outgoing_invoice/payment/{outgoing_invoice_id}/remove',
            path: {
                'outgoing_invoice_id': outgoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Outgoing Invoice
     * @param outgoingInvoiceId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockOutgoingInvoiceOutgoingInvoiceLockOutgoingInvoiceIdPost(
        outgoingInvoiceId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/outgoing_invoice/lock/{outgoing_invoice_id}',
            path: {
                'outgoing_invoice_id': outgoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unlock Outgoing Invoice
     * @param outgoingInvoiceId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public unlockOutgoingInvoiceOutgoingInvoiceUnlockOutgoingInvoiceIdPost(
        outgoingInvoiceId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/outgoing_invoice/unlock/{outgoing_invoice_id}',
            path: {
                'outgoing_invoice_id': outgoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Islocked Outgoing Invoice
     * @param outgoingInvoiceId
     * @returns Lock Successful Response
     * @throws ApiError
     */
    public islockedOutgoingInvoiceOutgoingInvoiceIslockedOutgoingInvoiceIdGet(
        outgoingInvoiceId: number,
    ): Observable<Lock> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/outgoing_invoice/islocked/{outgoing_invoice_id}',
            path: {
                'outgoing_invoice_id': outgoingInvoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Suppliers
     * @param skip
     * @param limit
     * @param filterString
     * @param favoritesFirst
     * @param showOnlyOrders
     * @returns Supplier Successful Response
     * @throws ApiError
     */
    public readSuppliersSupplierGet(
        skip?: number,
        limit: number = 100,
        filterString?: any,
        favoritesFirst: boolean = false,
        showOnlyOrders: boolean = false,
    ): Observable<Array<Supplier>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/supplier/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'favorites_first': favoritesFirst,
                'show_only_orders': showOnlyOrders,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Supplier
     * @param requestBody
     * @returns Supplier Successful Response
     * @throws ApiError
     */
    public createSupplierSupplierPost(
        requestBody: SupplierCreate,
    ): Observable<Supplier> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/supplier/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Supplier Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public readSupplierCountSupplierCountGet(): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/supplier/count',
        });
    }
    /**
     * Read Supplier
     * @param supplierId
     * @returns Supplier Successful Response
     * @throws ApiError
     */
    public readSupplierSupplierSupplierIdGet(
        supplierId: number,
    ): Observable<Supplier> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/supplier/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Supplier
     * @param supplierId
     * @param requestBody
     * @returns Supplier Successful Response
     * @throws ApiError
     */
    public updateSupplierSupplierSupplierIdPut(
        supplierId: number,
        requestBody: SupplierCreate,
    ): Observable<Supplier> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/supplier/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Supplier
     * @param supplierId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteSupplierSupplierSupplierIdDelete(
        supplierId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/supplier/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Supplier By Contact
     * @param contactId
     * @returns Supplier Successful Response
     * @throws ApiError
     */
    public readSupplierByContactSupplierContactContactIdGet(
        contactId: number,
    ): Observable<Supplier> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/supplier/contact/{contact_id}',
            path: {
                'contact_id': contactId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Toggle Supplier Favorite
     * @param supplierId
     * @returns Supplier Successful Response
     * @throws ApiError
     */
    public toggleSupplierFavoriteSupplierFavoriteSupplierIdPost(
        supplierId: number,
    ): Observable<Supplier> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/supplier/favorite/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Supplier
     * @param supplierId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockSupplierSupplierLockSupplierIdPost(
        supplierId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/supplier/lock/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unlock Supplier
     * @param supplierId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public unlockSupplierSupplierUnlockSupplierIdPost(
        supplierId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/supplier/unlock/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Islocked Supplier
     * @param supplierId
     * @returns Lock Successful Response
     * @throws ApiError
     */
    public islockedSupplierSupplierIslockedSupplierIdGet(
        supplierId: number,
    ): Observable<Lock> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/supplier/islocked/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Stock Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public readStockCountStockCountGet(): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/stock/count',
        });
    }
    /**
     * Read Stock
     * @param stockId
     * @returns Stock Successful Response
     * @throws ApiError
     */
    public readStockStockStockIdGet(
        stockId: number,
    ): Observable<Stock> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/stock/{stock_id}',
            path: {
                'stock_id': stockId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Stock
     * @param stockId
     * @param requestBody
     * @returns Stock Successful Response
     * @throws ApiError
     */
    public updateStockStockStockIdPut(
        stockId: number,
        requestBody: StockUpdate,
    ): Observable<Stock> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/stock/{stock_id}',
            path: {
                'stock_id': stockId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Stock
     * @param stockId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteStockStockStockIdDelete(
        stockId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/stock/{stock_id}',
            path: {
                'stock_id': stockId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Stocks
     * @param skip
     * @param limit
     * @param filterString
     * @returns Stock Successful Response
     * @throws ApiError
     */
    public readStocksStockGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
    ): Observable<Array<Stock>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/stock/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Stock
     * @param requestBody
     * @returns Stock Successful Response
     * @throws ApiError
     */
    public createStockStockPost(
        requestBody: StockCreate,
    ): Observable<Stock> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/stock/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Stock
     * @param stockId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockStockStockLockStockIdPost(
        stockId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/stock/lock/{stock_id}',
            path: {
                'stock_id': stockId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unlock Stock
     * @param stockId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public unlockStockStockUnlockStockIdPost(
        stockId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/stock/unlock/{stock_id}',
            path: {
                'stock_id': stockId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Islocked Stock
     * @param stockId
     * @returns Lock Successful Response
     * @throws ApiError
     */
    public islockedStockStockIslockedStockIdGet(
        stockId: number,
    ): Observable<Lock> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/stock/islocked/{stock_id}',
            path: {
                'stock_id': stockId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Generate Jobs Pdf
     * @returns string Successful Response
     * @throws ApiError
     */
    public generateJobsPdfJobGenerateJobsPdfPost(): Observable<string> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/job/generate_jobs_pdf',
        });
    }
    /**
     * Read Jobs
     * @param skip
     * @param limit
     * @param filterString
     * @param clientId
     * @param statuses
     * @param excludeSubjobs
     * @param year
     * @returns Job Successful Response
     * @throws ApiError
     */
    public readJobsJobGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        clientId?: number,
        statuses: string = '',
        excludeSubjobs: boolean = false,
        year?: number,
    ): Observable<Array<Job>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/job/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'client_id': clientId,
                'statuses': statuses,
                'exclude_subjobs': excludeSubjobs,
                'year': year,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Job
     * @param requestBody
     * @returns Job Successful Response
     * @throws ApiError
     */
    public createJobJobPost(
        requestBody: JobCreate,
    ): Observable<Job> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/job/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Job Count
     * @param status
     * @param excludeSubjobs
     * @param clientId
     * @param year
     * @returns number Successful Response
     * @throws ApiError
     */
    public readJobCountJobCountGet(
        status?: JobStatusType,
        excludeSubjobs: boolean = false,
        clientId?: number,
        year?: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/job/count',
            query: {
                'status': status,
                'exclude_subjobs': excludeSubjobs,
                'client_id': clientId,
                'year': year,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Available Years
     * @returns number Successful Response
     * @throws ApiError
     */
    public readAvailableYearsJobYearGet(): Observable<Array<number>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/job/year',
        });
    }
    /**
     * Read Job Status
     * @param jobId
     * @returns JobStatus Successful Response
     * @throws ApiError
     */
    public readJobStatusJobStatusJobIdGet(
        jobId: number,
    ): Observable<JobStatus> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/job/status/{job_id}',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Job Status
     * @param jobId
     * @param jobStatus
     * @returns JobStatusUpdateResponse Successful Response
     * @throws ApiError
     */
    public updateJobStatusJobStatusJobIdPost(
        jobId: number,
        jobStatus: JobStatusType,
    ): Observable<JobStatusUpdateResponse> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/job/status/{job_id}',
            path: {
                'job_id': jobId,
            },
            query: {
                'job_status': jobStatus,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Job
     * @param jobId
     * @returns Job Successful Response
     * @throws ApiError
     */
    public readJobJobJobIdGet(
        jobId: number,
    ): Observable<Job> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/job/{job_id}',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Job
     * @param jobId
     * @param requestBody
     * @returns Job Successful Response
     * @throws ApiError
     */
    public updateJobJobJobIdPut(
        jobId: number,
        requestBody: JobUpdate,
    ): Observable<Job> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/job/{job_id}',
            path: {
                'job_id': jobId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Job
     * @param jobId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteJobJobJobIdDelete(
        jobId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/job/{job_id}',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Subjob To Job
     * @param jobId
     * @param requestBody
     * @returns Job Successful Response
     * @throws ApiError
     */
    public addSubjobToJobJobSubJobJobIdPost(
        jobId: number,
        requestBody: SubJobCreate,
    ): Observable<Job> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/job/sub_job/{job_id}',
            path: {
                'job_id': jobId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Subjob
     * @param subjobId
     * @param requestBody
     * @returns Job Successful Response
     * @throws ApiError
     */
    public updateSubjobJobSubJobSubjobIdPut(
        subjobId: number,
        requestBody: SubJobCreate,
    ): Observable<Job> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/job/sub_job/{subjob_id}',
            path: {
                'subjob_id': subjobId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Patch Path
     * @param jobId
     * @param path
     * @returns Job Successful Response
     * @throws ApiError
     */
    public patchPathJobPathJobIdPut(
        jobId: number,
        path: string,
    ): Observable<Job> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/job/path/{job_id}',
            path: {
                'job_id': jobId,
            },
            query: {
                'path': path,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Subjobs By Job
     * @param jobId
     * @param filter
     * @param skip
     * @param limit
     * @returns Job Successful Response
     * @throws ApiError
     */
    public readSubjobsByJobJobSubjobByJobJobIdGet(
        jobId: number,
        filter: string = '',
        skip?: number,
        limit: number = 100,
    ): Observable<Array<Job>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/job/subjob_by_job/{job_id}',
            path: {
                'job_id': jobId,
            },
            query: {
                'filter': filter,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Subjob Count By Job
     * @param jobId
     * @param filter
     * @param skip
     * @param limit
     * @returns number Successful Response
     * @throws ApiError
     */
    public readSubjobCountByJobJobSubjobCountByJobJobIdGet(
        jobId: number,
        filter: string = '',
        skip?: number,
        limit: number = 100,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/job/subjob_count_by_job/{job_id}',
            path: {
                'job_id': jobId,
            },
            query: {
                'filter': filter,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Job
     * @param jobId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockJobJobLockJobIdPost(
        jobId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/job/lock/{job_id}',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unlock Job
     * @param jobId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public unlockJobJobUnlockJobIdPost(
        jobId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/job/unlock/{job_id}',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Islocked Job
     * @param jobId
     * @returns Lock Successful Response
     * @throws ApiError
     */
    public islockedJobJobIslockedJobIdGet(
        jobId: number,
    ): Observable<Lock> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/job/islocked/{job_id}',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Status Options
     * @returns JobStatus Successful Response
     * @throws ApiError
     */
    public getStatusOptionsJobStatusOptionsGet(): Observable<Array<JobStatus>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/job/status_options/',
        });
    }
    /**
     * Generate Job Pdf
     * @returns string Successful Response
     * @throws ApiError
     */
    public generateJobPdfJobPdfPost(): Observable<string> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/job/pdf',
        });
    }
    /**
     * Backup Job
     * @param jobId
     * @returns any Successful Response
     * @throws ApiError
     */
    public backupJobJobBackupJobIdPost(
        jobId: number,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/job/backup/{job_id}',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Move Job To Year
     * @param jobId
     * @param year
     * @returns any Successful Response
     * @throws ApiError
     */
    public moveJobToYearJobMoveJobToYearJobIdPost(
        jobId: number,
        year: number,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/job/move_job_to_year/{job_id}/',
            path: {
                'job_id': jobId,
            },
            query: {
                'year': year,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Orders
     * @param skip
     * @param limit
     * @param filterString
     * @returns Order Successful Response
     * @throws ApiError
     */
    public readOrdersOrderGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
    ): Observable<Array<Order>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Order
     * @param requestBody
     * @returns Order Successful Response
     * @throws ApiError
     */
    public createOrderOrderPost(
        requestBody: OrderCreate,
    ): Observable<Order> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/order/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Orders Supplier
     * @param supplierId
     * @param skip
     * @param limit
     * @param filterString
     * @param orderStatus
     * @param request
     * @returns Order Successful Response
     * @throws ApiError
     */
    public readOrdersSupplierOrderSupplierSupplierIdGet(
        supplierId: number,
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        orderStatus?: OrderStatusType,
        request?: boolean,
    ): Observable<Array<Order>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order/supplier/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'order_status': orderStatus,
                'request': request,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Order
     * @param orderId
     * @returns Order Successful Response
     * @throws ApiError
     */
    public readOrderOrderOrderIdGet(
        orderId: number,
    ): Observable<Order> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order/{order_id}',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Order
     * @param orderId
     * @param requestBody
     * @returns Order Successful Response
     * @throws ApiError
     */
    public updateOrderOrderOrderIdPut(
        orderId: number,
        requestBody: OrderUpdate,
    ): Observable<Order> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/order/{order_id}',
            path: {
                'order_id': orderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Order
     * @param orderId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteOrderOrderOrderIdDelete(
        orderId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/order/{order_id}',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Order Count
     * @param supplierId
     * @param orderStatus
     * @returns number Successful Response
     * @throws ApiError
     */
    public readOrderCountOrderSupplierSupplierIdCountGet(
        supplierId: number,
        orderStatus?: OrderStatusType,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order/supplier/{supplier_id}/count',
            path: {
                'supplier_id': supplierId,
            },
            query: {
                'order_status': orderStatus,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Orders To
     * @param orderableToId
     * @param skip
     * @param limit
     * @param filterString
     * @param status
     * @returns Order Successful Response
     * @throws ApiError
     */
    public readOrdersToOrderToOrderableToIdGet(
        orderableToId: number,
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        status?: OrderStatusType,
    ): Observable<Array<Order>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order/to/{orderable_to_id}',
            path: {
                'orderable_to_id': orderableToId,
            },
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'status': status,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Orders To Count
     * @param orderableToId
     * @param status
     * @returns number Successful Response
     * @throws ApiError
     */
    public readOrdersToCountOrderToOrderableToIdCountGet(
        orderableToId: number,
        status?: OrderStatusType,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order/to/{orderable_to_id}/count',
            path: {
                'orderable_to_id': orderableToId,
            },
            query: {
                'status': status,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Orders From
     * @param orderableFromId
     * @param skip
     * @param limit
     * @param filterString
     * @param status
     * @returns Order Successful Response
     * @throws ApiError
     */
    public readOrdersFromOrderFromOrderableFromIdGet(
        orderableFromId: number,
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        status?: OrderStatusType,
    ): Observable<Array<Order>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order/from/{orderable_from_id}',
            path: {
                'orderable_from_id': orderableFromId,
            },
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'status': status,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Orders From Count
     * @param orderableFromId
     * @param status
     * @returns number Successful Response
     * @throws ApiError
     */
    public readOrdersFromCountOrderFromOrderableFromIdCountGet(
        orderableFromId: number,
        status?: OrderStatusType,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order/from/{orderable_from_id}/count',
            path: {
                'orderable_from_id': orderableFromId,
            },
            query: {
                'status': status,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Order From To
     * @param orderableFromId
     * @param orderableToId
     * @returns Order Successful Response
     * @throws ApiError
     */
    public readOrderFromToOrderFromOrderableFromIdToOrderableToIdGet(
        orderableFromId: number,
        orderableToId: number,
    ): Observable<Order> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order/from/{orderable_from_id}/to/{orderable_to_id}',
            path: {
                'orderable_from_id': orderableFromId,
                'orderable_to_id': orderableToId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Generate Order Pdf
     * @param requestBody
     * @returns string Successful Response
     * @throws ApiError
     */
    public generateOrderPdfOrderPdfPost(
        requestBody: Array<number>,
    ): Observable<string> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/order/pdf',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Move Ordered Articles
     * @param oldOrderId
     * @param newOrderableToId
     * @param requestBody
     * @returns Order Successful Response
     * @throws ApiError
     */
    public moveOrderedArticlesOrderMoveOldOrderIdNewOrderableToIdPost(
        oldOrderId: number,
        newOrderableToId: number,
        requestBody: Array<number>,
    ): Observable<Order> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/order/move/{old_order_id}/{new_orderable_to_id}',
            path: {
                'old_order_id': oldOrderId,
                'new_orderable_to_id': newOrderableToId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Ordered Article To Order
     * @param orderId
     * @param requestBody
     * @returns Order Successful Response
     * @throws ApiError
     */
    public addOrderedArticleToOrderOrderOrderedArticleOrderIdPut(
        orderId: number,
        requestBody: OrderedArticleCreate,
    ): Observable<Order> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/order/ordered_article/{order_id}',
            path: {
                'order_id': orderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Order
     * @param orderId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockOrderOrderLockOrderIdPost(
        orderId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/order/lock/{order_id}',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Order
     * @param orderId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockOrderOrderUnlockOrderIdPost(
        orderId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/order/unlock/{order_id}',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Islocked Order
     * @param orderId
     * @returns Lock Successful Response
     * @throws ApiError
     */
    public islockedOrderOrderIslockedOrderIdGet(
        orderId: number,
    ): Observable<Lock> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order/islocked/{order_id}',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Orders By Order Bundle
     * @param orderBundleId
     * @param skip
     * @param limit
     * @param filterString
     * @returns Order Successful Response
     * @throws ApiError
     */
    public readOrdersByOrderBundleOrderBundleOrdersOrderBundleIdGet(
        orderBundleId: number,
        skip?: number,
        limit: number = 100,
        filterString: string = '',
    ): Observable<Array<Order>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order_bundle/orders/{order_bundle_id}',
            path: {
                'order_bundle_id': orderBundleId,
            },
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Orders By Order Bundle
     * @param orderBundleId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readOrdersByOrderBundleOrderBundleOrdersOrderBundleIdCountGet(
        orderBundleId: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order_bundle/orders/{order_bundle_id}/count',
            path: {
                'order_bundle_id': orderBundleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Order Bundle By Supplier
     * @param supplierId
     * @param skip
     * @param limit
     * @param filterString
     * @param orderStatus
     * @param request
     * @returns OrderBundle Successful Response
     * @throws ApiError
     */
    public readOrderBundleBySupplierOrderBundleSupplierSupplierIdGet(
        supplierId: number,
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        orderStatus?: OrderStatusType,
        request: boolean = false,
    ): Observable<Array<OrderBundle>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order_bundle/supplier/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'order_status': orderStatus,
                'request': request,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Count Of Order Bundle By Supplier And Status
     * @param supplierId
     * @param orderStatus
     * @param request
     * @returns number Successful Response
     * @throws ApiError
     */
    public readCountOfOrderBundleBySupplierAndStatusOrderBundleSupplierSupplierIdCountGet(
        supplierId: number,
        orderStatus?: OrderStatusType,
        request: boolean = false,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order_bundle/supplier/{supplier_id}/count',
            path: {
                'supplier_id': supplierId,
            },
            query: {
                'order_status': orderStatus,
                'request': request,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Order Bundle
     * @param orderBundleId
     * @returns OrderBundle Successful Response
     * @throws ApiError
     */
    public readOrderBundleOrderBundleOrderBundleIdGet(
        orderBundleId: number,
    ): Observable<OrderBundle> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order_bundle/{order_bundle_id}',
            path: {
                'order_bundle_id': orderBundleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Order Bundle
     * @param orderBundleId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteOrderBundleOrderBundleOrderBundleIdDelete(
        orderBundleId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/order_bundle/{order_bundle_id}',
            path: {
                'order_bundle_id': orderBundleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Regenerate Order Bundle Pdf
     * @param orderBundleId
     * @returns OrderBundle Successful Response
     * @throws ApiError
     */
    public regenerateOrderBundlePdfOrderBundlePdfOrderBundleIdPut(
        orderBundleId: number,
    ): Observable<OrderBundle> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/order_bundle/pdf/{order_bundle_id}',
            path: {
                'order_bundle_id': orderBundleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Order Bundle
     * @param orderBundleId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockOrderBundleOrderBundleLockOrderBundleIdPost(
        orderBundleId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/order_bundle/lock/{order_bundle_id}',
            path: {
                'order_bundle_id': orderBundleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unlock Order Bundle
     * @param orderBundleId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public unlockOrderBundleOrderBundleUnlockOrderBundleIdPost(
        orderBundleId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/order_bundle/unlock/{order_bundle_id}',
            path: {
                'order_bundle_id': orderBundleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Islocked Order Bundle
     * @param orderBundleId
     * @returns Lock Successful Response
     * @throws ApiError
     */
    public islockedOrderBundleOrderBundleIslockedOrderBundleIdGet(
        orderBundleId: number,
    ): Observable<Lock> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/order_bundle/islocked/{order_bundle_id}',
            path: {
                'order_bundle_id': orderBundleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Order Bundle
     * @param requestBody
     * @returns OrderBundle Successful Response
     * @throws ApiError
     */
    public createOrderBundleOrderBundlePost(
        requestBody: OrderBundleCreate,
    ): Observable<OrderBundle> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/order_bundle/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Clients
     * @param skip
     * @param limit
     * @param filter
     * @param privateOnly
     * @param companyOnly
     * @returns Client Successful Response
     * @throws ApiError
     */
    public readClientsClientGet(
        skip?: number,
        limit: number = 100,
        filter: string = '',
        privateOnly: boolean = false,
        companyOnly: boolean = false,
    ): Observable<Array<Client>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/client/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter': filter,
                'private_only': privateOnly,
                'company_only': companyOnly,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Client
     * @param requestBody
     * @returns Client Successful Response
     * @throws ApiError
     */
    public createClientClientPost(
        requestBody: ClientCreate,
    ): Observable<Client> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/client/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Client Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public readClientCountClientCountGet(): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/client/count',
        });
    }
    /**
     * Get Client Validation
     * @param clientId
     * @returns ClientValidation Successful Response
     * @throws ApiError
     */
    public getClientValidationClientValidationClientIdGet(
        clientId: number,
    ): Observable<ClientValidation> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/client/validation/{client_id}',
            path: {
                'client_id': clientId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Client
     * @param clientId
     * @returns Client Successful Response
     * @throws ApiError
     */
    public readClientClientClientIdGet(
        clientId: number,
    ): Observable<Client> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/client/{client_id}',
            path: {
                'client_id': clientId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Client
     * @param clientId
     * @param requestBody
     * @returns Client Successful Response
     * @throws ApiError
     */
    public updateClientClientClientIdPut(
        clientId: number,
        requestBody: ClientCreate,
    ): Observable<Client> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/client/{client_id}',
            path: {
                'client_id': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Client
     * @param clientId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteClientClientClientIdDelete(
        clientId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/client/{client_id}',
            path: {
                'client_id': clientId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Client By Contact
     * @param contactId
     * @returns Client Successful Response
     * @throws ApiError
     */
    public readClientByContactClientContactContactIdGet(
        contactId: number,
    ): Observable<Client> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/client/contact/{contact_id}',
            path: {
                'contact_id': contactId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Client
     * @param clientId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockClientClientLockClientIdPost(
        clientId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/client/lock/{client_id}',
            path: {
                'client_id': clientId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unlock Client
     * @param clientId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public unlockClientClientUnlockClientIdPost(
        clientId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/client/unlock/{client_id}',
            path: {
                'client_id': clientId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Islocked Client
     * @param clientId
     * @returns Lock Successful Response
     * @throws ApiError
     */
    public islockedClientClientIslockedClientIdGet(
        clientId: number,
    ): Observable<Lock> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/client/islocked/{client_id}',
            path: {
                'client_id': clientId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Offers
     * @param skip
     * @param limit
     * @returns Offer Successful Response
     * @throws ApiError
     */
    public readOffersOfferGet(
        skip?: number,
        limit: number = 100,
    ): Observable<Array<Offer>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/offer/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Offer
     * @param requestBody
     * @returns Offer Successful Response
     * @throws ApiError
     */
    public createOfferOfferPost(
        requestBody: OfferCreate,
    ): Observable<Offer> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/offer/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Offer
     * @param offerId
     * @param skip
     * @param limit
     * @returns Offer Successful Response
     * @throws ApiError
     */
    public readOfferOfferOfferIdGet(
        offerId: number,
        skip?: number,
        limit: number = 100,
    ): Observable<Offer> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/offer/{offer_id}',
            path: {
                'offer_id': offerId,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Offer
     * @param offerId
     * @param requestBody
     * @returns Offer Successful Response
     * @throws ApiError
     */
    public updateOfferOfferOfferIdPut(
        offerId: number,
        requestBody: OfferUpdate,
    ): Observable<Offer> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/offer/{offer_id}',
            path: {
                'offer_id': offerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Offer
     * @param offerId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteOfferOfferOfferIdDelete(
        offerId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/offer/{offer_id}',
            path: {
                'offer_id': offerId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Offers By Job
     * @param jobId
     * @param filterString
     * @param skip
     * @param limit
     * @returns Offer Successful Response
     * @throws ApiError
     */
    public readOffersByJobOfferJobJobIdGet(
        jobId: number,
        filterString: string = '',
        skip?: number,
        limit: number = 100,
    ): Observable<Array<Offer>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/offer/job/{job_id}',
            path: {
                'job_id': jobId,
            },
            query: {
                'filter_string': filterString,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Count Offers By Job
     * @param jobId
     * @returns number Successful Response
     * @throws ApiError
     */
    public countOffersByJobOfferJobCountJobIdGet(
        jobId: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/offer/job/count/{job_id}',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Offer
     * @param offerId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockOfferOfferLockOfferIdPost(
        offerId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/offer/lock/{offer_id}',
            path: {
                'offer_id': offerId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Offer
     * @param offerId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockOfferOfferUnlockOfferIdPost(
        offerId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/offer/unlock/{offer_id}',
            path: {
                'offer_id': offerId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Islocked Offer
     * @param offerId
     * @returns Lock Successful Response
     * @throws ApiError
     */
    public islockedOfferOfferIslockedOfferIdGet(
        offerId: number,
    ): Observable<Lock> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/offer/islocked/{offer_id}',
            path: {
                'offer_id': offerId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Note Entries
     * @returns Note Successful Response
     * @throws ApiError
     */
    public readNoteEntriesNoteGet(): Observable<Array<Note>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/note/',
        });
    }
    /**
     * Create Note Entry
     * @param requestBody
     * @returns Note Successful Response
     * @throws ApiError
     */
    public createNoteEntryNotePost(
        requestBody: NoteCreate,
    ): Observable<Note> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/note/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Note Entry
     * @param noteId
     * @param requestBody
     * @returns Note Successful Response
     * @throws ApiError
     */
    public updateNoteEntryNoteNoteIdPut(
        noteId: number,
        requestBody: NoteUpdate,
    ): Observable<Note> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/note/{note_id}',
            path: {
                'note_id': noteId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Note Entry
     * @param noteId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteNoteEntryNoteNoteIdDelete(
        noteId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/note/{note_id}',
            path: {
                'note_id': noteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Countries
     * @param skip
     * @param limit
     * @returns Country Successful Response
     * @throws ApiError
     */
    public readCountriesAddressCountriesGet(
        skip?: number,
        limit: number = 100,
    ): Observable<Array<Country>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/address/countries',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Languages
     * @param skip
     * @param limit
     * @returns Language Successful Response
     * @throws ApiError
     */
    public readLanguagesLanguageGet(
        skip?: number,
        limit: number = 100,
    ): Observable<Array<Language>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/language/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Genders
     * @param skip
     * @param limit
     * @returns Gender Successful Response
     * @throws ApiError
     */
    public readGendersGenderGet(
        skip?: number,
        limit: number = 100,
    ): Observable<Array<Gender>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/gender/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Parameters
     * @param skip
     * @param limit
     * @returns Parameter Successful Response
     * @throws ApiError
     */
    public readParametersParameterGet(
        skip?: number,
        limit: number = 100,
    ): Observable<Array<Parameter>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/parameter/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Parameter
     * @param requestBody
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public setParameterParameterPost(
        requestBody: ParameterCreate,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/parameter/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Parameter
     * @param key
     * @returns string Successful Response
     * @throws ApiError
     */
    public getParameterParameterKeyGet(
        key: string,
    ): Observable<string> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/parameter/{key}',
            path: {
                'key': key,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Bulk Parameter By Key
     * @param requestBody
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public setBulkParameterByKeyParameterBulkSetPost(
        requestBody: Array<ParameterCreate>,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/parameter/bulk/set',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Bulk Parameter By Key
     * @param requestBody
     * @returns Parameter Successful Response
     * @throws ApiError
     */
    public getBulkParameterByKeyParameterBulkGetPost(
        requestBody: Array<string>,
    ): Observable<Array<Parameter>> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/parameter/bulk/get',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Credentials
     * @param skip
     * @param limit
     * @param filterString
     * @returns Credential Successful Response
     * @throws ApiError
     */
    public readCredentialsCredentialGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
    ): Observable<Array<Credential>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/credential/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Credential
     * @param requestBody
     * @returns Credential Successful Response
     * @throws ApiError
     */
    public createCredentialCredentialPost(
        requestBody: CredentialCreate,
    ): Observable<Credential> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/credential/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Credential Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public readCredentialCountCredentialCountGet(): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/credential/count',
        });
    }
    /**
     * Read Credential
     * @param credentialId
     * @param skip
     * @param limit
     * @returns Credential Successful Response
     * @throws ApiError
     */
    public readCredentialCredentialCredentialIdGet(
        credentialId: number,
        skip?: number,
        limit: number = 100,
    ): Observable<Array<Credential>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/credential/{credential_id}',
            path: {
                'credential_id': credentialId,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Credential
     * @param credentialId
     * @param requestBody
     * @returns Credential Successful Response
     * @throws ApiError
     */
    public updateCredentialCredentialCredentialIdPut(
        credentialId: number,
        requestBody: CredentialUpdate,
    ): Observable<Credential> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/credential/{credential_id}',
            path: {
                'credential_id': credentialId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Bulk Update Credentials
     * @param requestBody
     * @returns Credential Successful Response
     * @throws ApiError
     */
    public bulkUpdateCredentialsCredentialBulkPut(
        requestBody: Array<CredentialUpdate>,
    ): Observable<Array<Credential>> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/credential/bulk',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Contacts
     * @param skip
     * @param limit
     * @param filterString
     * @param contactType
     * @returns Contact Successful Response
     * @throws ApiError
     */
    public readContactsContactGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        contactType?: ContactTypeEnum,
    ): Observable<Array<Contact>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/contact/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'contact_type': contactType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Contact
     * @param contactType
     * @param requestBody
     * @param parentId
     * @returns Contact Successful Response
     * @throws ApiError
     */
    public createContactContactPost(
        contactType: ContactTypeEnum,
        requestBody: ContactCreate,
        parentId?: number,
    ): Observable<Contact> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/contact/',
            query: {
                'contact_type': contactType,
                'parent_id': parentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Contact Count
     * @param contactType
     * @param filterString
     * @returns number Successful Response
     * @throws ApiError
     */
    public readContactCountContactCountGet(
        contactType?: ContactTypeEnum,
        filterString: string = '',
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/contact/count',
            query: {
                'contact_type': contactType,
                'filter_string': filterString,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Contact
     * @param contactId
     * @param skip
     * @param limit
     * @returns Contact Successful Response
     * @throws ApiError
     */
    public readContactContactContactIdGet(
        contactId: number,
        skip?: number,
        limit: number = 100,
    ): Observable<Contact> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/contact/{contact_id}',
            path: {
                'contact_id': contactId,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Contact
     * @param contactId
     * @param contactType
     * @param requestBody
     * @param parentId
     * @returns Contact Successful Response
     * @throws ApiError
     */
    public updateContactContactContactIdPut(
        contactId: number,
        contactType: ContactTypeEnum,
        requestBody: ContactUpdate,
        parentId?: number,
    ): Observable<Contact> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/contact/{contact_id}',
            path: {
                'contact_id': contactId,
            },
            query: {
                'contact_type': contactType,
                'parent_id': parentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Contact
     * @param contactId
     * @returns number Successful Response
     * @throws ApiError
     */
    public deleteContactContactContactIdDelete(
        contactId: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/contact/{contact_id}',
            path: {
                'contact_id': contactId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Prices
     * @param skip
     * @param limit
     * @param filterString
     * @returns Price Successful Response
     * @throws ApiError
     */
    public readPricesPriceGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
    ): Observable<Array<Price>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/price/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Price
     * @param requestBody
     * @returns Price Successful Response
     * @throws ApiError
     */
    public createPricePricePost(
        requestBody: PriceCreate,
    ): Observable<Price> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/price/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Price Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public readPriceCountPriceCountGet(): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/price/count',
        });
    }
    /**
     * Read Price
     * @param priceId
     * @param skip
     * @param limit
     * @returns Price Successful Response
     * @throws ApiError
     */
    public readPricePricePriceIdGet(
        priceId: number,
        skip?: number,
        limit: number = 100,
    ): Observable<Array<Price>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/price/{price_id}',
            path: {
                'price_id': priceId,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Price
     * @param priceId
     * @param requestBody
     * @returns Price Successful Response
     * @throws ApiError
     */
    public updatePricePricePriceIdPut(
        priceId: number,
        requestBody: PriceUpdate,
    ): Observable<Price> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/price/{price_id}',
            path: {
                'price_id': priceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Bulk Update Prices
     * @param requestBody
     * @returns Price Successful Response
     * @throws ApiError
     */
    public bulkUpdatePricesPriceBulkPut(
        requestBody: Array<PriceUpdate>,
    ): Observable<Array<Price>> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/price/bulk',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Technical Datas
     * @param skip
     * @param limit
     * @param filterString
     * @returns TechnicalData Successful Response
     * @throws ApiError
     */
    public readTechnicalDatasTechnicalDataGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
    ): Observable<Array<TechnicalData>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/technical_data/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Technical Data
     * @param requestBody
     * @returns TechnicalData Successful Response
     * @throws ApiError
     */
    public createTechnicalDataTechnicalDataPost(
        requestBody: TechnicalDataCreate,
    ): Observable<TechnicalData> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/technical_data/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Technical Data Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public readTechnicalDataCountTechnicalDataCountGet(): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/technical_data/count',
        });
    }
    /**
     * Read Technical Data
     * @param technicalDataId
     * @param skip
     * @param limit
     * @returns TechnicalData Successful Response
     * @throws ApiError
     */
    public readTechnicalDataTechnicalDataTechnicalDataIdGet(
        technicalDataId: number,
        skip?: number,
        limit: number = 100,
    ): Observable<Array<TechnicalData>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/technical_data/{technical_data_id}',
            path: {
                'technical_data_id': technicalDataId,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Technical Data
     * @param technicalDataId
     * @param requestBody
     * @returns TechnicalData Successful Response
     * @throws ApiError
     */
    public updateTechnicalDataTechnicalDataTechnicalDataIdPut(
        technicalDataId: number,
        requestBody: TechnicalDataUpdate,
    ): Observable<TechnicalData> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/technical_data/{technical_data_id}',
            path: {
                'technical_data_id': technicalDataId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Bulk Update Technical Data
     * @param requestBody
     * @returns TechnicalData Successful Response
     * @throws ApiError
     */
    public bulkUpdateTechnicalDataTechnicalDataBulkPut(
        requestBody: Array<TechnicalDataUpdate>,
    ): Observable<Array<TechnicalData>> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/technical_data/bulk',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Current Work Day
     * @returns WorkDay Successful Response
     * @throws ApiError
     */
    public getCurrentWorkDayWorkDayCurrentGet(): Observable<WorkDay> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/work_day/current',
        });
    }
    /**
     * Get Current Work Day By User
     * @param userId
     * @returns WorkDay Successful Response
     * @throws ApiError
     */
    public getCurrentWorkDayByUserWorkDayCurrentUserIdGet(
        userId: number,
    ): Observable<WorkDay> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/work_day/current/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Work Day
     * @param workDayId
     * @returns WorkDay Successful Response
     * @throws ApiError
     */
    public getWorkDayWorkDayWorkDayIdGet(
        workDayId: number,
    ): Observable<WorkDay> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/work_day/{work_day_id}',
            path: {
                'work_day_id': workDayId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Work Day
     * @param workDayId
     * @param date
     * @param requestBody
     * @returns WorkDay Successful Response
     * @throws ApiError
     */
    public updateWorkDayWorkDayWorkDayIdPut(
        workDayId: number,
        date: string,
        requestBody: WorkDayUpdate,
    ): Observable<WorkDay> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/work_day/{work_day_id}',
            path: {
                'work_day_id': workDayId,
            },
            query: {
                'date': date,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Work Days By User
     * @param userId
     * @returns WorkDay Successful Response
     * @throws ApiError
     */
    public getWorkDaysByUserWorkDayUserUserIdGet(
        userId: number,
    ): Observable<Array<WorkDay>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/work_day/user/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Work Day
     * @param workDayId
     * @param requestBody
     * @returns WorkDay Successful Response
     * @throws ApiError
     */
    public updateWorkDayWorkDayOwnPut(
        workDayId: number,
        requestBody: WorkDayUpdate,
    ): Observable<WorkDay> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/work_day/own',
            query: {
                'work_day_id': workDayId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Work Day Own
     * @param requestBody
     * @returns WorkDay Successful Response
     * @throws ApiError
     */
    public createWorkDayOwnWorkDayOwnPost(
        requestBody: WorkDayCreate,
    ): Observable<WorkDay> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/work_day/own',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Work Day
     * @param userId
     * @param date
     * @param requestBody
     * @returns WorkDay Successful Response
     * @throws ApiError
     */
    public createWorkDayWorkDayUserIdPost(
        userId: number,
        date: string,
        requestBody: WorkDayCreate,
    ): Observable<WorkDay> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/work_day/{user_id}',
            path: {
                'user_id': userId,
            },
            query: {
                'date': date,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Cars
     * @param skip
     * @param limit
     * @param filterString
     * @returns Car Successful Response
     * @throws ApiError
     */
    public getCarsCarGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
    ): Observable<Array<Car>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/car/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Car
     * @param carId
     * @returns Car Successful Response
     * @throws ApiError
     */
    public getCarCarCarIdGet(
        carId: number,
    ): Observable<Car> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/car/{car_id}',
            path: {
                'car_id': carId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Eating Places
     * @param skip
     * @param limit
     * @param filterString
     * @returns EatingPlace Successful Response
     * @throws ApiError
     */
    public getEatingPlacesEatingPlaceGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
    ): Observable<Array<EatingPlace>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/eating_place/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Eating Places
     * @param eatingPlaceId
     * @returns EatingPlace Successful Response
     * @throws ApiError
     */
    public getEatingPlacesEatingPlaceEatingPlaceIdGet(
        eatingPlaceId: number,
    ): Observable<EatingPlace> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/eating_place/{eating_place_id}',
            path: {
                'eating_place_id': eatingPlaceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Recalculation
     * @param recalculationId
     * @returns Recalculation Successful Response
     * @throws ApiError
     */
    public readRecalculationRecalculationRecalculationIdGet(
        recalculationId: number,
    ): Observable<Recalculation> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/recalculation/{recalculation_id}',
            path: {
                'recalculation_id': recalculationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Recalculation
     * @param recalculationId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteRecalculationRecalculationRecalculationIdDelete(
        recalculationId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/recalculation/{recalculation_id}',
            path: {
                'recalculation_id': recalculationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Recalculation By Job
     * @param jobId
     * @returns Recalculation Successful Response
     * @throws ApiError
     */
    public readRecalculationByJobRecalculationJobJobIdGet(
        jobId: number,
    ): Observable<Recalculation> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/recalculation/job/{job_id}',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Recalculation
     * @param jobId
     * @param requestBody
     * @returns Recalculation Successful Response
     * @throws ApiError
     */
    public updateRecalculationRecalculationJobIdPut(
        jobId: number,
        requestBody: RecalculationUpdate,
    ): Observable<Recalculation> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/recalculation/{job_id}',
            path: {
                'job_id': jobId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Recalculation
     * @param jobId
     * @param requestBody
     * @returns Recalculation Successful Response
     * @throws ApiError
     */
    public createRecalculationRecalculationJobIdPost(
        jobId: number,
        requestBody: RecalculationCreate,
    ): Observable<Recalculation> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/recalculation/{job_id}',
            path: {
                'job_id': jobId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Recalculation
     * @param recalculationId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockRecalculationRecalculationLockRecalculationIdPost(
        recalculationId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/recalculation/lock/{recalculation_id}',
            path: {
                'recalculation_id': recalculationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unlock Recalculation
     * @param recalculationId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public unlockRecalculationRecalculationUnlockRecalculationIdPost(
        recalculationId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/recalculation/unlock/{recalculation_id}',
            path: {
                'recalculation_id': recalculationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Islocked Recalculation
     * @param recalculationId
     * @returns Lock Successful Response
     * @throws ApiError
     */
    public islockedRecalculationRecalculationIslockedRecalculationIdGet(
        recalculationId: number,
    ): Observable<Lock> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/recalculation/islocked/{recalculation_id}',
            path: {
                'recalculation_id': recalculationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Ordered Articles By Order
     * @param orderId
     * @param skip
     * @param limit
     * @param filterString
     * @param sortPosition
     * @returns OrderedArticle Successful Response
     * @throws ApiError
     */
    public readOrderedArticlesByOrderOrderedArticleOrderOrderIdGet(
        orderId: number,
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        sortPosition: boolean = false,
    ): Observable<Array<OrderedArticle>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/ordered_article/order/{order_id}',
            path: {
                'order_id': orderId,
            },
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'sort_position': sortPosition,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Ordered Article Count By Order
     * @param orderId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readOrderedArticleCountByOrderOrderedArticleOrderOrderIdCountGet(
        orderId: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/ordered_article/order/{order_id}/count',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Ordered Articles By Job
     * @param jobId
     * @param skip
     * @param limit
     * @param filterString
     * @returns OrderedArticle Successful Response
     * @throws ApiError
     */
    public readOrderedArticlesByJobOrderedArticleJobJobIdGet(
        jobId: number,
        skip?: number,
        limit: number = 100,
        filterString: string = '',
    ): Observable<Array<OrderedArticle>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/ordered_article/job/{job_id}',
            path: {
                'job_id': jobId,
            },
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Ordered Article Count By Job
     * @param jobId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readOrderedArticleCountByJobOrderedArticleJobJobIdCountGet(
        jobId: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/ordered_article/job/{job_id}/count',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Ordered Article Price
     * @param requestBody
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public updateOrderedArticlePriceOrderedArticlePricePut(
        requestBody: Array<OrderedArticlePriceUpdate>,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/ordered_article/price',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Ordered Article
     * @param orderedArticleId
     * @returns OrderedArticle Successful Response
     * @throws ApiError
     */
    public readOrderedArticleOrderedArticleOrderedArticleIdGet(
        orderedArticleId: number,
    ): Observable<OrderedArticle> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/ordered_article/{ordered_article_id}',
            path: {
                'ordered_article_id': orderedArticleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Ordered Article
     * @param orderedArticleId
     * @param requestBody
     * @returns OrderedArticle Successful Response
     * @throws ApiError
     */
    public updateOrderedArticleOrderedArticleOrderedArticleIdPut(
        orderedArticleId: number,
        requestBody: OrderedArticleCreate,
    ): Observable<OrderedArticle> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/ordered_article/{ordered_article_id}',
            path: {
                'ordered_article_id': orderedArticleId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Ordered Article
     * @param orderedArticleId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteOrderedArticleOrderedArticleOrderedArticleIdDelete(
        orderedArticleId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/ordered_article/{ordered_article_id}',
            path: {
                'ordered_article_id': orderedArticleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Convert Request
     * @param requestBody
     * @returns OrderedArticle Successful Response
     * @throws ApiError
     */
    public convertRequestOrderedArticleConvertRequestsPost(
        requestBody: Array<number>,
    ): Observable<Array<OrderedArticle>> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/ordered_article/convert_requests',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Fees
     * @param skip
     * @param limit
     * @param filterString
     * @param userId
     * @returns Fee Successful Response
     * @throws ApiError
     */
    public readFeesFeeGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        userId?: number,
    ): Observable<Array<Fee>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/fee/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Fee Count
     * @param userId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readFeeCountFeeCountGet(
        userId?: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/fee/count',
            query: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Fee
     * @param feeId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteFeeFeeFeeIdDelete(
        feeId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/fee{fee_id}',
            path: {
                'fee_id': feeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Meals
     * @param skip
     * @param limit
     * @param filterString
     * @param userId
     * @param eatingPlaceId
     * @returns Meal Successful Response
     * @throws ApiError
     */
    public readMealsMealGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        userId?: number,
        eatingPlaceId?: number,
    ): Observable<Array<Meal>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/meal/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'user_id': userId,
                'eating_place_id': eatingPlaceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Meal Count
     * @param userId
     * @param eatingPlaceId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readMealCountMealCountGet(
        userId?: number,
        eatingPlaceId?: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/meal/count',
            query: {
                'user_id': userId,
                'eating_place_id': eatingPlaceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Meal Sums
     * @param skip
     * @param limit
     * @param filterString
     * @returns MealSum Successful Response
     * @throws ApiError
     */
    public readMealSumsMealSumGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
    ): Observable<Array<MealSum>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/meal/sum',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Meal Sums
     * @returns number Successful Response
     * @throws ApiError
     */
    public readMealSumsMealSumCountGet(): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/meal/sum/count',
        });
    }
    /**
     * Delete Meal
     * @param mealId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteMealMealMealIdDelete(
        mealId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/meal{meal_id}',
            path: {
                'meal_id': mealId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Journeys
     * @param skip
     * @param limit
     * @param filterString
     * @param userId
     * @returns Journey Successful Response
     * @throws ApiError
     */
    public readJourneysJourneyGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        userId?: number,
    ): Observable<Array<Journey>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/journey/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Journey Count
     * @param userId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readJourneyCountJourneyCountGet(
        userId?: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/journey/count',
            query: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Drive Distance By Job
     * @param jobId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readDriveDistanceByJobJourneyDistanceJobIdGet(
        jobId: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/journey/distance/{job_id}',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Journey
     * @param journeyId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteJourneyJourneyJourneyIdDelete(
        journeyId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/journey{journey_id}',
            path: {
                'journey_id': journeyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Workloads
     * @param skip
     * @param limit
     * @param filterString
     * @param userId
     * @param jobId
     * @returns Workload Successful Response
     * @throws ApiError
     */
    public readWorkloadsWorkloadGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        userId?: number,
        jobId?: number,
    ): Observable<Array<Workload>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/workload/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'user_id': userId,
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Workload
     * @param requestBody
     * @returns Workload Successful Response
     * @throws ApiError
     */
    public createWorkloadWorkloadPost(
        requestBody: WorkloadCreate,
    ): Observable<Workload> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/workload/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Workload Count
     * @param userId
     * @param jobId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readWorkloadCountWorkloadCountGet(
        userId?: number,
        jobId?: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/workload/count',
            query: {
                'user_id': userId,
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Workload By User And Job
     * @param userId
     * @param jobId
     * @returns Workload Successful Response
     * @throws ApiError
     */
    public readWorkloadByUserAndJobWorkloadUserJobUserIdJobIdGet(
        userId: number,
        jobId: number,
    ): Observable<Workload> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/workload/user_job/{user_id}/{job_id}',
            path: {
                'user_id': userId,
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Workload
     * @param workloadId
     * @param requestBody
     * @returns Workload Successful Response
     * @throws ApiError
     */
    public updateWorkloadWorkloadWorkloadIdPut(
        workloadId: number,
        requestBody: WorkloadUpdate,
    ): Observable<Workload> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/workload/{workload_id}',
            path: {
                'workload_id': workloadId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Next Delivery Note Number
     * @returns string Successful Response
     * @throws ApiError
     */
    public getNextDeliveryNoteNumberDeliveryNoteNumberGet(): Observable<string> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/delivery_note/number',
        });
    }
    /**
     * Read Delivery Note Count
     * @param jobId
     * @param userId
     * @param year
     * @returns number Successful Response
     * @throws ApiError
     */
    public readDeliveryNoteCountDeliveryNoteCountGet(
        jobId?: number,
        userId?: number,
        year?: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/delivery_note/count',
            query: {
                'job_id': jobId,
                'user_id': userId,
                'year': year,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Delivery Note Reasons
     * @returns DeliveryNoteReason Successful Response
     * @throws ApiError
     */
    public readDeliveryNoteReasonsDeliveryNoteReasonsGet(): Observable<Array<DeliveryNoteReason>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/delivery_note/reasons',
        });
    }
    /**
     * Get Available Years
     * @returns number Successful Response
     * @throws ApiError
     */
    public getAvailableYearsDeliveryNoteAvailableYearsGet(): Observable<Array<number>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/delivery_note/available_years',
        });
    }
    /**
     * Read Delivery Note Reason
     * @param deliveryNoteReasonId
     * @returns DeliveryNoteReason Successful Response
     * @throws ApiError
     */
    public readDeliveryNoteReasonDeliveryNoteReasonDeliveryNoteReasonIdGet(
        deliveryNoteReasonId: number,
    ): Observable<DeliveryNoteReason> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/delivery_note/reason/{delivery_note_reason_id}',
            path: {
                'delivery_note_reason_id': deliveryNoteReasonId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Delivery Note
     * @param deliveryNoteId
     * @returns DeliveryNote Successful Response
     * @throws ApiError
     */
    public readDeliveryNoteDeliveryNoteDeliveryNoteIdGet(
        deliveryNoteId: number,
    ): Observable<DeliveryNote> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/delivery_note/{delivery_note_id}',
            path: {
                'delivery_note_id': deliveryNoteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Delivery Note
     * @param deliveryNoteId
     * @param requestBody
     * @returns DeliveryNote Successful Response
     * @throws ApiError
     */
    public updateDeliveryNoteDeliveryNoteDeliveryNoteIdPut(
        deliveryNoteId: number,
        requestBody: DeliveryNoteUpdate,
    ): Observable<DeliveryNote> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/delivery_note/{delivery_note_id}',
            path: {
                'delivery_note_id': deliveryNoteId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Delivery Note
     * @param deliveryNoteId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteDeliveryNoteDeliveryNoteDeliveryNoteIdDelete(
        deliveryNoteId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/delivery_note/{delivery_note_id}',
            path: {
                'delivery_note_id': deliveryNoteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Delivery Notes
     * @param skip
     * @param limit
     * @param filterString
     * @param jobId
     * @param userId
     * @param year
     * @returns DeliveryNote Successful Response
     * @throws ApiError
     */
    public readDeliveryNotesDeliveryNoteGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        jobId?: number,
        userId?: number,
        year?: number,
    ): Observable<Array<DeliveryNote>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/delivery_note',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'job_id': jobId,
                'user_id': userId,
                'year': year,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Delivery Note
     * @param requestBody
     * @returns DeliveryNote Successful Response
     * @throws ApiError
     */
    public createDeliveryNoteDeliveryNotePost(
        requestBody: DeliveryNoteCreate,
    ): Observable<DeliveryNote> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/delivery_note/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lock Delivery Note
     * @param deliveryNoteId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public lockDeliveryNoteDeliveryNoteLockDeliveryNoteIdPost(
        deliveryNoteId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/delivery_note/lock/{delivery_note_id}',
            path: {
                'delivery_note_id': deliveryNoteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unlock Delivery Note
     * @param deliveryNoteId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public unlockDeliveryNoteDeliveryNoteUnlockDeliveryNoteIdPost(
        deliveryNoteId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/delivery_note/unlock/{delivery_note_id}',
            path: {
                'delivery_note_id': deliveryNoteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Islocked Delivery Note
     * @param deliveryNoteId
     * @returns Lock Successful Response
     * @throws ApiError
     */
    public islockedDeliveryNoteDeliveryNoteIslockedDeliveryNoteIdGet(
        deliveryNoteId: number,
    ): Observable<Lock> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/delivery_note/islocked/{delivery_note_id}',
            path: {
                'delivery_note_id': deliveryNoteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Expenses
     * @param skip
     * @param limit
     * @param filterString
     * @param recalculationId
     * @returns Expense Successful Response
     * @throws ApiError
     */
    public readExpensesExpenseGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        recalculationId?: number,
    ): Observable<Array<Expense>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/expense/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'recalculation_id': recalculationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Expense Count
     * @param recalculationId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readExpenseCountExpenseCountGet(
        recalculationId?: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/expense/count',
            query: {
                'recalculation_id': recalculationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Paints
     * @param skip
     * @param limit
     * @param filterString
     * @param recalculationId
     * @returns Paint Successful Response
     * @throws ApiError
     */
    public readPaintsPaintGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        recalculationId?: number,
    ): Observable<Array<Paint>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/paint/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'recalculation_id': recalculationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Paint Count
     * @param recalculationId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readPaintCountPaintCountGet(
        recalculationId?: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/paint/count',
            query: {
                'recalculation_id': recalculationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Maintenances
     * @param skip
     * @param limit
     * @param filterString
     * @param userId
     * @returns Maintenance Successful Response
     * @throws ApiError
     */
    public readMaintenancesMaintenanceGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        userId?: number,
    ): Observable<Array<Maintenance>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/maintenance/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Maintenance
     * @param requestBody
     * @returns Maintenance Successful Response
     * @throws ApiError
     */
    public createMaintenanceMaintenancePost(
        requestBody: MaintenanceCreate,
    ): Observable<Maintenance> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/maintenance/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Maintenance Count
     * @param userId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readMaintenanceCountMaintenanceCountGet(
        userId?: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/maintenance/count',
            query: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Maintenance
     * @param maintenanceId
     * @returns Maintenance Successful Response
     * @throws ApiError
     */
    public readMaintenanceMaintenanceMaintenanceIdGet(
        maintenanceId: number,
    ): Observable<Array<Maintenance>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/maintenance/{maintenance_id}',
            path: {
                'maintenance_id': maintenanceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Maintenance
     * @param maintenanceId
     * @param requestBody
     * @returns Maintenance Successful Response
     * @throws ApiError
     */
    public updateMaintenanceMaintenanceMaintenanceIdPost(
        maintenanceId: number,
        requestBody: MaintenanceUpdate,
    ): Observable<Maintenance> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/maintenance/{maintenance_id}',
            path: {
                'maintenance_id': maintenanceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Services
     * @param skip
     * @param limit
     * @param filterString
     * @param userId
     * @returns Service Successful Response
     * @throws ApiError
     */
    public readServicesServiceGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        userId?: number,
    ): Observable<Array<Service>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/service/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Service
     * @param requestBody
     * @returns Service Successful Response
     * @throws ApiError
     */
    public createServiceServicePost(
        requestBody: ServiceCreate,
    ): Observable<Service> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/service/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Service Count
     * @param userId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readServiceCountServiceCountGet(
        userId?: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/service/count',
            query: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Service Sums
     * @param skip
     * @param limit
     * @param filterString
     * @returns ServiceSum Successful Response
     * @throws ApiError
     */
    public readServiceSumsServiceSumGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
    ): Observable<Array<ServiceSum>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/service/sum',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Service Sum Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public readServiceSumCountServiceSumCountGet(): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/service/sum/count',
        });
    }
    /**
     * Read Service
     * @param serviceId
     * @returns Service Successful Response
     * @throws ApiError
     */
    public readServiceServiceServiceIdGet(
        serviceId: number,
    ): Observable<Service> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/service/{service_id}',
            path: {
                'service_id': serviceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Service
     * @param serviceId
     * @param requestBody
     * @returns Service Successful Response
     * @throws ApiError
     */
    public updateServiceServiceServiceIdPost(
        serviceId: number,
        requestBody: ServiceUpdate,
    ): Observable<Service> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/service/{service_id}',
            path: {
                'service_id': serviceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Service
     * @param serviceId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteServiceServiceServiceIdDelete(
        serviceId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/service{service_id}',
            path: {
                'service_id': serviceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Additional Workloads
     * @param skip
     * @param limit
     * @param filterString
     * @param userId
     * @returns AdditionalWorkload Successful Response
     * @throws ApiError
     */
    public readAdditionalWorkloadsAdditionalWorkloadGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        userId?: number,
    ): Observable<Array<AdditionalWorkload>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/additional_workload/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Additional Workload Count
     * @param userId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readAdditionalWorkloadCountAdditionalWorkloadCountGet(
        userId?: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/additional_workload/count',
            query: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Additional Workload
     * @param additionalWorkloadId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteAdditionalWorkloadAdditionalWorkloadAdditionalWorkloadIdDelete(
        additionalWorkloadId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/additional_workload/{additional_workload_id}',
            path: {
                'additional_workload_id': additionalWorkloadId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Info Pages
     * @param skip
     * @param limit
     * @returns InfoPage Successful Response
     * @throws ApiError
     */
    public readInfoPagesInfoPageGet(
        skip?: number,
        limit: number = 100,
    ): Observable<Array<InfoPage>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/info_page/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Info Page
     * @param requestBody
     * @returns InfoPage Successful Response
     * @throws ApiError
     */
    public createInfoPageInfoPagePost(
        requestBody: InfoPageCreate,
    ): Observable<InfoPage> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/info_page/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Info Page
     * @param id
     * @returns InfoPage Successful Response
     * @throws ApiError
     */
    public readInfoPageInfoPageIdGet(
        id: number,
    ): Observable<InfoPage> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/info_page/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Info Page
     * @param id
     * @param requestBody
     * @returns InfoPage Successful Response
     * @throws ApiError
     */
    public updateInfoPageInfoPageIdPut(
        id: number,
        requestBody: InfoPageUpdate,
    ): Observable<InfoPage> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/info_page/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Info Page
     * @param id
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteInfoPageInfoPageIdDelete(
        id: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/info_page/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Template Paints
     * @param skip
     * @param limit
     * @returns TemplatePaint Successful Response
     * @throws ApiError
     */
    public readTemplatePaintsTemplatePaintGet(
        skip?: number,
        limit: number = 100,
    ): Observable<Array<TemplatePaint>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/template_paint/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Template Paint
     * @param requestBody
     * @returns TemplatePaint Successful Response
     * @throws ApiError
     */
    public createTemplatePaintTemplatePaintPost(
        requestBody: TemplatePaintCreate,
    ): Observable<TemplatePaint> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/template_paint/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Template Paint Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public readTemplatePaintCountTemplatePaintCountGet(): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/template_paint/count',
        });
    }
    /**
     * Read Template Paint
     * @param templatePaintId
     * @returns TemplatePaint Successful Response
     * @throws ApiError
     */
    public readTemplatePaintTemplatePaintTemplatePaintIdGet(
        templatePaintId: number,
    ): Observable<TemplatePaint> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/template_paint/{template_paint_id}',
            path: {
                'template_paint_id': templatePaintId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Template Paint
     * @param templatePaintId
     * @param requestBody
     * @returns TemplatePaint Successful Response
     * @throws ApiError
     */
    public updateTemplatePaintTemplatePaintTemplatePaintIdPut(
        templatePaintId: number,
        requestBody: TemplatePaintUpdate,
    ): Observable<TemplatePaint> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/template_paint/{template_paint_id}',
            path: {
                'template_paint_id': templatePaintId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Template Paint
     * @param templatePaintId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteTemplatePaintTemplatePaintTemplatePaintIdDelete(
        templatePaintId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/template_paint/{template_paint_id}',
            path: {
                'template_paint_id': templatePaintId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Wood Lists
     * @param skip
     * @param limit
     * @param filterString
     * @param recalculationId
     * @returns WoodList Successful Response
     * @throws ApiError
     */
    public readWoodListsWoodListGet(
        skip?: number,
        limit: number = 100,
        filterString: string = '',
        recalculationId?: number,
    ): Observable<Array<WoodList>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/wood_list/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter_string': filterString,
                'recalculation_id': recalculationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Wood List Count
     * @param recalculationId
     * @returns number Successful Response
     * @throws ApiError
     */
    public readWoodListCountWoodListCountGet(
        recalculationId?: number,
    ): Observable<number> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/wood_list/count',
            query: {
                'recalculation_id': recalculationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Company Event By Date
     * @param date
     * @returns CompanyEvent Successful Response
     * @throws ApiError
     */
    public readCompanyEventByDateCompanyEventGet(
        date: string,
    ): Observable<Array<CompanyEvent>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/company_event/',
            query: {
                'date': date,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Company Event
     * @param requestBody
     * @returns CompanyEvent Successful Response
     * @throws ApiError
     */
    public createCompanyEventCompanyEventPost(
        requestBody: CompanyEventCreate,
    ): Observable<CompanyEvent> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/company_event/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Company Event
     * @param companyEventId
     * @returns CompanyEvent Successful Response
     * @throws ApiError
     */
    public readCompanyEventCompanyEventCompanyEventIdGet(
        companyEventId: number,
    ): Observable<CompanyEvent> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/company_event{company_event_id}',
            path: {
                'company_event_id': companyEventId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Company Event
     * @param companyEventId
     * @param requestBody
     * @returns CompanyEvent Successful Response
     * @throws ApiError
     */
    public updateCompanyEventCompanyEventCompanyEventIdPut(
        companyEventId: number,
        requestBody: CompanyEventUpdate,
    ): Observable<CompanyEvent> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/company_event/{company_event_id}',
            path: {
                'company_event_id': companyEventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Company Event
     * @param companyEventId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public deleteCompanyEventCompanyEventCompanyEventIdDelete(
        companyEventId: number,
    ): Observable<boolean> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/company_event/{company_event_id}',
            path: {
                'company_event_id': companyEventId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Generate Pdfs
     * @returns any Successful Response
     * @throws ApiError
     */
    public generatePdfsTestGeneratePdfsPost(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/test/generate_pdfs',
        });
    }
    /**
     * Test Pdf
     * @returns any Successful Response
     * @throws ApiError
     */
    public testPdfTestTestPdfPost(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/test/test_pdf',
        });
    }
    /**
     * Import Json
     * @returns any Successful Response
     * @throws ApiError
     */
    public importJsonTestImportJsonPost(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/test/import_json',
        });
    }
    /**
     * Test Smb Share
     * @returns any Successful Response
     * @throws ApiError
     */
    public testSmbShareTestTestSmbSharePost(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/test/test_smb_share',
        });
    }
    /**
     * Root
     * @returns string Successful Response
     * @throws ApiError
     */
    public rootGet(): Observable<Record<string, string>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/',
        });
    }
    /**
     * Reset Kalle Passwd
     * @returns any Successful Response
     * @throws ApiError
     */
    public resetKallePasswdResetKallePasswdGet(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/reset_kalle_passwd',
        });
    }
    /**
     * Test Notification
     * @returns any Successful Response
     * @throws ApiError
     */
    public testNotificationTestNotificationPost(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/test_notification',
        });
    }
    /**
     * Export Contacts
     * @returns any Successful Response
     * @throws ApiError
     */
    public exportContactsExportContactsPost(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/export_contacts',
        });
    }
    /**
     * Test
     * @returns any Successful Response
     * @throws ApiError
     */
    public testTestOfferGet(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/test_offer',
        });
    }
}
