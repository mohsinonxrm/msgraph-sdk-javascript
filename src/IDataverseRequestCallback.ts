/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { DataverseError } from "./DataverseError";
/**
 * @interface
 * Signature to define the DataverseRequest callback
 * @callback - The anonymous callback function
 */
export type DataverseRequestCallback = (error: DataverseError, response: any, rawResponse?: any) => void;
