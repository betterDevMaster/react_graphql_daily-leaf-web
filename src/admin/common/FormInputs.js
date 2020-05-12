import React from 'react'
import Select, { Creatable } from 'react-select'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import NumberFormat from 'react-number-format'
import 'react-select/dist/react-select.css'
import 'react-datepicker/dist/react-datepicker.css'
import ReactQuill from 'react-quill'

export const SelectField = (props) => (
  <FormGroup {...props}>
    <Select
      {...props}
      value={props.input.value}
      onChange={(value) => props.input.onChange(value)}
      onBlur={() => props.input.onBlur(props.input.value)}
      options={props.options}
    />
  </FormGroup>
)

export const TagField = (props) => (
  <FormGroup {...props}>
    <Creatable
      {...props}
      value={props.input.value}
      onChange={(value) => props.input.onChange(value)}
      onBlur={() => props.input.onBlur(props.input.value)}
      options={props.options}
    />
  </FormGroup>
)

export const TextField = (props) => (
  <FormGroup {...props}>
    <input
      className='form-control'
      required={props.required}
      name={props.name}
      {...props}
      {...props.input}
      {...props.custom} />
  </FormGroup>
)

export const Checkbox = (props) => (
  <FormGroup {...props}>
    <div className='form-check'>
      <label className='form-check-label'>
        <input className='form-check-input' checked={props.input.value} type='checkbox' {...props.input} {...props} {...props.custom} />
        <span className='form-check-sign' />
        {props.checkboxTitle || ''}
      </label>
    </div>
  </FormGroup>
)

export const CurrencyField = (props) => (
  <FormGroup {...props}>
    <NumberFormat
      className='form-control'
      thousandSeparator
      fixedDecimalScale
      prefix={'$'}
      required={props.required}
      name={props.name}
      {...props}
      {...props.input}
      {...props.custom} />
  </FormGroup>
)

export const TextArea = (props) => (
  <FormGroup {...props}>
    <textarea
      className='form-control'
      required={props.required}
      name={props.name}
      {...props}
      {...props.input}
      {...props.custom} />
  </FormGroup>
)

const toolbarOptions = [
  [{ 'header': [1, 2, 3, false] }],
  ['bold', 'italic', 'underline'],        // toggled buttons

  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'align': [] }],
  ['link', 'image', 'code-block'],

  ['clean']                                         // remove formatting button
]

const modules = {
  toolbar: toolbarOptions
}

export const EditorTextArea = (props) => (
  <FormGroup {...props}>
    <ReactQuill
      modules={modules}
      {...props.input}
      onChange={(newValue, delta, source) => {
        if (source === 'user') {
          props.input.onChange(newValue)
        }
      }}
      onBlur={(range, source, quill) => {
        props.input.onBlur(quill.getHTML())
      }} />
    </FormGroup>
)

export const DatePickerField = (props) => (
  <FormGroup {...props}>
    <DatePicker className='form-control' {...props.input} showTimeSelect={props.showTimeSelect} dateFormat='MM/DD/YYYY h:mm A' selected={props.input.value ? moment(props.input.value) : null} />
    {props.meta.touched && props.meta.error && <span>{props.meta.error}</span>}
  </FormGroup>
)

export const FormGroup = (props) => (
  <div className='form-group'>
    <label htmlFor={props.name}>{props.label}</label>
    {props.children}
  </div>
)
