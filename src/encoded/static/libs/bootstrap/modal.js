'use strict';
var React = require('react');
var cloneWithProps = require('react/lib/cloneWithProps');


// Display a modal dialog box that blocks all other page input until the user dismisses it. The
// typical format looks like:
//
// <Modal actuator={JSX component to actuate the modal}>
//     <ModalHeader>
//         <content in addition to title and close button>
//     </ModalHeader>
//     <ModalBody>
//         <content of modal dialog body>
//     </ModalBody>
//     <ModalFooter>
//         <content of modal footer>
//     </ModalFooter>
// </Modal>
//
// Generally you place this anywhere you want to see the actuator rendered. When you click the
// actuator (often a button), the modal appears, e.g.:
//
// <div>
//     <Modal actuator={<button className="btn btn-info">Open Modal</button>}>
//         ...
//
// The resulting HTML becomes:
//
// <div>
//     <button class="btn btn-info">Open Modal</button>
//         ...
//
// <Modal> usage details:
// actuator: Component that opens the modal. You don't normally need a click handler for this
//           component because <Modal> attaches a default click handler that simply opens the
//           modal. If you handle the visibility of the modal yourself, `actuator` isn't needed.
// closeModal: Function to close the modal if `actuator` isn't provided. Use this when you handle
//             the visibility of the modal yourself. Providing this to the <Modal> component simply
//             allows the ESC key to close the modal without an `actuator` component.
//
// <ModalHeader> usage details:
// title: Title to display in the header. You can pass this as a string or a React component (e.g.
//        a link within the title string).
// closeModal: As a boolean, this displays the standard close button in the header with the
//             standard close handler. You can also pass a function to use as a click handler on
//             this button to close the modal if you handle the visibility of the modal yourself.
//
// <ModalBody> takes no properties.
//
// <ModalFooter> usage details:
// submitBtn: Pass a React component to render as the submit button. You can also supply a function
//            that gets used as a click handler for a standard Submit button.
// closeBtn: Pass True to get a standard "Cancel" button that simply closes the modal. You can also
//           pass a function that gets used as the click handler for the standard cancel button
//           that gets called before closing the modal. Finally, you can pass a React component
//           that handles the closing of the modal if you handle modal visibility yourself.
//
// The method of rendering the modal to a div appended to <body> rather than into the React virtual
// DOM comes from: http://jamesknelson.com/rendering-react-components-to-the-document-body/


var Modal = module.exports.Modal = React.createClass({
    propTypes: {
        actuator: React.PropTypes.object, // Component (usually a button) that makes the modal appear
        closeModal: React.PropTypes.func // Called to close the modal if an actuator isn't provided
    },

    getInitialState: function () {
        return {
            modalOpen: false // True if modal is visible. Ignored if no actuator given
        };
    },

    componentDidMount: function () {
        // Modal HTML gets injected at the end of <body> so the backdrop overlay works, even with other
        // fixed elements on the page.
        this.modalEl = document.createElement('div');
        document.body.appendChild(this.modalEl);
        this.renderModal();

        // Have ESC key press close the modal.
        document.addEventListener('keydown', this.handleEsc, false);
    },

    componentWillUnmount: function () {
        React.unmountComponentAtNode(this.modalEl);
        document.body.removeChild(this.modalEl);
        document.removeEventListener('keydown', this.handleEsc, false);
    },

    componentDidUpdate: function () {
        this.renderModal();
    },

    // Called when the user presses the ESC key.
    handleEsc: function (e) {
        if ((!this.props.actuator || this.state.modalOpen) && e.keyCode === 27) {
            if (this.props.closeModal) {
                this.props.closeModal();
            } else {
                this.closeModal();
            }
        }
    },

    // Open the modal
    openModal: function () {
        this.setState({ modalOpen: true });

        // Add class to body element to make modal-backdrop div visible
        document.body.classList.add('modal-open');
    },

    // Default function to close the modal without doing anything.
    closeModal: function () {
        this.setState({ modalOpen: false });

        // Remove class from body element to make modal-backdrop div visible
        document.body.classList.remove('modal-open');
    },

    // Render the modal JSX into the element this component appended to the <body> element. that
    // lets us properly render the fixed-position backdrop so that it overlays the fixed-position
    // navigation bar.
    renderModal: function () {
        React.render(
            <div>
                {!this.props.actuator || this.state.modalOpen ?
                    <div>
                        <div className="modal" style={{ display: "block" }}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    {this.modalChildren}
                                </div>
                            </div>
                        </div>
                        <div className="modal-backdrop in"></div>
                    </div>
                    : null}
            </div>,
            this.modalEl
        );
    },

    render: function () {
        // We don't require/allow a click handler for the actuator, so we attach the one from
        // ModalMixin here. You can't add attributes to an existing component in React, but React
        // has no issue adding attributes while cloning a component.
        let actuator = this.props.actuator ? cloneWithProps(this.props.actuator, { onClick: this.openModal }) : null;

        // Pass important Modal states and functions to child objects without the parent component
        // needing to do it explicitly.
        this.modalChildren = React.Children.map(this.props.children, child => {
            if (child.type === ModalHeader.type || child.type === ModalBody.type || child.type === ModalFooter.type) {
                return cloneWithProps(child, { _closeModal: this.closeModal, _modalOpen: this.state.modalOpen });
            }
            return child;
        });

        return actuator ? <span>{actuator}</span> : null;
    }
});


var ModalHeader = module.exports.ModalHeader = React.createClass({
    propTypes: {
        title: React.PropTypes.oneOfType([
            React.PropTypes.string, // String to display as an <h4> title
            React.PropTypes.object // React component to display for the title 
        ]),
        closeModal: React.PropTypes.oneOfType([
            React.PropTypes.bool, // True to display the close button in the header with the built-in handler
            React.PropTypes.func // If not using an actuator on <Modal>, provide a function to close the modal
        ])
    },

    closeModal: function () {
        // Call close button's existing close handler if it had one first. 
        if (this.chainedCloseModal) {
            this.chainedCloseModal();
        }

        // Now call the standard close handler.
        this.props._closeModal();
    },

    render: function () {
        let {title, closeModal} = this.props;
        let titleRender = null;

        // Handle the string and React component cases for the title
        if (title) {
            titleRender = typeof title === 'string' ? <h4>{title}</h4> : <div>{title}</div>;
        }

        // Chain in the given closeBtn function if given
        if (typeof closeModal === 'function') {
            this.chainedCloseModal = closeModal;
        }

        return (
            <div className="modal-header">
                {closeModal ? <button type="button" className="close" aria-label="Close" onClick={this.closeModal}><span aria-hidden="true">&times;</span></button> : null}
                {titleRender ? <div>{titleRender}</div> : null}
                {this.props.children}
            </div>
        );
    }
});


var ModalBody = module.exports.ModalBody = React.createClass({
    render: function () {
        return (
            <div className="modal-body">
                {this.props.children}
            </div>
        );
    }
});


var ModalFooter = module.exports.ModalFooter = React.createClass({
    propTypes: {
        submitBtn: React.PropTypes.oneOfType([
            React.PropTypes.object, // Submit button is a React component; just render it
            React.PropTypes.func // Function to call when default-rendered Submit button clicked
        ]),
        closeModal: React.PropTypes.oneOfType([
            React.PropTypes.bool, // Use default-rendered Cancel button that closes the modal
            React.PropTypes.object, // Cancel button is a React component; just render it
            React.PropTypes.func // Function to call when default-rendered Cancel button clicked
        ]),
        dontClose: React.PropTypes.bool // True to *not* close the modal when the user clicks Submit
    },

    closeModal: function () {
        // Call close button's existing close handler if it had one first. 
        if (this.chainedCloseModal) {
            this.chainedCloseModal();
        }

        // Now call the standard close handler.
        this.props._closeModal();
    },

    submitModal: function () {
        let {submitBtn, dontClose, closeModal} = this.props;
        if (typeof submitBtn === 'function') {
            submitBtn();
        }
        if (!dontClose) {
            this.closeModal();
        }
    },

    render: function () {
        let {submitBtn, closeModal} = this.props;
        let submitBtnComponent = null;
        let closeBtnComponent = null;

        // Make a Submit button component -- either the given one or a default one that calls the
        // given function. Note: if you pass `null` in the submitBtn property, this component
        // thinks that's a function because of an old Javascript characteristic.
        if (submitBtn) {
            submitBtnComponent = (typeof submitBtn === 'object') ? submitBtn : <button className="btn btn-info" onClick={this.submitModal}>Submit</button>;
        }

        // If the given closeModal property is a component, make sure it calls the close function
        // when it gets clicked.
        if (typeof closeModal === 'object') {
            // If the close button had a click handler, save it so we can call it before calling
            // the standard one.
            if (closeModal.props.onClick) {
                this.chainedCloseModal = closeModal.props.onClick;
            }
            closeModal = cloneWithProps(closeModal, { onClick: this.closeModal });
        } else if (typeof closeModal === 'function') {
            this.chainedCloseModal = closeModal;
        }

        // Make a Cancel button component -- either the given one, a default one that calls the
        // given function, or a default one that calls the default function. Note: if you pass
        // `null` in the closeModal property, this component thinks that's a function because of an
        // old Javascript characteristic.
        if (closeModal) {
            let closeBtnFunc = (typeof closeModal === 'function') ? closeModal : (typeof closeModal === 'boolean' ? this.props._closeModal : null);
            closeBtnComponent = (typeof closeModal === 'object') ? closeModal : <button className="btn btn-info" onClick={closeBtnFunc}>Cancel</button>;
        }

        return (
            <div className="modal-footer">
                {this.props.children ? this.props.children : null}
                {submitBtnComponent || closeBtnComponent ?
                    <div className="modal-footer-controls">
                        {closeBtnComponent}
                        {submitBtnComponent}
                    </div>
                    : null}
                {this.props.children}
            </div>
        );
    }
});
