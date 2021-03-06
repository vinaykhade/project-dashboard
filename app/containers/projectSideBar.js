import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProjectSidebar from '../components/ProjectSideBar';
import * as addProjectActions from '../actions/addProject';

function mapStateToProperties(state) {
  const { projects } = state;

  return {
    projects,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...addProjectActions,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProperties,
  mapDispatchToProps,
)(ProjectSidebar);
