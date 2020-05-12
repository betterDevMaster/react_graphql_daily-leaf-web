import React, { Component } from 'react'
import DropzoneComponent from 'react-dropzone-component'
import 'react-dropzone-component/styles/filepicker.css'
import 'dropzone/dist/min/dropzone.min.css'
import './AdminCommon.css'

var componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: true,
  multi: false,
  postUrl: 'no-url'
}

var djsConfig = {
  addRemoveLinks: true,
  acceptedFiles: 'image/jpeg,image/png,image/gif',
  autoProcessQueue: false,
  // maxFilesize: 1,
  resizeWidth: 1024,
  resizeMethod: 'contain',
  resizeQuality: 1.0
}

class ImageUpload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      source: null
    }
  }

  componentDidMount () {
    this.setState({source: this.props.src})
  }

  fileChanged (fileData) {
    this.props.onChange(fileData)
    this.setState({source: null})
  }

  render () {
    let config = Object.assign({}, componentConfig)
    if (this.props.multi) {
      // config.maxFilesize = 1
      config.allowMultiple = true
    }

    return (
      <DropzoneComponent
        djsConfig={djsConfig}
        config={config}
        eventHandlers={{ addedfile: this.fileChanged.bind(this) }}>
        {this.state.source ? <img src={this.state.source} alt='default' /> : null}
      </DropzoneComponent>
    )
  }
}
export default ImageUpload
