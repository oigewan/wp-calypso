/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import { identity } from 'lodash';

/**
 * Internal dependencies
 */
import StepWrapper from 'signup/step-wrapper';
import signupUtils from 'signup/utils';
import SignupActions from 'lib/signup/actions';
import { getSuggestedUsername } from 'state/signup/optional-dependencies/selectors';

import { recordTracksEvent } from 'state/analytics/actions';

export class SocialStep extends Component {
	static propTypes = {
		flowName: PropTypes.string,
		translate: PropTypes.func,
		subHeaderText: PropTypes.string,
	};

	static defaultProps = {
		translate: identity,
		suggestedUsername: identity
	};

	state = {
		submitting: false,
		subHeaderText: '',
	};

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.step && 'invalid' === nextProps.step.status ) {
			this.setState( { submitting: false } );
		}

		if ( this.props.flowName !== nextProps.flowName || this.props.subHeaderText !== nextProps.subHeaderText ) {
			this.setSubHeaderText( nextProps );
		}
	}

	componentWillMount() {
		this.setSubHeaderText( this.props );
	}

	setSubHeaderText( props ) {
		let subHeaderText = props.subHeaderText;

		/**
		 * Update the step sub-header if they only want to create an account, without a site.
		 */
		if (
			1 === signupUtils.getFlowSteps( props.flowName ).length &&
			'userfirst' !== props.flowName
		) {
			subHeaderText = this.props.translate( 'Welcome to the wonderful WordPress.com community' );
		}

		this.setState( { subHeaderText: subHeaderText } );
	}

	save = ( form ) => {
		SignupActions.saveSignupStep( {
			stepName: this.props.stepName,
			form: form
		} );
	};

	submitForm = ( event ) => {
		event.preventDefault();

		SignupActions.submitSignupStep( {
			stepName: this.props.stepName,
			code: this.state.code
		} );

		//this.props.goToNextStep();
	}

	userCreationComplete() {
		return this.props.step && 'completed' === this.props.step.status;
	}

	userCreationPending() {
		return this.props.step && 'pending' === this.props.step.status;
	}

	userCreationStarted() {
		return this.userCreationPending() || this.userCreationComplete();
	}

	getRedirectToAfterLoginUrl() {
		const stepAfterRedirect = signupUtils.getNextStepName( this.props.flowName, this.props.stepName ) ||
			signupUtils.getPreviousStepName( this.props.flowName, this.props.stepName );
		return this.originUrl() + signupUtils.getStepUrl(
				this.props.flowName,
				stepAfterRedirect
			);
	}

	originUrl() {
		return window.location.protocol + '//' + window.location.hostname +
			( window.location.port ? ':' + window.location.port : '' );
	}

	submitButtonText() {
		const { translate } = this.props;

		if ( this.userCreationPending() ) {
			return translate( 'Creating Your Account…' );
		}

		if ( this.userCreationComplete() ) {
			return translate( 'Account created - Go to next step' );
		}

		return translate( 'Create My Account' );
	}

	changeCode = ( event ) => {
		this.setState( {
			code: event.target.value
		} );
	};

	codeField() {
		return (
			<input type="text" name="code" onChange={ this.changeCode } />
		);
	}

	renderSignupForm() {
		return (
			<div>
				<form onSubmit={ this.submitForm }>
					{ this.codeField() }
				</form>
			</div>
		);
	}

	render() {
		return (
			<StepWrapper
				flowName={ this.props.flowName }
				stepName={ this.props.stepName }
				headerText="Verify your email address"
				subHeaderText="Enter the code sent to your email address"
				positionInFlow={ this.props.positionInFlow }
				fallbackHeaderText={ this.props.translate( 'Create your account.' ) }
				signupProgress={ this.props.signupProgress }
				stepContent={ this.renderSignupForm() }
			/>
		);
	}
}

export default connect(
	( state ) => ( {
		suggestedUsername: getSuggestedUsername( state )
	} ),
	{
		recordTracksEvent
	}
)( localize( SocialStep ) );