/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module Constants
 */

/**
 * @constant
 * A Default API endpoint version for a request
 */
export const DATAVERSE_API_VERSION = "v9.2";

/**
 * @constant
 * A Default base url for a request
 */
export const DATAVERSE_BASE_URL = "https://orgfd805dbd.api.crm.dynamics.com/";

/**
 * To hold list of the service root endpoints for Microsoft Graph and Graph Explorer for each national cloud.
 * Set(iterable:Object) is not supported in Internet Explorer. The consumer is recommended to use a suitable polyfill.
 */
export const DATAVERSE_URLS = new Set<string>(["graph.microsoft.com", "graph.microsoft.us", "dod-graph.microsoft.us", "graph.microsoft.de", "microsoftgraph.chinacloudapi.cn", "canary.graph.microsoft.com"]);
