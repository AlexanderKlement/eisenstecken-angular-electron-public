/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SchedulerService {
    /**
     * Refresh Statistics By League
     * @returns any Successful Response
     * @throws ApiError
     */
    public static refreshStatisticsByLeagueSchedulerRefreshStatisticsByLeagueGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduler/refresh_statistics_by_league',
        });
    }
    /**
     * Refresh Squads By Team
     * @returns any Successful Response
     * @throws ApiError
     */
    public static refreshSquadsByTeamSchedulerRefreshSquadsByTeamGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduler/refresh_squads_by_team',
        });
    }
    /**
     * Refresh Squad Statistics By Team
     * @returns any Successful Response
     * @throws ApiError
     */
    public static refreshSquadStatisticsByTeamSchedulerRefreshSquadStatisticsByTeamGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduler/refresh_squad_statistics_by_team',
        });
    }
    /**
     * Add Missing Team Of The Week
     * @returns any Successful Response
     * @throws ApiError
     */
    public static addMissingTeamOfTheWeekSchedulerAddMissingTeamOfTheWeekGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduler/add_missing_team_of_the_week',
        });
    }
    /**
     * Refresh Player Statistics By Match
     * @returns any Successful Response
     * @throws ApiError
     */
    public static refreshPlayerStatisticsByMatchSchedulerRefreshPlayerStatisticsByMatchGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduler/refresh_player_statistics_by_match',
        });
    }
    /**
     * Refresh All Team Of The Weeks
     * @returns any Successful Response
     * @throws ApiError
     */
    public static refreshAllTeamOfTheWeeksSchedulerRefreshAllTeamOfTheWeeksGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduler/refresh_all_team_of_the_weeks',
        });
    }
    /**
     * Delete Wrong Standings
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteWrongStandingsSchedulerDeleteWrongStandingsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduler/delete_wrong_standings',
        });
    }
    /**
     * Check Match End
     * @returns any Successful Response
     * @throws ApiError
     */
    public static checkMatchEndSchedulerCheckMatchEndGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduler/check_match_end',
        });
    }
    /**
     * Refresh Standings For Current Match Day
     * @returns any Successful Response
     * @throws ApiError
     */
    public static refreshStandingsForCurrentMatchDaySchedulerRefreshStandingsForCurrentMatchDayGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduler/refresh_standings_for_current_match_day',
        });
    }
    /**
     * Get Sportnews Bz Blogs
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getSportnewsBzBlogsSchedulerGetSportnewsBzBlogsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduler/get_sportnews_bz_blogs',
        });
    }
    /**
     * Get Communicati Figc Bz
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCommunicatiFigcBzSchedulerGetCommunicatiFigcBzGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduler/get_communicati_figc_bz',
        });
    }
    /**
     * Get Communicati Figc Bz
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCommunicatiFigcBzSchedulerGetCommunicatiFigcTnGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduler/get_communicati_figc_tn',
        });
    }
    /**
     * Award Insider Badges
     * @returns any Successful Response
     * @throws ApiError
     */
    public static awardInsiderBadgesSchedulerAwardInsiderBadgesGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduler/award_insider_badges',
        });
    }
    /**
     * Award Team Of The Week Badges
     * @returns any Successful Response
     * @throws ApiError
     */
    public static awardTeamOfTheWeekBadgesSchedulerAwardTeamOfTheWeekBadgesGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduler/award_team_of_the_week_badges',
        });
    }
    /**
     * Update Hockey Scores
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateHockeyScoresSchedulerUpdateHockeyScoresGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scheduler/update_hockey_scores',
        });
    }
}
