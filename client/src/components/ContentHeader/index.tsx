import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { PlusCircleFill } from 'react-bootstrap-icons';
import { NavLink } from 'react-router';

type Props = {
  h1TextRegular: string;
  h1TextBold: string;
  subtitle: string;
  h2BlackText: string;
  h2GreenText: string;
  isHomeComponent?: boolean;
};

/**
 * Renders the content header component with the title, subtitle and another subtitle.
 *
 * @param {Props} props the ContentHeader props with text to the displayed.
 * @param {string} props.h1TextRegular The first part of the h1 text block.
 * @param {string} props.h1TextBold The second part of the h1 text block.
 * @param {string} props.subtitle The header subtitle, muted.
 * @param {string} props.h2BlackText The first part of the h2 text block, black.
 * @param {string} props.h2GreenText The second part of the h2 text block, green.
 * @returns {React.ReactNode} The rendered ContentHeader component.
 */
const ContentHeader: React.FC<Props> = (props: Props): React.ReactNode => {
  return (
    <>
      <h1 className="poppins-regular home-hello main-margin">
        {props.h1TextRegular}
        {' '}
        <b>{props.h1TextBold}</b>
      </h1>
      <p className="poppins-regular home-subtitle">
        {props.subtitle}
      </p>

      <Row className="mb-3">
        {/* If it's not the home component, display full column */}
        <Col xs={props.isHomeComponent ? 8 : 12}>
          <h2 className="poppins-regular">
            {props.h2BlackText}
          </h2>
          <h2 className="poppins-bold home-productive">
            {props.h2GreenText}
          </h2>
        </Col>
        {props.isHomeComponent && (
          <Col xs={4} className="text-end">
            <NavLink to="/tasks/new">
              <button
                type="button"
                className="home-new-item w-45 mb-2"
              >
                <PlusCircleFill size={25} />
                Add note
              </button>
            </NavLink>
            <NavLink to="/notes/new">
              <button
                type="button"
                className="home-new-item w-45"
              >
                <PlusCircleFill size={25} />
                Add task
              </button>
            </NavLink>
          </Col>
        )}
      </Row>
    </>
  );
};

export default ContentHeader;
