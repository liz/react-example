import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Background = styled.div`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    max-width: ${(props) => props.maxWidth};
    max-height: ${(props) => props.maxHeight};
    background-image: url(${(props) => props.src});
    background-repeat: no-repeat;
    background-size: cover;
    background-position-x: ${(props) => props.horizontalAlignment};
    background-position-y: ${(props) => props.verticalAlignment};
`;
Background.displayName = 'Background';

const Container = styled.div`
    width: 100%;
`;
Container.displayName = 'Container';

const Img = styled.img`
    width: ${(props) => props.width};
    max-width: ${(props) => props.maxWidth};
    max-height: ${(props) => props.maxHeight};
    flex: 0 0 auto;
`;
Img.displayName = 'Img';

Img.defaultProps = {
    width: '100%',
    maxWidth: '100%',
    maxHeight: '100%'
};

export class Image extends Component {
    render() {
        if (this.props.type === 'css') {
            return (
                <Container className="bst">
                    <Background
                        src={this.props.src}
                        width={this.props.width}
                        height={this.props.height}
                        maxWidth={this.props.maxWidth}
                        maxHeight={this.props.maxHeight}
                        horizontalAlignment={this.props.horizontalAlignment}
                        verticalAlignment={this.props.verticalAlignment}
                        className={`${this.props.className || ''} ${
                            this.props.children ? '' : 'text-hide'
                        }`}
                    >
                        {this.props.children || this.props.alt}
                    </Background>
                </Container>
            );
        }
        return (
            <Img
                src={this.props.src}
                width={this.props.width}
                maxWidth={this.props.maxWidth}
                height={this.props.height}
                maxHeight={this.props.maxHeight}
                alt={this.props.alt}
                className={this.props.className}
            />
        );
    }
}

Image.propTypes = {
    /** URL of image. */
    src: PropTypes.string,
    /** Width of image. */
    width: PropTypes.string,
    /** Height of image. */
    height: PropTypes.string,
    /** Max Width of image. */
    maxWidth: PropTypes.string,
    /** Max Height of image. */
    maxHeight: PropTypes.string,
    /** Horizontal alignment of image. Use 'left', 'center', or 'right'. */
    horizontalAlignment: PropTypes.string,
    /** Vertical alignment of image. Use 'top', 'center', or 'bottom'. */
    verticalAlignment: PropTypes.string,
    /** Alt text for image for those who cannot see the image. */
    alt: PropTypes.string,
    /** Type of image. Use 'tag' for a typical image tag where image height changes automatically.
     Use 'css' for when you need an image to fill a fixed-height. */
    type: PropTypes.string,
    /** Class name */
    className: PropTypes.string,
    /** Child elements */
    children: PropTypes.node
};

Image.defaultProps = {
    width: '100%',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    horizontalAlignment: 'center',
    verticalAlignment: 'center',
    type: 'tag'
};