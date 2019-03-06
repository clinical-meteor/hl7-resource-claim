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
        created: '',
        diagnosis: '',
        identifier: '',
        insurance: '',
        insurer: '',
        patient: '',
        provider: '',
        unitprice: ''
      },
      form: {
        created: '',
        diagnosis: '',
        identifier: '',
        insurance: '',
        insurer: '',
        patient: '',
        provider: '',
        unitprice: ''
      }
    }
  }
  dehydrateFhirResource(claim) {
    let formData = Object.assign({}, this.state.form);

    formData.created = moment(get(claim, 'created')).format('YYYY-MM-DD');
    formData.diagnosis = get(claim, 'diagnosis[0].diagnosisCodeableConcept.coding[0].code', '');
    formData.identifier = get(claim, 'identifier[0].value', '');
    formData.insurance = get(claim, 'insurance[0].coverage.reference', '');
    formData.insurer = get(claim, 'insurer.reference', '');
    formData.patient = get(claim, 'patient.reference', '');
    formData.provider = get(claim, 'provider.reference', '');
    formData.unitprice = get(claim, 'item[0].unitPrice.value', '').toString();

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
            <Col md={3}>
              <TextField
                id='createdInput'
                ref='created'
                name='created'
                type='date'
                floatingLabelText='Created'
                value={ get(formData, 'created', '')}
                onChange={ this.changeState.bind(this, 'created')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='mrnInput'
                ref='identifier'
                name='identifier'
                floatingLabelText='Identifier'
                value={ get(formData, 'identifier', '')}
                onChange={ this.changeState.bind(this, 'identifier')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <TextField
                id='insuranceInput'
                ref='insurance'
                name='insurance'
                floatingLabelText='Insurance'
                value={ get(formData, 'insurance', '')}
                onChange={ this.changeState.bind(this, 'insurance')}
                hintText=''
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='insurerInput'
                ref='insurer'
                name='insurer'
                floatingLabelText='Insurer'
                hintText='Jane'
                value={ get(formData, 'insurer', '')}
                onChange={ this.changeState.bind(this, 'insurer')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='patientInput'
                ref='patient'
                name='patient'
                floatingLabelText='Patient'
                hintText='Doe'
                value={ get(formData, 'patient', '')}
                onChange={ this.changeState.bind(this, 'patient')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>

            </Col>
            <Col md={3}>
              <TextField
                id='ProviderInput'
                ref='Provider'
                name='Provider'
                floatingLabelText='Provider'
                hintText=''
                value={ get(formData, 'Provider', '')}
                onChange={ this.changeState.bind(this, 'Provider')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <TextField
                id='unitPriceInput'
                ref='unitPrice'
                name='unitPrice'
                floatingLabelText='Unit Price'
                hintText='$'
                value={ get(formData, 'unitPrice', '')}
                onChange={ this.changeState.bind(this, 'unitPrice')}
                floatingLabelFixed={false}
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