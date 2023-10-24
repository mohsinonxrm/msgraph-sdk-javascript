/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module DataverseClientError
 */

/**
 * @class
 * Create DataverseClientError object to handle client-side errors
 * encountered within the JavaScript Client SDK.
 * Whereas DataverseError Class should be used to handle errors in the response from the Dataverse API.
 */

export class DataverseClientError extends Error {
	/**
	 * @public
	 * A custom error. This property should set be when the error is not of instanceOf Error/DataverseClientError.
	 * Example =
	 * const client = MicrosoftDataverse.Client.init({
	 * 		defaultVersion: "v1.0",
	 *  	authProvider: (done) => { done({TokenError:"AccessToken cannot be null"}, "<ACCESS_TOKEN>");
	 * });
	 */
	public customError?: any;

	/**
	 * @public
	 * @static
	 * @async
	 * To set the DataverseClientError object
	 * @param {any} error - The error returned encountered by the Dataverse JavaScript Client SDK while processing request
	 * @returns DataverseClientError object set to the error passed
	 */
	public static setDataverseClientError(error: any): DataverseClientError {
		let dataverseClientError: DataverseClientError;
		if (error instanceof Error) {
			dataverseClientError = error;
		} else {
			dataverseClientError = new DataverseClientError();
			dataverseClientError.customError = error;
		}
		return dataverseClientError;
	}

	/**
	 * @public
	 * @constructor
	 * Creates an instance of DataverseClientError
	 * @param {string} message? - Error message
	 * @returns An instance of DataverseClientError
	 */
	public constructor(message?: string) {
		super(message);
		Object.setPrototypeOf(this, DataverseClientError.prototype);
	}
}
