/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module DataverseErrorHandler
 */

import { DataverseError } from "./DataverseError";
import { DataverseRequestCallback } from "./IDataverseRequestCallback";

/**
 * @interface
 * Signature for the json represent of the error response from the Dataverse API
 * https://docs.microsoft.com/en-us/graph/errors
 * @property {[key: string] : string | number} - The Key value pair
 */
interface DataverseAPIErrorResponse {
	error: {
		code: string;
		message: string;
		innerError: any;
	};
}

/**
 * @class
 * Class for DataverseErrorHandler
 */

export class DataverseErrorHandler {
	/**
	 * @private
	 * @static
	 * Populates the DataverseError instance with Error instance values
	 * @param {Error} error - The error returned by dataverse service or some native error
	 * @param {number} [statusCode] - The status code of the response
	 * @returns The DataverseError instance
	 */
	private static constructError(error: Error, statusCode?: number, rawResponse?: Response): DataverseError {
		const gError = new DataverseError(statusCode, "", error);
		if (error.name !== undefined) {
			gError.code = error.name;
		}
		gError.body = error.toString();
		gError.date = new Date();
		gError.headers = rawResponse?.headers;
		return gError;
	}

	/**
	 * @private
	 * @static
	 * @async
	 * Populates the DataverseError instance from the Error returned by dataverse service
	 * @param {DataverseAPIErrorResponse} dataverseError - The error possibly returned by dataverse service or some native error
	 * @param {number} statusCode - The status code of the response
	 * @returns A promise that resolves to DataverseError instance
	 *
	 * Example error for https://graph.microsoft.com/v1.0/me/events?$top=3&$search=foo
	 * {
	 *      "error": {
	 *          "code": "SearchEvents",
	 *          "message": "The parameter $search is not currently supported on the Events resource.",
	 *          "innerError": {
	 *              "request-id": "b31c83fd-944c-4663-aa50-5d9ceb367e19",
	 *              "date": "2016-11-17T18:37:45"
	 *          }
	 *      }
	 *  }
	 */
	private static constructErrorFromResponse(dataverseError: DataverseAPIErrorResponse, statusCode: number, rawResponse?: Response): DataverseError {
		const error = dataverseError.error;
		const gError = new DataverseError(statusCode, error.message);
		gError.code = error.code;
		if (error.innerError !== undefined) {
			gError.requestId = error.innerError["request-id"];
			gError.date = new Date(error.innerError.date);
		}

		gError.body = JSON.stringify(error);
		gError.headers = rawResponse?.headers;

		return gError;
	}

	/**
	 * @public
	 * @static
	 * @async
	 * To get the DataverseError object
	 * Reference - https://docs.microsoft.com/en-us/graph/errors
	 * @param {any} [error = null] - The error returned by dataverse service or some native error
	 * @param {number} [statusCode = -1] - The status code of the response
	 * @param {DataverseRequestCallback} [callback] - The dataverse request callback function
	 * @returns A promise that resolves to DataverseError instance
	 */
	public static async getError(error: any = null, statusCode = -1, callback?: DataverseRequestCallback, rawResponse?: Response): Promise<DataverseError> {
		let gError: DataverseError;
		if (error && error.error) {
			gError = DataverseErrorHandler.constructErrorFromResponse(error, statusCode, rawResponse);
		} else if (error instanceof Error) {
			gError = DataverseErrorHandler.constructError(error, statusCode, rawResponse);
		} else {
			gError = new DataverseError(statusCode);
			gError.body = error; // if a custom error is passed which is not instance of Error object or a dataverse API response
		}
		if (typeof callback === "function") {
			callback(gError, null);
		} else {
			return gError;
		}
	}
}
