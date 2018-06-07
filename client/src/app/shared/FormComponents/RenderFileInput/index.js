import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RenderFileInput from './RenderFileInput';
import { uploadImage, clearUploadError } from '../../../../store/operations/uploadImage';

const mapStateToProps = state => ({
  uploadError: state.uploadImage.error,
  uploading: state.uploadImage.uploading,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  uploadImage, clearUploadError
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RenderFileInput);
