import React, { Component } from 'react'
import Gallery from 'react-photo-gallery'
import Photo from './Photo'
import SortPhoto from './SortablePhoto'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import ImageUpload from '../../components/ImageManager/ImageUploader'

const SortablePhoto = SortableElement(SortPhoto)
const SortableGallery = SortableContainer(({photos}) => {
  return <Gallery photos={photos} ImageComponent={SortablePhoto} />
})

export default class ImageGallery extends Component {
  constructor (props) {
    super(props)
    this.state = {
      photos: props.photos || [],
      selectAll: false,
      sorting: false
    }

    this.onSortEnd = this.onSortEnd.bind(this)
    this.selectPhoto = this.selectPhoto.bind(this)
    this.toggleSelect = this.toggleSelect.bind(this)
    this.upload = this.upload.bind(this)
    this.fileCount = this.fileCount.bind(this)
    this.files = this.files.bind(this)
  }

  files () {
    return this.imageUploader.files()
  }

  fileCount () {
    return this.imageUploader.fileCount()
  }

  upload () {
    return this.imageUploader.upload()
  }

  removeAllFiles () {
    return this.imageUploader.removeAllFiles()
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.photos) {
      let newPhotos = []
      nextProps.photos.forEach(element => {
        newPhotos.push({ src: element, width: 200, height: 200 })
      })
      this.setState({
        photos: newPhotos
      })
    }
  }

  onSortEnd ({ oldIndex, newIndex }) {
    var self = this
    this.setState({
      photos: arrayMove(this.state.photos, oldIndex, newIndex)
    }, () => {
      if (self.props.handleGalleryUpdate) {
        self.props.handleGalleryUpdate(self.state.photos)
      }
    })
  }

  selectPhoto (event, obj) {
    let photos = this.state.photos
    photos[obj.index].selected = !photos[obj.index].selected
    this.setState({ photos: photos })
  }

  toggleSelect () {
    let photos = this.state.photos.map((photo, index) => { return { ...photo, selected: !this.state.selectAll } })
    this.setState({ photos: photos, selectAll: !this.state.selectAll })
  }

  enterSelectMode (e) {
    e.preventDefault()
    this.setState({
      sorting: false
    })
  }

  enterSortMode (e) {
    e.preventDefault()
    this.setState({
      sorting: true
    })
  }

  cancelSelect (e) {
    if (e) {
      e.preventDefault()
    }
    let photos = this.state.photos.map((photo, index) => { return { ...photo, selected: false } })
    this.setState({ photos: photos, selectAll: false })
  }

  deletePhotos (e) {
    let photos = this.state.photos.filter((photo) => !photo.selected)
    var self = this
    e.preventDefault()
    window.swal({
      title: 'Are you sure you want to delete these images',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        self.setState({photos: photos})
        if (self.props.handleGalleryUpdate) {
          self.props.handleGalleryUpdate(photos)
        }
      } else {

      }
    })
  }

  render () {
    let selectedPhotos = this.state.photos.filter((photo) => photo.selected)
    return (
      <div>
        <ImageUpload grid ref={(imageUpload) => { this.imageUploader = imageUpload }} multi={this.props.multi || false} filesUpdated={this.props.onFilesUpdated} />
        <br />
        {
          this.state.photos.length > 1 ? <div>
            <button className='btn btn-primary' disabled={!this.state.sorting} onClick={this.enterSelectMode.bind(this)}>Select Mode</button>
            <button className='btn btn-primary' disabled={this.state.sorting} onClick={this.enterSortMode.bind(this)}>Sort Mode</button>
          </div> : null
        }

        {this.state.sorting ? <SortableGallery axis={'x'} columns={6} photos={this.state.photos} onSortEnd={this.onSortEnd} />
        : <Gallery photos={this.state.photos ? this.state.photos : []} axis={'x'} columns={6} onClick={this.selectPhoto} ImageComponent={Photo} />
        }

        {(this.state.sorting === false && selectedPhotos.length > 0) ? <div>
          <button className='btn btn-secondary' onClick={this.cancelSelect.bind(this)}>Cancel</button>
          <button className='btn btn-danger' onClick={this.deletePhotos.bind(this)}>Delete Image(s)</button>
        </div> : null }

      </div>
    )
  }
}
