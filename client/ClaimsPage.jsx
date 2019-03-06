import { CardText, CardTitle } from 'material-ui/Card';
import { Tab, Tabs } from 'material-ui/Tabs';
import { Glass, GlassCard, VerticalCanvas, FullPageCanvas } from 'meteor/clinical:glass-ui';

import ClaimDetail from './ClaimDetail';
import ClaimsTable from './ClaimsTable';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

let defaultClaim = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};
Session.setDefault('claimFormData', defaultClaim);
Session.setDefault('claimSearchFilter', '');
Session.setDefault('selectedClaimId', false);
Session.setDefault('fhirVersion', 'v1.0.2');

export class ClaimsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('claimPageTabIndex'),
      claimSearchFilter: Session.get('claimSearchFilter'),
      fhirVersion: Session.get('fhirVersion'),
      selectedClaimId: Session.get("selectedClaimId"),
      selectedClaim: false
    };

    
    if (Session.get('selectedClaimId')){
      data.selectedClaim = Claims.findOne({_id: Session.get('selectedClaimId')});
    } else {
      data.selectedClaim = false;
    }


    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    if(process.env.NODE_ENV === "test") console.log("ClaimsPage[data]", data);
    return data;
  }

  handleTabChange(index){
    Session.set('claimPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedClaimId', false);
    Session.set('claimUpsert', false);
  }

  render() {
    console.log('React.version: ' + React.version);
    return (
      <div id="claimsPage">
        <FullPageCanvas>
          <GlassCard height="auto">
            <CardTitle
              title="Claims"
            />
            <CardText>
              <Tabs id='claimsPageTabs' default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
                 <Tab className="newClaimTab" label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0}>
                   <ClaimDetail 
                      fhirVersion={ this.data.fhirVersion }
                      id='newClaim' />
                 </Tab>
                 <Tab className="claimListTab" label='Claims' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                   <ClaimsTable 
                      showBarcodes={true} 
                      showAvatars={true} 
                      noDataMessagePadding={100}
                      />
                 </Tab>
                 <Tab className="claimDetailTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                   <ClaimDetail 
                      id='claimDetails' 
                      fhirVersion={ this.data.fhirVersion }
                      claim={ this.data.selectedClaim }
                      claimId={ this.data.selectedClaimId }
                    />
                 </Tab>
             </Tabs>


            </CardText>
          </GlassCard>
        </FullPageCanvas>
      </div>
    );
  }
}



ReactMixin(ClaimsPage.prototype, ReactMeteorData);

export default ClaimsPage;