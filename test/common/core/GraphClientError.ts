/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert } from "chai";

import { DataverseClientError } from "../../../src/DataverseClientError";

describe("DataverseClientError", () => {
	const message = "test";
	const name = "test_name";
	it("Should return DataverseClientError error with message set", () => {
		const gError = new DataverseClientError(message);
		assert.equal(gError.message, message);
	});

	it("Should return DataverseClientError when Error object is passed", () => {
		const errorParameter = new Error(message);
		errorParameter.name = name;
		const gError = DataverseClientError.setDataverseClientError(errorParameter);
		assert.equal(gError.message, message);
		assert.equal(gError.name, name);
	});

	it("Should return DataverseClientError when custom error object is passed", () => {
		const customErrorParameter = { errorName: name, errorMessage: message };
		const gError = DataverseClientError.setDataverseClientError(customErrorParameter);
		assert.isDefined(gError.customError);
		assert.equal(gError.customError, customErrorParameter);
	});
});
