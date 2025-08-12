import React, { useEffect, useState } from 'react';
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import DatePicker from 'react-datepicker';
import { MiddlewareReturn } from '@floating-ui/core';
import { MiddlewareState } from '@floating-ui/dom';
import 'react-datepicker/dist/react-datepicker.css';
import './custom-datepicker.scss';

type IconName = keyof typeof Icons;

interface Props {
  labelText: string;
  iconName: IconName;
  required: boolean;
  type?: string;
  name: string;
  placeholder?: string;
  value?: string;
  valueDate?: Date | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDate?: (date: Date | null) => void;
  data_testid?: string;
  pwdHideText?: string;
  pwdShowText?: string;
  pwdHelperTxt?: string;
  helperText?: string; // Added optional helper text prop
}

/**
 * FormInput component renders a form input with a label, icon, and optional password toggle.
 */
function FormInput(props: React.PropsWithChildren<Props>): React.ReactNode {
  const [showingPwd, setShowingPwd] = useState<boolean>(false);
  const [formType, setFormType] = useState<string>(props.type ? props.type : 'text');
  const Icon = Icons[props.iconName];

  /**
   * Toggle the password visibility.
   */
  const toggleShowPassword = (e: React.MouseEvent<Element, MouseEvent>): void => {
    e.preventDefault();
    e.stopPropagation();

    setShowingPwd((prevValue: boolean) => !prevValue);
    setFormType((previous: string) => previous === 'text' ? 'password' : 'text');
  };

  useEffect(() => {}, [showingPwd, formType]);

  return (
    <Row>
      <Col>
        <Form.Group className="mb-3" controlId={`form-input-${props.name}`}>
          <Form.Label>
            {props.labelText}
            {props.type && props.type === 'password' && (
              <small>
                <a href="#" onClick={toggleShowPassword}>
                  {showingPwd ? ` (${props.pwdHideText})` : ` (${props.pwdShowText})`}
                </a>
              </small>
            )}
          </Form.Label>

          <InputGroup className="mb-3">
            <InputGroup.Text>
              <Icon />
            </InputGroup.Text>
            {props.type == 'date'
              ? (
                  <DatePicker
                    selected={props?.valueDate}
                    onChange={(date: Date | null) => {
                      if (props.onChangeDate) {
                        props.onChangeDate(date);
                      }
                    }}
                    dateFormat="MMMM d, yyyy"
                    className="form-control"
                    id="date-input"
                    placeholderText={props.placeholder}
                    popperPlacement="bottom"
                    popperModifiers={[
                      {
                        name: 'preventOverflow',
                        options: {
                          enabled: true,
                          boundariesElement: 'viewport'
                        },
                        fn: function (state: MiddlewareState): MiddlewareReturn | Promise<MiddlewareReturn> {
                          return state;
                        }
                      }
                    ]}
                    withPortal
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                  />
                )
              : (
                  <Form.Control
                    required={props.required}
                    type={formType}
                    name={props.name}
                    placeholder={props.placeholder ? props.placeholder : ''}
                    value={props?.value}
                    onChange={props.onChange}
                    data-testid={props.data_testid}
                  />
                )}
          </InputGroup>

          {/* Password helper text - moved outside InputGroup */}
          {props.type && props.type === 'password' && props.pwdHelperTxt && (
            <Form.Text id="passwordHelpBlock" muted>
              {props.pwdHelperTxt}
            </Form.Text>
          )}

          {/* General helper text - added support for optional helper text */}
          {props.helperText && (
            <Form.Text className="text-muted">
              {props.helperText}
            </Form.Text>
          )}
        </Form.Group>
      </Col>
    </Row>
  );
}

export default FormInput;
