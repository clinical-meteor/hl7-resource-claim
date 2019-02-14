import { CardActions, CardText, DatePicker, Toggle, RaisedButton, TextField } from 'material-ui';
import { get, has, set } from 'lodash';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';


const styles = {
  block: {
    maxWidth: 250,
  },
  toggle: {
    marginTop: 16,
  },
  thumbOff: {
    backgroundColor: '#ffcccc',
  },
  trackOff: {
    backgroundColor: '#ff9d9d',
  },
  thumbSwitched: {
    backgroundColor: 'red',
  },
  trackSwitched: {
    backgroundColor: '#ff9d9d',
  },
  labelStyle: {
    color: 'red',
  },
};

export class ClaimDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      claimId: false,
      claim: {
        resourceType : 'Claim',
        name : [{
          text : '',
          prefix: [''],
          family: [''],
          given: [''],
          suffix: [''],
          resourceType : 'HumanName'
        }],
        active : true,
        gender : "",
        birthDate : '',
        photo : [{
          url: ""
        }],
        identifier: [{
          use: 'usual',
          type: {
            coding: [
              {
                system: 'http://hl7.org/fhir/v2/0203',
                code: 'MR'
              }
            ]
          },
          value: ''
        }],
        deceasedBoolean: false,
        multipleBirthBoolean: false,
        maritalStatus: {
          text: ''
        },
        contact: [],
        animal: {
          species: {
            text: 'Human'
          }
        },
        communication: [{
          language: {
            text: 'English'
          }
        }],
        careProvider: [{
          display: '',
          reference: ''
        }],
        managingOrganization: {
          reference: '',
          display: ''
        }
      },
      form: {
        prefix: '',
        family: '',
        given: '',
        suffix: '',
        identifier: '',
        deceased: false,
        multipleBirth: false,
        maritalStatus: '',
        species: '',
        language: ''
      }
    }
  }
  dehydrateFhirResource(claim) {
    let formData = Object.assign({}, this.state.form);

    formData.prefix = get(claim, 'name[0].prefix[0]')
    formData.family = get(claim, 'name[0].family[0]')
    formData.given = get(claim, 'name[0].given[0]')
    formData.suffix = get(claim, 'name[0].suffix[0]')
    formData.identifier = get(claim, 'identifier[0].value')
    formData.deceased = get(claim, 'deceasedBoolean')
    formData.gender = get(claim, 'gender')
    formData.multipleBirth = get(claim, 'multipleBirthBoolean')
    formData.maritalStatus = get(claim, 'maritalStatus.text')
    formData.species = get(claim, 'animal.species.text')
    formData.language = get(claim, 'communication[0].language.text')
    formData.birthDate = moment(claim.birthDate).format("YYYY-MM-DD")

    return formData;
  }
  shouldComponentUpdate(nextProps){
    process.env.NODE_ENV === "test" && console.log('ClaimDetail.shouldComponentUpdate()', nextProps, this.state)
    let shouldUpdate = true;

    // both false; don't take any more updates
    if(nextProps.claim === this.state.claim){
      shouldUpdate = false;
    }

    // received an claim from the table; okay lets update again
    if(nextProps.claimId !== this.state.claimId){
      this.setState({claimId: nextProps.claimId})
      
      if(nextProps.claim){
        this.setState({claim: nextProps.claim})     
        this.setState({form: this.dehydrateFhirResource(nextProps.claim)})       
      }
      shouldUpdate = true;
    }
 
    return shouldUpdate;
  }
  getMeteorData() {
    let data = {
      claimId: this.props.claimId,
      claim: false,
      form: this.state.form
    };

    if(this.props.claim){
      data.claim = this.props.claim;
    }
    if(this.props.displayBirthdate){
      data.displayBirthdate = this.props.displayBirthdate;
    }

    if(process.env.NODE_ENV === "test") console.log("ClaimDetail[data]", data);
    return data;
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('ClaimDetail.render()', this.state)
    let formData = this.state.form;

    return (
      <div id={this.props.id} className="claimDetail">
        <CardText>
          <Row>
            <Col md={4}>
              <TextField
                id='mrnInput'
                ref='identifier'
                name='identifier'
                floatingLabelText='Identifier (Medical Record Number)'
                value={ get(formData, 'identifier', '')}
                onChange={ this.changeState.bind(this, 'identifier')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3} mdOffset={5}>
              <br />
              <Toggle
                label="Deceased"
                labelPosition="right"
                defaultToggled={false}
                style={styles.toggle}
              />
            </Col>
          </Row>
          <Row>
            <Col md={1}>
              <TextField
                id='prefixInput'
                ref='prefix'
                name='prefix'
                floatingLabelText='Prefix'
                value={ get(formData, 'prefix', '')}
                onChange={ this.changeState.bind(this, 'prefix')}
                hintText=''
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={5}>
              <TextField
                id='givenInput'
                ref='given'
                name='given'
                floatingLabelText='Given Name'
                hintText='Jane'
                value={ get(formData, 'given', '')}
                onChange={ this.changeState.bind(this, 'given')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='familyInput'
                ref='family'
                name='family'
                floatingLabelText='Family Name'
                hintText='Doe'
                value={ get(formData, 'family', '')}
                onChange={ this.changeState.bind(this, 'family')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>

            </Col>
            <Col md={3}>
              <TextField
                id='suffixInput'
                ref='suffix'
                name='suffix'
                floatingLabelText='Suffix / Maiden'
                hintText=''
                value={ get(formData, 'suffix', '')}
                onChange={ this.changeState.bind(this, 'suffix')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <TextField
                id='maritalStatusInput'
                ref='maritalStatus'
                name='maritalStatus'
                floatingLabelText='Marital Status'
                hintText='single | maried | other'
                value={ get(formData, 'maritalStatus', '')}
                onChange={ this.changeState.bind(this, 'maritalStatus')}
                floatingLabelFixed={false}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='genderInput'
                ref='gender'
                name='gender'
                floatingLabelText='Gender'
                hintText='male | female | unknown'
                value={ get(formData, 'gender', '')}
                onChange={ this.changeState.bind(this, 'gender')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              {/* <br />
              { this.renderDatePicker(true, get(formData, 'birthDate') ) } */}

              <TextField
                id='birthDateInput'
                ref='birthDate'
                name='birthDate'
                type='date'
                floatingLabelText='Birthdate'
                // hintText='YYYY-MM-DD'
                value={ get(formData, 'birthDate', '')}
                onChange={ this.changeState.bind(this, 'birthDate')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3} >
              <br />
              <Toggle
                label="Multiple Birth"
                defaultToggled={false}
                labelPosition="right"
                style={styles.toggle}
              />              
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <TextField
                id='photoInput'
                ref='photo'
                name='photo'
                floatingLabelText='Photo'
                hintText='http://somewhere.com/image.jpg'
                value={ get(formData, 'photo', '')}
                onChange={ this.changeState.bind(this, 'photo')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='speciesInput'
                ref='species'
                name='species'
                floatingLabelText='Species'
                value={ get(formData, 'species', '')}
                hintText='Human'
                onChange={ this.changeState.bind(this, 'species')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='languageInput'
                ref='language'
                name='language'
                floatingLabelText='Language'
                value={ get(formData, 'language', '')}
                onChange={ this.changeState.bind(this, 'language')}
                hintText='English'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>


        </CardText>
        <CardActions>
          { this.determineButtons(this.data.claimId) }
        </CardActions>
      </div>
    );
  }
  renderDatePicker(displayDatePicker, birthDate){
    if (displayDatePicker) {
      console.log('renderDatePicker', displayDatePicker, birthDate, typeof birthDate)

      let javascriptDate;
      let momentDate;

      if(typeof birthDate === "string"){
        momentDate = moment(birthDate).toDate();
      } else {
        momentDate = birthDate;
      }
    
      console.log('javascriptDate', javascriptDate)
      console.log('momentDate', momentDate)

      return (
        <DatePicker 
          name='birthDate'
          hintText="Birthdate" 
          container="inline" 
          mode="landscape"
          value={ momentDate ? momentDate : null}    
          onChange={ this.changeState.bind(this, 'birthDate')}      
          floatingLabelFixed={true}
          fullWidth
        />
      );
    }
  }
  determineButtons(claimId){
    if (claimId) {
      return (
        <div>
          <RaisedButton id='updateClaimButton' className='updateClaimButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
          <RaisedButton id='deleteClaimButton' label="Delete" onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return(
        <RaisedButton id='saveClaimButton'  className='saveClaimButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }

  updateFormData(formData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("ClaimDetail.updateFormData", formData, field, textValue);

    switch (field) {
      case "prefix":
        set(formData, 'prefix', textValue)
        break;
      case "family":
        set(formData, 'family', textValue)
        break;
      case "given":
        set(formData, 'given', textValue)
        break;        
      case "suffix":
        set(formData, 'suffix', textValue)
        break;
      case "identifier":
        set(formData, 'identifier', textValue)
        break;
      case "gender":
        set(formData, 'gender', textValue)
        break;
      case "maritalStatus":
        set(formData, 'maritalStatus', textValue)
        break;
      case "deceased":
        set(formData, 'deceased', textValue)
        break;
      case "multipleBirth":
        set(formData, 'multipleBirth', textValue)
        break;
      case "species":
        set(formData, 'species', textValue)
        break;
      case "language":
        set(formData, 'language', textValue)
        break;
      case "photo":
        set(formData, 'photo', textValue)
        break;
      case "birthDate":
        set(formData, 'birthDate', textValue)
        break;
      default:
    }

    if(process.env.NODE_ENV === "test") console.log("formData", formData);
    return formData;
  }
  updateClaim(claimData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("ClaimDetail.updateClaim", claimData, field, textValue);

    switch (field) {
      case "prefix":
        set(claimData, 'name[0].prefix[0]', textValue)
        break;
      case "family":
        set(claimData, 'name[0].family[0]', textValue)
        break;
      case "given":
        set(claimData, 'name[0].given[0]', textValue)
        break;        
      case "suffix":
        set(claimData, 'name[0].suffix[0]', textValue)
        break;
      case "identifier":
        set(claimData, 'identifier[0].value', textValue)
        break;
      case "deceased":
        set(claimData, 'deceasedBoolean', textValue)
        break;
      case "multipleBirth":
        set(claimData, 'multipleBirthBoolean', textValue)
        break;
      case "gender":
        set(claimData, 'gender', textValue)
        break;
      case "maritalStatus":
        set(claimData, 'maritalStatus.text', textValue)
        break;
      case "species":
        set(claimData, 'animal.species.text', textValue)
        break;
      case "language":
        set(claimData, 'communication[0].language.text', textValue)
        break;  
      case "photo":
        set(claimData, 'photo[0].url', textValue)
        break;
      case "birthDate":
        set(claimData, 'birthDate', textValue)
        break;
    }
    return claimData;
  }
  changeState(field, event, textValue){
    if(process.env.NODE_ENV === "test") console.log("   ");
    if(process.env.NODE_ENV === "test") console.log("ClaimDetail.changeState", field, textValue);
    if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

    let formData = Object.assign({}, this.state.form);
    let claimData = Object.assign({}, this.state.claim);

    formData = this.updateFormData(formData, field, textValue);
    claimData = this.updateClaim(claimData, field, textValue);

    if(process.env.NODE_ENV === "test") console.log("claimData", claimData);
    if(process.env.NODE_ENV === "test") console.log("formData", formData);

    this.setState({claim: claimData})
    this.setState({form: formData})
  }


  // this could be a mixin
  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Claim...', this.state)

    let self = this;
    let fhirClaimData = Object.assign({}, this.state.claim);

    if(process.env.NODE_ENV === "test") console.log('fhirClaimData', fhirClaimData);


    let claimValidator = ClaimSchema.newContext();
    console.log('claimValidator', claimValidator)
    claimValidator.validate(fhirClaimData)

    console.log('IsValid: ', claimValidator.isValid())
    // console.log('ValidationErrors: ', claimValidator.validationErrors());

    if (this.state.claimId) {
      if(process.env.NODE_ENV === "test") console.log("Updating claim...");

      delete fhirClaimData._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      fhirClaimData.resourceType = 'Claim';

      Claims._collection.update({_id: this.state.claimId}, {$set: fhirClaimData }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Claims.insert[error]", error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Claims", recordId: self.state.claimId});
          Session.set('selectedClaimId', false);
          Session.set('claimPageTabIndex', 1);
          Bert.alert('Claim added!', 'success');
        }
      });
    } else {
      if(process.env.NODE_ENV === "test") console.log("Creating a new claim...", fhirClaimData);

      Claims._collection.insert(fhirClaimData, function(error, result) {
        if (error) {
          if(process.env.NODE_ENV === "test")  console.log('Claims.insert[error]', error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Claims", recordId: self.state.claimId});
          Session.set('claimPageTabIndex', 1);
          Session.set('selectedClaimId', false);
          Bert.alert('Claim added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('claimPageTabIndex', 1);
  }

  handleDeleteButton(){
    let self = this;
    Claims._collection.animalremove({_id: this.state.claimId}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Claims.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Claims", recordId: self.state.claimId});
        Session.set('claimPageTabIndex', 1);
        Session.set('selectedClaimId', false);
        Bert.alert('Claim removed!', 'success');
      }
    });
  }
}

ClaimDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  claimId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  claim: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};
ReactMixin(ClaimDetail.prototype, ReactMeteorData);
export default ClaimDetail;