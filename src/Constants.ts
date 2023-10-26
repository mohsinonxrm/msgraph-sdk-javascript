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
export const DATAVERSE_BASE_URL = "https://orgfd805dbd.api.crm.dynamics.com/api/data/";

/**
 * To hold list of the service root endpoints for Microsoft Graph and Graph Explorer for each national cloud.
 * Set(iterable:Object) is not supported in Internet Explorer. The consumer is recommended to use a suitable polyfill.
 */
export const DATAVERSE_URLS = new Set<string>(["crm.dynamics.com", "crm2.dynamics.com", "crm3.dynamics.com", "crm4.dynamics.com", "crm5.dynamics.com", "crm6.dynamics.com","crm7.dynamics.com","crm7.dynamics.com","crm9.dynamics.com","crm11.dynamics.com","crm12.dynamics.com","crm14.dynamics.com","crm15.dynamics.com","crm16.dynamics.com","crm17.dynamics.com","crm19.dynamics.com","crm20.dynamics.com","crm21.dynamics.com","crm.microsoftdynamics.de","crm.microsoftdynamics.us","crm.dynamics.cn"]);
