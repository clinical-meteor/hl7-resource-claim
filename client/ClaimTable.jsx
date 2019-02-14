import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import { HTTP } from 'meteor/http';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';
import { Session } from 'meteor/session';
import { has, get } from 'lodash';
import { TableNoData } from 'meteor/clinical:glass-ui'
import PropTypes from 'prop-types';

flattenClaim = function(person){
  let result = {
    _id: person._id,
    id: person.id,
    active: true,
    gender: get(person, 'gender'),
    name: '',
    mrn: '',
    birthDate: '',
    photo: "/thumbnail-blank.png",
    initials: 'abc'
  };

  result.active = get(person, 'active', true).toString();

  // there's an off-by-1 error between momment() and Date() that we want
  // to account for when converting back to a string
  result.birthDate = moment(person.birthDate).format("YYYY-MM-DD")
  result.photo = get(person, 'photo[0].url', '');
  result.identifier = get(person, 'identifier[0].value', '');

  result.maritalStatus = get(person, 'maritalStatus.text', '');
  result.deceased = get(person, 'deceasedBoolean', '');
  result.species = get(person, 'animal.species.text', '');
  result.language = get(person, 'communication[0].language.text', '');

  let nameText = get(person, 'name[0].text', '');
  if(nameText.length > 0){
    result.name = get(person, 'name[0].text', '');    
  } else {
    if(get(person, 'name[0].suffix[0]')){
      result.name = get(person, 'name[0].suffix[0]')  + ' ';
    }

    result.name = result.name + get(person, 'name[0].given[0]') + ' ' + get(person, 'name[0].family[0]');
    
    if(get(person, 'name[0].suffix[0]')){
      result.name = result.name + ' ' + get(person, 'name[0].suffix[0]');
    }
  }

  return result;
}

export class ClaimTable extends React.Component {
  constructor(props) {
    super(props);
  }
  getMeteorData() {
    let data = {
      style: {
        hideOnPhone: {
          visibility: 'visible',
          display: 'table'
        },
        cellHideOnPhone: {
          visibility: 'visible',
          display: 'table',
          paddingTop: '16px',
          maxWidth: '120px'
        },
        cell: {
          paddingTop: '16px'
        },
        avatar: {
          // color: rgb(255, 255, 255);
          backgroundColor: 'rgb(188, 188, 188)',
          userSelect: 'none',
          borderRadius: '2px',
          height: '40px',
          width: '40px'
        }
      },
      selected: [],
      claims: []
    };

    let query = {};
    let options = {};

    // number of items in the table should be set globally
    if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
      options.limit = get(Meteor, 'settings.public.defaults.paginationLimit');
    }
    // but can be over-ridden by props being more explicit
    if(this.props.limit){
      options.limit = this.props.limit;      
    }

    if(this.props.data){
      // console.log('this.props.data', this.props.data);

      if(this.props.data.length > 0){              
        this.props.data.forEach(function(claim){
          data.claims.push(flattenClaim(claim));
        });  
      }
    } else {
      data.claims = Claims.find().map(function(claim){
        return flattenClaim(claim);
      });
    }


    if (Session.get('appWidth') < 768) {
      data.style.hideOnPhone.visibility = 'hidden';
      data.style.hideOnPhone.display = 'none';
      data.style.cellHideOnPhone.visibility = 'hidden';
      data.style.cellHideOnPhone.display = 'none';
    } else {
      data.style.hideOnPhone.visibility = 'visible';
      data.style.hideOnPhone.display = 'table-cell';
      data.style.cellHideOnPhone.visibility = 'visible';
      data.style.cellHideOnPhone.display = 'table-cell';
    }

    // console.log("ClaimTable[data]", data);
    return data;
  }
  imgError(avatarId) {
    this.refs[avatarId].src = Meteor.absoluteUrl() + 'noAvatar.png';
  }
  rowClick(id){
    Session.set('claimsUpsert', false);
    Session.set('selectedClaimId', id);
    Session.set('claimPageTabIndex', 2);
  }
  renderRowAvatarHeader(){
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <th className='avatar'>photo</th>
      );
    }
  }
  renderRowAvatar(claim, avatarStyle){
    //console.log('renderRowAvatar', claim, avatarStyle)
    
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <td className='avatar'>
          <img src={claim.photo} ref={claim._id} onError={ this.imgError.bind(this, claim._id) } style={avatarStyle}/>
        </td>
      );
    }
  }
  renderSpeciesHeader(displaySpecies){
    if(displaySpecies){
      return (
        <th className='species'>Species</th>
      );
    }
  }
  renderSpeciesRow(displaySpecies, claim){
    if(displaySpecies){
      return (
        <td className='species' style={this.data.style.cellHideOnPhone}>
          {claim.species}
        </td>
      );
    }

  }
  renderSendButtonHeader(){
    if (this.props.showSendButton === true) {
      return (
        <th className='sendButton' style={this.data.style.hideOnPhone}></th>
      );
    }
  }
  renderSendButton(claim, avatarStyle){
    if (this.props.showSendButton === true) {
      return (
        <td className='sendButton' style={this.data.style.hideOnPhone}>
          <FlatButton label="send" onClick={this.onSend.bind('this', this.data.claims[i]._id)}/>
        </td>
      );
    }
  }
  onSend(id){
    let claim = Claims.findOne({_id: id});

    console.log("ClaimTable.onSend()", claim);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/Claim', {
      data: claim
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }
  selectClaimRow(claimId){
    if(typeof(this.props.onRowClick) === "function"){
      this.props.onRowClick(claimId);
    }
  }
  render () {
    let tableRows = [];
    let footer;

    if(this.data.claims.length === 0){
      footer = <TableNoData noDataPadding={ this.props.noDataMessagePadding } />
    } else {
      for (var i = 0; i < this.data.claims.length; i++) {
        tableRows.push(
          <tr key={i} className="claimRow" style={{cursor: "pointer"}} onClick={this.selectClaimRow.bind(this, this.data.claims[i].id )} >
  
            { this.renderRowAvatar(this.data.claims[i], this.data.style.avatar) }
  
            <td className='identifier' style={this.data.style.cellHideOnPhone}>{this.data.claims[i].identifier}</td>
            <td className='name' onClick={ this.rowClick.bind('this', this.data.claims[i]._id)} style={this.data.style.cell}>{this.data.claims[i].name }</td>
            <td className='gender' onClick={ this.rowClick.bind('this', this.data.claims[i]._id)} style={this.data.style.cell}>{this.data.claims[i].gender}</td>
            <td className='birthDate' onClick={ this.rowClick.bind('this', this.data.claims[i]._id)} style={{minWidth: '100px', paddingTop: '16px'}}>{this.data.claims[i].birthDate }</td>
            <td className='maritalStatus' style={this.data.style.cellHideOnPhone}>{this.data.claims[i].maritalStatus}</td>
            <td className='language' style={this.data.style.cellHideOnPhone}>{this.data.claims[i].language}</td>
            <td className='isActive' onClick={ this.rowClick.bind('this', this.data.claims[i]._id)} style={this.data.style.cellHideOnPhone}>{this.data.claims[i].active}</td>

              { this.renderSpeciesRow(this.props.displaySpecies, this.data.claims[i]) }
              { this.renderSendButton(this.data.claims[i], this.data.style.avatar) }
          </tr>
        );
      }
    }
    


    return(
      <div>
        <Table id='claimsTable' hover >
          <thead>
            <tr>
              { this.renderRowAvatarHeader() }

              <th className='identifier' style={this.data.style.hideOnPhone}>Identifier</th>
              <th className='name'>Name</th>
              <th className='gender'>Gender</th>
              <th className='birthdate' style={{minWidth: '100px'}}>Birthdate</th>
              <th className='maritalStatus' style={this.data.style.hideOnPhone}>Marital Status</th>
              <th className='language' style={this.data.style.hideOnPhone}>Language</th>
              <th className='isActive' style={this.data.style.hideOnPhone}>Active</th>
              
              { this.renderSpeciesHeader(this.props.displaySpecies) }
              { this.renderSendButtonHeader() }
            </tr>
          </thead>
          <tbody>
            { tableRows }
          </tbody>
        </Table>
        { footer }
      </div>
    );
  }
}

ClaimTable.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  showSendButton: PropTypes.bool,
  displaySpecies: PropTypes.bool,
  noDataMessagePadding: PropTypes.number
};

ReactMixin(ClaimTable.prototype, ReactMeteorData);
export default ClaimTable;