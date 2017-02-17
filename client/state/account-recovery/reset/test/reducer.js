/**
 * External dependencies
 */
import { assert } from 'chai';

/**
 * Internal dependencies
 */
import {
	ACCOUNT_RECOVERY_RESET_UPDATE_USER_DATA,
	ACCOUNT_RECOVERY_RESET_OPTIONS_ERROR,
	ACCOUNT_RECOVERY_RESET_OPTIONS_RECEIVE,
	ACCOUNT_RECOVERY_RESET_OPTIONS_REQUEST,
} from 'state/action-types';

import reducer from '../reducer';

describe( '#account-recovery/reset reducer', () => {
	it( 'ACCOUNT_RECOVERY_RESET_OPTIONS_REQUEST action should set isRequesting flag.', () => {
		const state = reducer( undefined, {
			type: ACCOUNT_RECOVERY_RESET_OPTIONS_REQUEST
		} );

		assert.isTrue( state.options.isRequesting );
	} );

	const requestingState = {
		options: {
			isRequesting: true,
		},
	};

	it( 'ACCOUNT_RECOVERY_RESET_OPTIONS_RECEIVE action should unset isRequesting flag.', () => {
		const state = reducer( requestingState, {
			type: ACCOUNT_RECOVERY_RESET_OPTIONS_RECEIVE,
		} );

		assert.isFalse( state.options.isRequesting );
	} );

	it( 'ACCOUNT_RECOVERY_RESET_OPTIONS_ERROR action should unset isRequesting flag.', () => {
		const state = reducer( requestingState, {
			type: ACCOUNT_RECOVERY_RESET_OPTIONS_ERROR,
		} );

		assert.isFalse( state.options.isRequesting );
	} );

	it( 'ACCOUNT_RECOVERY_RESET_OPTIONS_RECEIVE action should populate the items field.', () => {
		const fetchedOptions = [
			{
				email: 'primary@example.com',
				sms: '123456789',
				name: 'primary',
			},
			{
				email: 'secondary@example.com',
				sms: '123456789',
				name: 'secondary',
			},
		];
		const state = reducer( undefined, {
			type: ACCOUNT_RECOVERY_RESET_OPTIONS_RECEIVE,
			items: fetchedOptions,
		} );

		assert.deepEqual( state.options.items, fetchedOptions );
	} );

	it( 'ACCOUNT_RECOVERY_RESET_OPTIONS_ERROR action should populate the error field.', () => {
		const fetchError = {
			status: 400,
			message: 'Something wrong!',
		};

		const state = reducer( undefined, {
			type: ACCOUNT_RECOVERY_RESET_OPTIONS_ERROR,
			error: fetchError,
		} );

		assert.deepEqual( state.options.error, fetchError );
	} );

	it( 'ACCOUNT_RECOVERY_RESET_UPDATE_USER_DATA action should populate the user field.', () => {
		const state = reducer( undefined, {
			type: ACCOUNT_RECOVERY_RESET_UPDATE_USER_DATA,
			field: 'user',
			value: 'userlogin',
		} );

		assert.equal( state.userData.user, 'userlogin' );
	} );

	it( 'ACCOUNT_RECOVERY_RESET_UPDATE_USER_DATA action should populate the firstname field.', () => {
		const state = reducer( undefined, {
			type: ACCOUNT_RECOVERY_RESET_UPDATE_USER_DATA,
			field: 'firstName',
			value: 'Foo',
		} );

		assert.equal( state.userData.firstName, 'Foo' );
	} );

	it( 'ACCOUNT_RECOVERY_RESET_UPDATE_USER_DATA action should populate the lastname field.', () => {
		const state = reducer( undefined, {
			type: ACCOUNT_RECOVERY_RESET_UPDATE_USER_DATA,
			field: 'lastName',
			value: 'Bar',
		} );

		assert.equal( state.userData.lastName, 'Bar' );
	} );

	it( 'ACCOUNT_RECOVERY_RESET_UPDATE_USER_DATA action should populate the url field.', () => {
		const state = reducer( undefined, {
			type: ACCOUNT_RECOVERY_RESET_UPDATE_USER_DATA,
			field: 'url',
			value: 'examples.com',
		} );

		assert.equal( state.userData.url, 'examples.com' );
	} );

	it( 'ACCOUNT_RECOVERY_RESET_UPDATE_USER_DATA action should not populate any unexpected field.', () => {
		const state = reducer( undefined, {
			type: ACCOUNT_RECOVERY_RESET_UPDATE_USER_DATA,
			field: 'unexpected',
			value: 'random-value',
		} );

		assert.deepEqual( state.userData, {
			user: '',
			firstName: '',
			lastName: '',
			url: '',
		} );
	} );
} );
