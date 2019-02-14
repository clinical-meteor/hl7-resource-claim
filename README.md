##  clinical:hl7-resource-claim   

#### Licensing  
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)


#### Integration & Verification Tests  
[![CircleCI](https://circleci.com/gh/clinical-meteor/hl7-resource-claim/tree/master.svg?style=svg)](https://circleci.com/gh/clinical-meteor/hl7-resource-claim/tree/master)


#### API Reference  
The resource in this package implements Claim resource schema, specified at [https://www.hl7.org/fhir/DSTU2/claim.html](https://www.hl7.org/fhir/DSTU2/claim.html). 



#### Installation  

```bash
meteor add clinical:hl7-resource-claim
```

You may also wish to install the `autopublish` package, which will set up a default publication/subscription of the Patients collection for logged in users.  You will need to remove the package before going into production, however.

```bash
meteor add clinical:autopublish  
```



#### Example    

```js
var newClaim = {
  'name' : [
    {
      'text' : 'Jane Doe',
      'given' : 'Jane',
      'family' : 'Doe',
      'resourceType' : 'HumanName'
    }
  ],
  'active' : true,
  'gender' : 'female',
  'identifier' : [{
      'use' : 'usual',
      'type' : {
        text: 'Medical record number',
        'coding' : [
          {
            'system' : 'http://hl7.org/fhir/v2/0203',
            'code' : 'MR'
          }
        ]
      },
      'system' : 'urn:oid:1.2.36.146.595.217.0.1',
      'value' : '123',
      'period' : {}
   }],
  'birthdate' : new Date(1970, 1, 25),
  'resourceType' : 'Claim'
};
Patients.insert(newPatient);
```


#### Extending the Schema  

If you have extra fields that you would like to attach to the schema, extend the schema like so:  

```js
ExtendedPatientSchema = new SimpleSchema([
  PatientSchema,
  {
    "createdAt": {
      "type": Date,
      "optional": true
    }
  }
]);
Patients.attachSchema( ExtendedPatientSchema );
```


#### Initialize a Sample Claim  

Call the `initializePatient` method to create a sample claim in the Patients collection.

```js
Meteor.startup(function(){
  Meteor.call('initializePatient');
})
```

#### Server Methods  

This package supports `createPatient`, `initializePatient`, and `dropPatient` methods.


#### REST API Points    

This package supports the following REST API endpoints.  All endpoints require an OAuth token.  

```
GET    /fhir-1.6.0/Claim/:id    
GET    /fhir-1.6.0/Claim/:id/_history  
PUT    /fhir-1.6.0/Claim/:id  
GET    /fhir-1.6.0/Claim  
POST   /fhir-1.6.0/Claim/:param  
POST   /fhir-1.6.0/Claim  
DELETE /fhir-1.6.0/Claim/:id
```

If you would like to test the REST API without the OAuth infrastructure, launch the app with the `NOAUTH` environment variable, or set `Meteor.settings.private.disableOauth` to true in you settings file.

```bash
NOAUTH=true meteor
```

