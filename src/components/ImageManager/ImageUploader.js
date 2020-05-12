import React, { Component } from 'react'
import DropzoneComponent from 'react-dropzone-component'
import 'react-dropzone-component/styles/filepicker.css'
import 'dropzone/dist/min/dropzone.min.css'
import Promise from 'bluebird'
import { uploadImage } from '../../config/cloudinary'

var componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: true,
  multi: false,
  postUrl: 'no-url',
  maxFiles: 1
}

var djsConfig = {
  addRemoveLinks: true,
  acceptedFiles: 'image/jpeg,image/png,image/gif',
  autoProcessQueue: false,
  maxFiles: 1
}

class ImageUpload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      source: null,
      dropzone: null
    }
  }

  componentWillReceiveProps (props) {
    if (props.src) {
      this.setState({source: props.src})
    }
  }

  fileCount () {
    if (this.state.dropzone) {
      return this.state.dropzone.files.length
    } else {
      return 0
    }
  }

  files () {
    if (this.state.dropzone) {
      return this.state.dropzone.files
    } else {
      return []
    }
  }

  componentDidMount () {
    this.setState({source: this.props.src})
  }

  fileChanged (fileData) {
    if (this.props.onChange) {
      this.props.onChange(fileData)
      this.setState({source: null})
    }
    if (this.props.filesUpdated) {
      this.props.filesUpdated(this.state.dropzone.files)
    }
  }

  initCallback (dropzone) {
    this.setState({dropzone: dropzone})
  }
  removeAllFiles () {
    if (this.state.dropzone) {
      this.state.dropzone.removeAllFiles()
      if (this.props.filesUpdated) {
        this.props.filesUpdated(this.state.dropzone.files)
      }
    }
  }
  removeFile (file) {
    if (this.state.dropzone) {
      this.state.dropzone.removeFile(file)
      if (this.props.filesUpdated) {
        this.props.filesUpdated(this.state.dropzone.files)
      }
    }
  }

  upload () {
    return Promise.map(this.state.dropzone.files, (file) => {
      return uploadImage(file)
    }).then((images) => {
      /*
      let vals = Object.assign({}, this.props.values)
      vals.photos = []
      images.forEach(image => {
        vals.photos.push(image)
      })
      */
      return images
    })
  }

  render () {
    let config = Object.assign({}, componentConfig)
    if (this.props.multi) {
      // config.maxFilesize = 1
      config.allowMultiple = true
      djsConfig.maxFiles = 10
    }

    return (
      <DropzoneComponent
        djsConfig={djsConfig}
        config={config}
        eventHandlers={{
          addedfile: this.fileChanged.bind(this),
          removedFile: this.fileChanged.bind(this),
          init: this.initCallback.bind(this),
          maxfilesexceeded: (file) => {
            this.removeFile(file)
          }}}>
        {this.state.source ? <img className='img-fluid' src={this.state.source} alt='default' /> : null }

      </DropzoneComponent>
    )
  }
}
export default ImageUpload
