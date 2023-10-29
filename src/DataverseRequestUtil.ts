/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module DataverseRequestUtil
 */
import { DATAVERSE_URLS } from "./Constants";
import { DataverseClientError } from "./DataverseClientError";
/**
 * To hold list of OData query params
 */
export const oDataQueryNames = ["$select", "$expand", "$orderby", "$filter", "$top", "$skip", "$skipToken", "$count"];

/**
 * To construct the URL by appending the segments with "/"
 * @param {string[]} urlSegments - The array of strings
 * @returns The constructed URL string
 */
export const urlJoin = (urlSegments: string[]): string => {
	const removePostSlash = (s) => s.replace(/\/+$/, "");
	const removePreSlash = (s) => s.replace(/^\/+/, "");
	const joiner = (pre, cur) => [removePostSlash(pre), removePreSlash(cur)].join("/");
	const parts = Array.prototype.slice.call(urlSegments);
	return parts.reduce(joiner);
};

/**
 * Serializes the content
 * @param {any} content - The content value that needs to be serialized
 * @returns The serialized content
 *
 * Note:
 * This conversion is required due to the following reasons:
 * Body parameter of Request method of isomorphic-fetch only accepts Blob, ArrayBuffer, FormData, TypedArrays string.
 * Node.js platform does not support Blob, FormData. Javascript File object inherits from Blob so it is also not supported in node. Therefore content of type Blob, File, FormData will only come from browsers.
 * Parallel to ArrayBuffer in javascript, node provides Buffer interface. Node's Buffer is able to send the arbitrary binary data to the server successfully for both Browser and Node platform. Whereas sending binary data via ArrayBuffer or TypedArrays was only possible using Browser. To support both Node and Browser, `serializeContent` converts TypedArrays or ArrayBuffer to `Node Buffer`.
 * If the data received is in JSON format, `serializeContent` converts the JSON to string.
 */

export const serializeContent = (content: any): any => {
	const className: string = content && content.constructor && content.constructor.name;
	if (className === "Buffer" || className === "Blob" || className === "File" || className === "FormData" || typeof content === "string") {
		return content;
	}
	if (className === "ArrayBuffer") {
		content = Buffer.from(content);
	} else if (className === "Int8Array" || className === "Int16Array" || className === "Int32Array" || className === "Uint8Array" || className === "Uint16Array" || className === "Uint32Array" || className === "Uint8ClampedArray" || className === "Float32Array" || className === "Float64Array" || className === "DataView") {
		content = Buffer.from(content.buffer);
	} else {
		try {
			content = JSON.stringify(content);
		} catch (error) {
			throw new Error("Unable to stringify the content");
		}
	}
	return content;
};

/**
 * Checks if the url is one of the service root endpoints for Microsoft Dataverse and Dataverse Explorer.
 * @param {string} url - The url to be verified
 * @returns {boolean} - Returns true if the url is a Dataverse URL
 */
export const isDataverseURL = (url: string): boolean => {
	return isValidEndpoint(url);
};

/**
 * Checks if the url is for one of the custom hosts provided during client initialization
 * @param {string} url - The url to be verified
 * @param {Set} customHosts - The url to be verified
 * @returns {boolean} - Returns true if the url is a for a custom host
 */
export const isCustomHost = (url: string, customHosts: Set<string>): boolean => {
	customHosts.forEach((host) => isCustomHostValid(host));
	return isValidEndpoint(url, customHosts);
};

/**
 * Determines whether a given hostname is allowed based on a set of allowed hosts.
 * @param {string} hostName - The hostname to check.
 * @param {Set<string>} allowedHosts - The set of allowed hosts.
 * @returns {boolean} True if the hostname is allowed, false otherwise.
 */
const isHostNameAllowed = (hostName: string, allowedHosts: Set<string>): boolean => {
	const allowedHostsArray = Array.from(allowedHosts);
	return allowedHostsArray.some((allowedHost) => hostName.endsWith(allowedHost));
};

/**
 * Checks if the url is for one of the provided hosts.
 * @param {string} url - The url to be verified
 * @param {Set<string>} allowedHosts - A set of hosts.
 * @returns {boolean} - Returns true is for one of the provided endpoints.
 */
const isValidEndpoint = (url: string, allowedHosts: Set<string> = DATAVERSE_URLS): boolean => {
	// Valid Dataverse URL pattern - https://graph.microsoft.com/{version}/{resource}?{query-parameters}
	// Valid Dataverse URL example - https://graph.microsoft.com/v1.0/
	url = url.toLowerCase();

	if (url.indexOf("https://") !== -1) {
		url = url.replace("https://", "");

		// Find where the host ends
		const startofPortNoPos = url.indexOf(":");
		const endOfHostStrPos = url.indexOf("/");
		let hostName = "";
        let hostNameAllowed = false;
		if (endOfHostStrPos !== -1) {
			if (startofPortNoPos !== -1 && startofPortNoPos < endOfHostStrPos) {
				hostName = url.substring(0, startofPortNoPos);
                hostNameAllowed = isHostNameAllowed(hostName, allowedHosts);

                return hostNameAllowed;
			}

			// Parse out the host
			hostName = url.substring(0, endOfHostStrPos);
            hostNameAllowed = isHostNameAllowed(hostName, allowedHosts);

            return hostNameAllowed;
		}
	}

	return false;
};

/**
 * Throws error if the string is not a valid host/hostname and contains other url parts.
 * @param {string} host - The host to be verified
 */
const isCustomHostValid = (host: string) => {
	if (host.indexOf("/") !== -1) {
		throw new DataverseClientError("Please add only hosts or hostnames to the CustomHosts config. If the url is `http://example.com:3000/`, host is `example:3000`");
	}
};
