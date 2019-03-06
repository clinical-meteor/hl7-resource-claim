import { Random } from 'meteor/random';
import { Claim, Claims, ClaimSchema } from './Claims.js';
import faker from 'faker';

Meteor.methods({
    'Claim/initialize': function(number){
        console.log('Initializing a default claim...')

        if(!number){
          number = 1;
        }
        let newClaim = {
            "resourceType": "Claim",
            "id": "860150",
            "text": {
              "status": "generated",
              "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">A human-readable rendering of the Claim</div>"
            },
            "identifier": [
              {
                "system": "http://happypdocs.com/claim",
                "value": "8612345"
              }
            ],
            "status": "active",
            "type": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/claim-type",
                  "code": "professional"
                }
              ]
            },
            "use": "claim",
            "patient": {
              "reference": "Patient/1"
            },
            "created": "2014-08-16",
            "insurer": {
              "reference": "Organization/2"
            },
            "provider": {
              "reference": "Organization/1"
            },
            "priority": {
              "coding": [
                {
                  "code": "normal"
                }
              ]
            },
            "payee": {
              "type": {
                "coding": [
                  {
                    "code": "provider"
                  }
                ]
              }
            },
            "careTeam": [
              {
                "sequence": 1,
                "provider": {
                  "reference": "Practitioner/example"
                }
              }
            ],
            "diagnosis": [
              {
                "sequence": 1,
                "diagnosisCodeableConcept": {
                  "coding": [
                    {
                      "code": "654456"
                    }
                  ]
                }
              }
            ],
            "insurance": [
              {
                "sequence": 1,
                "focal": true,
                "coverage": {
                  "reference": "Coverage/9876B1"
                }
              }
            ],
            "item": [
              {
                "sequence": 1,
                "careTeamSequence": [
                  1
                ],
                "productOrService": {
                  "coding": [
                    {
                      "system": "http://hl7.org/fhir/ex-serviceproduct",
                      "code": "exam"
                    }
                  ]
                },
                "servicedDate": "2014-08-16",
                "unitPrice": {
                  "value": 75.00,
                  "currency": "USD"
                },
                "net": {
                  "value": 75.00,
                  "currency": "USD"
                }
              }
            ]
          };

          for (let index = 0; index < number; index++) {
            newClaim.patient.reference = 'Patient/' + Random.id();
            newClaim.patient.display = faker.name.findName();
            
            Meteor.call('Claim/create', newClaim);            
          }

    },
    'Claim/create': function(newClaim){
      console.log('Dropping claims...');
      check(newClaim, Object);

      Claims.insert(newClaim);
    },
    'Claim/drop': function(){
      console.log('Dropping claims...')
      Claims.remove({});
    }
})