import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import "./CreateProfile.less";
import TextFieldGroup from "../../Common/TextFieldGroup";

// ---------REDUX---------
import { connect } from "react-redux";
import { createProfile } from "../../../actions/profileActions";

// -----------COMPONENTS-----------
import ButtonAction from "../../Common/ButtonAction";
import Footer from "../../Footer/Footer";

class CreateProfile extends Component {
  constructor() {
    super();
    this.state = {
      createProfileClicked: false,
      website: "",
      location: "",
      mostEmbarassingSong: "",
      afterWorkYouCanFindMeAt: "",
      whatWouldIDoWithMillion: "",
      iWontShutUpAbout: "",
      myMostIrrationalFear: "",
      thingIWillNeverDoAgain: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: ""
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      website,
      location,
      mostEmbarassingSong,
      afterWorkYouCanFindMeAt,
      whatWouldIDoWithMillion,
      iWontShutUpAbout,
      myMostIrrationalFear,
      thingIWillNeverDoAgain
    } = this.state;

    const newProfile = {
      website,
      location,
      mostEmbarassingSong,
      afterWorkYouCanFindMeAt,
      whatWouldIDoWithMillion,
      iWontShutUpAbout,
      myMostIrrationalFear,
      thingIWillNeverDoAgain
    };

    this.props.createProfile(newProfile);
  };

  render() {
    const { user, screenWidth } = this.props;
    const { errors } = this.state;
    const {
      createProfileClicked,
      website,
      location,
      mostEmbarassingSong,
      afterWorkYouCanFindMeAt,
      whatWouldIDoWithMillion,
      iWontShutUpAbout,
      myMostIrrationalFear,
      thingIWillNeverDoAgain
    } = this.state;
    let customWidth = screenWidth / 2.2;

    let createProfileDisplay = createProfileClicked ? (
      <Fragment>
        <h3>Create a short profile</h3>
        <TextFieldGroup
          name={"website"}
          placeholder={"www.mysite.com"}
          value={website}
          handleChange={this.handleChange}
          type={"text"}
          info={"Link to your website"}
          customWidth={customWidth}
          error={errors.website}
        />
        <TextFieldGroup
          name={"location"}
          placeholder={"Toronto, Ontario"}
          value={location}
          handleChange={this.handleChange}
          type={"text"}
          info={"Location"}
          customWidth={customWidth}
        />
        <TextFieldGroup
          name={"mostEmbarassingSong"}
          placeholder={"eg. Backstreet Boys - As long as you love me"}
          value={mostEmbarassingSong}
          handleChange={this.handleChange}
          type={"text"}
          info={"Most embarassing song on your Spotify"}
          customWidth={customWidth}
          error={errors.mostEmbarassingSong}
        />
        <TextFieldGroup
          name={"afterWorkYouCanFindMeAt"}
          placeholder={"eg. Gym, Library, Bar"}
          value={afterWorkYouCanFindMeAt}
          handleChange={this.handleChange}
          type={"text"}
          info={"After work you can find me at"}
          customWidth={customWidth}
        />
        <TextFieldGroup
          name={"whatWouldIDoWithMillion"}
          placeholder={"eg. Buy a Ferrari"}
          value={whatWouldIDoWithMillion}
          handleChange={this.handleChange}
          type={"text"}
          info={"What I would do with a million dollars"}
          customWidth={customWidth}
        />
        <TextFieldGroup
          name={"iWontShutUpAbout"}
          placeholder={"eg. How there is sugar everywhere"}
          value={iWontShutUpAbout}
          handleChange={this.handleChange}
          type={"text"}
          info={"I won???t shut up about"}
          customWidth={customWidth}
        />
        <TextFieldGroup
          name={"myMostIrrationalFear"}
          placeholder={"eg. Snakes, Clowns, Mother-in-law"}
          value={myMostIrrationalFear}
          handleChange={this.handleChange}
          type={"text"}
          info={"My most irrational fear is"}
          customWidth={customWidth}
        />
        <TextFieldGroup
          name={"thingIWillNeverDoAgain"}
          placeholder={"eg. Poke a bear with a stick"}
          value={thingIWillNeverDoAgain}
          handleChange={this.handleChange}
          type={"text"}
          info={"One thing I???ll never do again is"}
          customWidth={customWidth}
        />
        <ButtonAction
          callback={this.handleSubmit}
          name={"Submit"}
          additionalStyle={"submit-button"}
        />
      </Fragment>
    ) : (
      <Fragment>
        <img className="profile-avatar" src={user.avatar} alt="" />
        <h3>Hello {user.name.split(" ")[0]}!</h3>
        <p>Looks like you don't have a profile yet.</p>
        <p>Please create one.</p>
        <ButtonAction
          callback={() => this.setState({ createProfileClicked: true })}
          name={"Create profile"}
        />
        <Footer />
      </Fragment>
    );
    return (
      <div className="create-profile-container">{createProfileDisplay}</div>
    );
  }
}

CreateProfile.propTypes = {
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(mapStateToProps, { createProfile })(
  withRouter(CreateProfile)
);
