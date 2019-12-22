import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { darken } from 'polished';

import theme from '../../theme';

const ColoredButton = styled.button`
    & {
        min-width: ${(props) => props.minWidth};
        background-color: ${(props) => props.color};
        cursor: pointer;
        font-weight: bold;

        &:hover {
            background-image: ${(props) =>
                `radial-gradient(circle, transparent 1%, ${darken(0.2, props.color)} 1%)`};
            background-color: ${(props) => darken(0.2, props.color)};
        }

        &:active {
            background-color: ${(props) => darken(0.1, props.color)};
        }

        &.btn--border {
            background: ${(props) => (props.colorAlt ? props.colorAlt : 'transparent')};
            color: ${(props) => props.color};
            border: 2px solid ${(props) => props.color};
        }

        &.disabled,
        &:disabled {
            background: ${theme.alto};
            color: ${theme.black};

            &:hover,
            &:active {
                background: ${theme.alto};
                color: ${theme.black};
            }

            &.disabled--clickable:hover {
                background-image: radial-gradient(
                    circle,
                    transparent 1%,
                    ${darken(0.2, `${theme.alto}`)} 1%
                );
                background-color: ${darken(0.2, `${theme.alto}`)};
            }

            &.disabled--clickable:active {
                background-color: ${darken(0.1, `${theme.alto}`)};
            }
        }
    }

    &.btn--link {
        background: transparent;
        color: ${(props) => props.color};
        min-width: 0;
        border: 0;

        &:hover,
        &:focus,
        &:active {
            background: transparent;
            box-shadow: none;
            color: ${(props) => darken(0.2, props.color)};
            transition: none;
        }
    }
`;

const Content = styled.span`
    display: flex;
    align-items: stretch;
    justify-content: center;
`;

const Icon = styled.span`
    display: flex;
    align-items: center;
    order: ${(props) => (props.iconOnRight ? '2' : '0')};
    padding-right: ${(props) => (props.iconOnRight ? '0' : '5px')};
    padding-left: ${(props) => (props.iconOnRight ? '5px' : '0')};
`;
Icon.displayName = 'Icon';

const Text = styled.span`
    display: flex;
    align-items: center;
    padding-left: ${(props) => (props.iconOnRight ? '5px' : '0')};
	padding-right: ${(props) => (props.iconOnRight ? '0' : '5px')};
`;
Text.displayName = 'Text';

export class Button extends Component {
    handleClick = (event) => {
        if (this.props.handleClick) {
            event.preventDefault();
            this.props.handleClick(event);
        }
        return false;
    };

    renderTitleOrText = () => {
        if (this.props.title) {
            return this.props.title;
        }
        if (this.props.buttonText) {
            return this.props.buttonText;
        }
        return null;
    };

    renderIcon = () => {
        if (this.props.icon) {
            return <Icon iconOnRight={this.props.iconOnRight}>{this.props.icon}</Icon>;
        }
        return null;
    };

    renderText = () => {
        if (this.props.buttonText) {
            return <Text iconOnRight={this.props.iconOnRight}>{this.props.buttonText}</Text>;
        }
        return null;
    };

    render() {
        return (
            <ColoredButton
                color={this.props.color}
                colorAlt={this.props.colorAlt}
                iconOnRight={this.props.iconOnRight}
                onClick={this.handleClick}
                className={this.props.className}
                title={this.renderTitleOrText()}
                type={this.props.type}
                aria-label={this.renderTitleOrText()}
                disabled={this.props.disabled}
                hidden={this.props.hidden}
                minWidth={this.props.minWidth}
            >
                <Content>
                    {this.renderIcon()}
                    {this.renderText()}
                </Content>
            </ColoredButton>
        );
    }
}

Button.defaultProps = {
    color: theme.primaryColor,
    colorAlt: null,
    iconOnRight: false,
    type: 'button',
    className: 'btn',
    disabled: false,
    hidden: false,
    minWidth: "175px"
};

Button.propTypes = {
    /** A CSS color code. */
    color: PropTypes.string,
    /** A secondary CSS color code. */
    colorAlt: PropTypes.string,
    /** Button text. */
    buttonText: PropTypes.node,
    /** Icon HTML. Typically include a font-awesome icon. Can also be an image. */
    icon: PropTypes.node,
    /** Make button icon appear on right of button text insted of left of button text. */
    iconOnRight: PropTypes.bool,
    /** Class name. */
    className: PropTypes.string,
    /** Button type */
    type: PropTypes.string,
    /** Is the button disabled? */
    disabled: PropTypes.bool,
    /** Is the button hidden? */
    hidden: PropTypes.bool,
    /** On click */
    handleClick: PropTypes.func,
    /** Should the button be smaller then the defeault min-width? */
    smallButton: PropTypes.bool
};