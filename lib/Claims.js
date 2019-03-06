if(Package['clinical:autopublish']){
  console.log("*****************************************************************************")
  console.log("HIPAA WARNING:  Your app has the 'clinical-autopublish' package installed.");
  console.log("Any protected health information (PHI) stored in this app should be audited."); 
  console.log("Please consider writing secure publish/subscribe functions and uninstalling.");  
  console.log("");  
  console.log("meteor remove clinical:autopublish");  
  console.log("");  
}
if(Package['autopublish']){
  console.log("*****************************************************************************")
  console.log("HIPAA WARNING:  DO NOT STORE PROTECTED HEALTH INFORMATION IN THIS APP. ");  
  console.log("Your application has the 'autopublish' package installed.  Please uninstall.");
  console.log("");  
  console.log("meteor remove autopublish");  
  console.log("meteor add clinical:autopublish");  
  console.log("");  
}


import { BaseModel } from 'meteor/clinical:base-model';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { BaseSchema, DomainResourceSchema, HumanNameSchema, IdentifierSchema, ContactPointSchema, AddressSchema, MoneySchema } from 'meteor/clinical:hl7-resource-datatypes';



// create the object using our BaseModel
Claim = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
Claim.prototype._collection = Claims;


// // Create a persistent data store for addresses to be stored.
// // HL7.Resources.Claims = new Mongo.Collection('HL7.Resources.Claims');

if(typeof Claims === 'undefined'){
  if(Package['clinical:autopublish']){
    Claims = new Mongo.Collection('Claims');
  } else if(Package['clinical:desktop-publish']){
    Claims = new Mongo.Collection('Claims');
  } else {
    Claims = new Mongo.Collection('Claims', {connection: null});
  }
}


//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Claims._transform = function (document) {
  return new Claim(document);
};


ClaimSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "Claim"
    },
  "identifier" : {
    optional: true,
    type:  Array
    }, 
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    }, 
  "status" : {
    optional: true,
    type:  String
    }, 
  "type" : {
    optional: true,
    type:  CodeableConceptSchema
    }, 
  "subType" : {
    optional: true,
    type:  CodeableConceptSchema
    }, 
  "use" : {
    optional: true,
    type:  String
    }, 
  "patient" : {
    optional: true,
    type: ReferenceSchema
    }, 
  "billablePeriod" : {
    optional: true,
    type: PeriodSchema
    }, 
  "created" : {
    optional: true,
    type:  Date
    }, 
  "enterer" : {
    optional: true,
    type: ReferenceSchema
    }, 
  "insurer" : {
    optional: true,
    type:  ReferenceSchema 
    }, 
  "provider" : {
    optional: true,
    type:  ReferenceSchema 
    }, 
  "priority" : {
    optional: true,
    type:  CodeableConcept
    }, 
  "fundsReserve" : {
    optional: true,
    type:  CodeableConcept
    }, 
  "related" : {
    optional: true,
    type:  Array
    }, 
  "related.$" : {
    optional: true,
    type:  Object 
    }, 
  "related.$.claim" : {
    optional: true,
    type:  ReferenceSchema 
    }, 
  "related.$.relationship" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "related.$.reference" : {
    optional: true,
    type:  IdentifierSchema 
    },
  "prescription" : {
    optional: true,
    type:  ReferenceSchema 
    }, 
  "originalPrescription" : {
    optional: true,
    type:  ReferenceSchema 
    }, 
  "payee" : {
    optional: true,
    type:  Object 
    }, 
  "payee.type" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "payee.party" : {
    optional: true,
    type:  ReferenceSchema 
    },
  "referral" : {
    optional: true,
    type:  ReferenceSchema 
    }, 
  "facility" : {
    optional: true,
    type:  ReferenceSchema 
    }, 
  "careTeam" : {
    optional: true,
    type:  Array
    }, 
  "careTeam.$" : {
    optional: true,
    type:  Object
    }, 
  "careTeam.$.sequence" : {
    optional: true,
    type:  Number
    }, 
  "careTeam.$.provider" : {
    optional: true,
    type:  ReferenceSchema 
    }, 
  "careTeam.$.responsible" : {
    optional: true,
    type:  Boolean
    }, 
  "careTeam.$.role" : {
    optional: true,
    type:  CodeableConceptSchema
    }, 
  "careTeam.$.qualification" : {
    optional: true,
    type:  CodeableConceptSchema 
    },
  
  "supportingInfo" : {
    optional: true,
    type:  Array
    }, 
  "supportingInfo.$" : {
    optional: true,
    type:  Object
    },         
  "supportingInfo.$.sequence" : {
    optional: true,
    type:  Number
    }, 
  "supportingInfo.$.category" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "supportingInfo.$.code" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "supportingInfo.$.timingDate" : {
    optional: true,
    type:  Date
    },
  "supportingInfo.$.timingPeriod" : {
    optional: true,
    type:  PeriodSchema
    }, 
  "supportingInfo.$.valueBoolean" : {
    optional: true,
    type:  Boolean
    },
  "supportingInfo.$.valueString" : {
    optional: true,
    type:  String
    },
  "supportingInfo.$.valueQuantity" : {
    optional: true,
    type:  QuantitySchema 
    },
  "supportingInfo.$.valueAttachment" : {
    optional: true,
    type:  AttachmentSchema 
    },
  "supportingInfo.$.valueReference" : {
    optional: true,
    type:  ReferenceSchema 
    },
  "supportingInfo.$.reason" : {
    optional: true,
    type:  CodeableConceptSchema 
    },

  "diagnosis" : {
    optional: true,
    type:  Array
    },
  "diagnosis.$" : {
    optional: true,
    type:  Object
    },      
  "diagnosis.$.sequence" : {
    optional: true,
    type:  Number
    },
  "diagnosis.$.diagnosisCodeableConcept" : {
    optional: true,
    type:  CodeableConceptSchema 
    },
  "diagnosis.$.diagnosisReference" : {
    optional: true,
    type:  ReferenceSchema 
    },
  "diagnosis.$.type" : {
    optional: true,
    type: Array
    }, 
  "diagnosis.$.type.$" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "diagnosis.$.onAdmission" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "diagnosis.$.packageCode" : {
    optional: true,
    type:  CodeableConceptSchema 
    },


  "procedure" : {
    optional: true,
    type:  Array
    }, 
  "procedure.$" : {
    optional: true,
    type:  Object
    }, 
  "procedure.$.sequence" : {
    optional: true,
    type:  Number
    }, 
  "procedure.$.type" : {
    optional: true,
    type: Array
    }, 
  "procedure.$.type.$" : {
    optional: true,
    type:  CodeableConceptSchema
    }, 
  "procedure.$.date" : {
    optional: true,
    type:  Date, 
    },  
  "procedure.$.procedureCodeableConcept" : {
    optional: true,
    type:  CodeableConceptSchema 
    },
  "procedure.$.procedureReference" : {
    optional: true,
    type:  ReferenceSchema 
    },
  "procedure.$.udi" : {
    optional: true,
    type: Array
    },
  "procedure.$.udi.$" : {
    optional: true,
    type:  ReferenceSchema 
    },



  "insurance" : {
    optional: true,
    type:  Array
    }, 

  "insurance.$" : {
    optional: true,
    type:  Object
    }, 
  "insurance.$.sequence" : {
    optional: true,
    type:  Number
    }, 
  "insurance.$.focal" : {
    optional: true,
    type:  Boolean
    }, 
  "insurance.$.identifier" : {
    optional: true,
    type:  IdentifierSchema 
    }, 
  "insurance.$.coverage" : {
    optional: true,
    type:  ReferenceSchema 
    }, 
  "insurance.$.businessArrangement" : {
    optional: true,
    type:  String
    }, 
  "insurance.$.preAuthRef" : {
    optional: true,
    type:  Array
    }, 
  "insurance.$.preAuthRef.$" : {
    optional: true,
    type:  String
    }, 
  "insurance.$.claimResponse" : {
    optional: true,
    type:  ReferenceSchema 
    },
    
  "accident" : {
    optional: true,
    type:  Object
    }, 
  "accident.date" : {
    optional: true,
    type:  Date
    }, 
  "accident.type" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "accident.locationAddress" : {
    optional: true,
    type: AddressSchema 
    },
  "accident.locationReference" : {
    optional: true,
    type:  ReferenceSchema 
    },


  "item" : {
    optional: true,
    type:  Array
    }, 
  "item.$" : {
    optional: true,
    type:  Object
    }, 
  "item.$.sequence" : {
    optional: true,
    type:  Number
    }, 
  "item.$.careTeamSequence" : {
    optional: true,
    type:  Array
    }, 
  "item.$.careTeamSequence.$" : {
    optional: true,
    type:  Number
    }, 
  "item.$.diagnosisSequence" : {
    optional: true,
    type:  Array
    }, 
  "item.$.diagnosisSequence.$" : {
    optional: true,
    type:  Number
    }, 
  "item.$.procedureSequence" : {
    optional: true,
    type:  Array
    }, 
  "item.$.procedureSequence.$" : {
    optional: true,
    type:  Number
    }, 
  "item.$.informationSequence" : {
    optional: true,
    type:  Array
    }, 
  "item.$.informationSequence.$" : {
    optional: true,
    type:  Number
    }, 
  "item.$.revenue" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "item.$.category" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "item.$.productOrService" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "item.$.modifier" : {
    optional: true,
    type: Array
    }, 
  "item.$.modifier.$" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "item.$.programCode" : {
    optional: true,
    type: Array
    }, 
  "item.$.programCode.$" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "item.$.servicedDate" : {
    optional: true,
    type:  Date
    },
  "item.$.servicedPeriod" : {
    optional: true,
    type:  PeriodSchema 
    },
  "item.$.locationCodeableConcept" : {
    optional: true,
    type:  CodeableConceptSchema 
    },
  "item.$.locationAddress" : {
    optional: true,
    type:  AddressSchema 
    },
  "item.$.locationReference" : {
    optional: true,
    type:  ReferenceSchema 
    },
  "item.$.quantity" : {
    optional: true,
    type:  QuantitySchema
    }, 
  "item.$.unitPrice" : {
    optional: true,
    type:  MoneySchema 
    }, 
  "item.$.factor" : {
    optional: true,
    type:  Number
    }, 
  "item.$.net" : {
    optional: true,
    type:  MoneySchema
    }, 
  "item.$.udi" : {
    optional: true,
    type: Array
    }, 
  "item.$.udi.$" : {
    optional: true,
    type:  ReferenceSchema 
    }, 
  "item.$.bodySite" : {
    optional: true,
    type:  CodeableConceptSchema
    }, 
  "item.$.subSite" : {
    optional: true,
    type: Array
    }, 
  "item.$.subSite.$" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "item.$.encounter" : {
    optional: true,
    type: Array
    }, 
  "item.$.encounter.$" : {
    optional: true,
    type:  ReferenceSchema 
    }, 

  "item.$.detail" : {
    optional: true,
    type:  Array
    }, 
  "item.$.detail.$" : {
    optional: true,
    type:  Object
    },       
  "item.$.detail.$.sequence" : {
    optional: true,
    type:  Number
    }, 
  "item.$.detail.$.revenue" : {
    optional: true,
    type:  CodeableConceptSchema
    }, 
  "item.$.detail.$.category" : {
    optional: true,
    type:  CodeableConceptSchema
    }, 
  "item.$.detail.$.productOrService" : {
    optional: true,
    type:  CodeableConceptSchema
    }, 
  "item.$.detail.$.modifier" : {
    optional: true,
    type:  Array
    }, 
  "item.$.detail.$.modifier.$" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "item.$.detail.$.programCode" : {
    optional: true,
    type:  Array
    }, 
  "item.$.detail.$.programCode.$" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "item.$.detail.$.quantity" : {
    optional: true,
    type:  QuantitySchema
    }, 
  "item.$.detail.$.unitPrice" : {
    optional: true,
    type:  MoneySchema
    }, 
  "item.$.detail.$.factor" : {
    optional: true,
    type:  Number
    }, 
  "item.$.detail.$.net" : {
    optional: true,
    type:  MoneySchema
    }, 
  "item.$.detail.$.udi" : {
    optional: true,
    type:  Array
    }, 
  "item.$.detail.$.udi.$" : {
    optional: true,
    type:  ReferenceSchema 
    }, 

    "item.$.detail.$.subDetail" : {
    optional: true,
    type:  Array
    }, 
  "item.$.detail.$.subDetail.$" : {
    optional: true,
    type:  Object
    },       
  "item.$.detail.$.subDetail.$.sequence" : {
    optional: true,
    type:  Number
    }, 
  "item.$.detail.$.subDetail.$.revenue" : {
    optional: true,
    type:  CodeableConceptSchema
    }, 
  "item.$.detail.$.subDetail.$.category" : {
    optional: true,
    type:  CodeableConceptSchema
    }, 
  "item.$.detail.$.subDetail.$.productOrService" : {
    optional: true,
    type:  CodeableConceptSchema
    }, 
  "item.$.detail.$.subDetail.$.modifier" : {
    optional: true,
    type:  Array
    }, 
  "item.$.detail.$.subDetail.$.modifier.$" : {
    optional: true,
    type:  CodeableConceptSchema 
    }, 
  "item.$.detail.$.subDetail.$.programCode" : {
    optional: true,
    type:  Array
    }, 
  "item.$.detail.$.subDetail.$.programCode.$" : {
    optional: true,
    type:  CodeableConceptSchema
    }, 
  "item.$.detail.$.subDetail.$.quantity" : {
    optional: true,
    type:  QuantitySchema 
    }, 
  "item.$.detail.$.subDetail.$.unitPrice" : {
    optional: true,
    type:  MoneySchema
    }, 
  "item.$.detail.$.subDetail.$.factor" : {
    optional: true,
    type:  Number
    }, 
  "item.$.detail.$.subDetail.$.net" : {
    optional: true,
    type:  MoneySchema
    }, 
  "item.$.detail.$.subDetail.$.udi" : {
    optional: true,
    type:  Array
    }, 
  "item.$.detail.$.subDetail.$.udi.$" : {
    optional: true,
    type:  ReferenceSchema 
    }, 
  "total" : {
    optional: true,
    type:  MoneySchema 
    }
});








// BaseSchema.extend(ClaimSchema);
// DomainResourceSchema.extend(ClaimSchema);

Claims.attachSchema(ClaimSchema);


Claim.prototype.toFhir = function(){
  console.log('Claim.toFhir()');



  return EJSON.stringify(this.name);
}

/**
 * @summary Search the Claims collection for a specific Meteor.userId().
 * @memberOf Claims
 * @name findUserId
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let patients = Claims.findUserId(Meteor.userId());
 *  let patient = patients[0];
 * ```
 */

Claims.findUserId = function (userId) {
  process.env.TRACE && console.log("Claims.findUserId()");
  return Claims.find({'identifier.value': userId});
};

/**
 * @summary Search the Claims collection for a specific Meteor.userId().
 * @memberOf Claims
 * @name findOneUserId
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let patient = Claims.findOneUserId(Meteor.userId());
 * ```
 */

Claims.findOneUserId = function (userId) {
  process.env.TRACE && console.log("Claims.findOneUserId()");  
  return Claims.findOne({'identifier.value': userId});
};
/**
 * @summary Search the Claims collection for a specific Meteor.userId().
 * @memberOf Claims
 * @name findMrn
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let patients = Claims.findMrn('12345').fetch();
 * ```
 */

Claims.findMrn = function (userId) {
  process.env.TRACE && console.log("Claims.findMrn()");  
  return Claims.find({'identifier.value': userId});
};

/**
 * @summary Search the Claims collection for a specific Meteor.userId().
 * @memberOf Claims
 * @name findMrn
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let patients = Claims.findMrn('12345').fetch();
 * ```
 */

Claims.fetchBundle = function (query, parameters, callback) {
  process.env.TRACE && console.log("Claims.fetchBundle()");  
  var patientArray = Claims.find(query, parameters, callback).map(function(patient){
    patient.id = patient._id;
    delete patient._document;
    return patient;
  });

  // console.log("patientArray", patientArray);

  var result = Bundle.generate(patientArray);

  // console.log("result", result.entry[0]);

  return result;
};


/**
 * @summary This function takes a FHIR resource and prepares it for storage in Mongo.
 * @memberOf Claims
 * @name toMongo
 * @version 1.6.0
 * @returns { Claim }
 * @example
 * ```js
 *  let patients = Claims.toMongo('12345').fetch();
 * ```
 */

Claims.toMongo = function (originalClaim) {
  var mongoRecord;
  process.env.TRACE && console.log("Claims.toMongo()");  

  if (originalClaim.identifier) {
    originalClaim.identifier.forEach(function(identifier){
      if (identifier.period) {
        if (identifier.period.start) {
          var startArray = identifier.period.start.split('-');
          identifier.period.start = new Date(startArray[0], startArray[1] - 1, startArray[2]);
        }
        if (identifier.period.end) {
          var endArray = identifier.period.end.split('-');
          identifier.period.end = new Date(startArray[0], startArray[1] - 1, startArray[2]);
        }
      }
    });
  }

  return originalClaim;
};





/**
 * @summary Similar to toMongo(), this function prepares a FHIR record for storage in the Mongo database.  The difference being, that this assumes there is already an existing record.
 * @memberOf Claims
 * @name prepForUpdate
 * @version 1.6.0
 * @returns { Object }
 * @example
 * ```js
 *  let patients = Claims.findMrn('12345').fetch();
 * ```
 */

Claims.prepForUpdate = function (patient) {
  process.env.TRACE && console.log("Claims.prepForUpdate()");  

  if (patient.name && patient.name[0]) {
    //console.log("patient.name", patient.name);

    patient.name.forEach(function(name){
      name.resourceType = "HumanName";
    });
  }

  if (patient.telecom && patient.telecom[0]) {
    //console.log("patient.telecom", patient.telecom);
    patient.telecom.forEach(function(telecom){
      telecom.resourceType = "ContactPoint";
    });
  }

  if (patient.address && patient.address[0]) {
    //console.log("patient.address", patient.address);
    patient.address.forEach(function(address){
      address.resourceType = "Address";
    });
  }

  if (patient.contact && patient.contact[0]) {
    //console.log("patient.contact", patient.contact);

    patient.contact.forEach(function(contact){
      if (contact.name) {
        contact.name.resourceType = "HumanName";
      }

      if (contact.telecom && contact.telecom[0]) {
        contact.telecom.forEach(function(telecom){
          telecom.resourceType = "ContactPoint";
        });
      }

    });
  }

  return patient;
};


/**
 * @summary Scrubbing the patient; make sure it conforms to v1.6.0
 * @memberOf Claims
 * @name scrub
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let patients = Claims.findMrn('12345').fetch();
 * ```
 */

Claims.prepForFhirTransfer = function (patient) {
  process.env.TRACE && console.log("Claims.prepForFhirTransfer()");  


  // FHIR has complicated and unusual rules about dates in order
  // to support situations where a family member might report on a patient's
  // date of birth, but not know the year of birth; and the other way around
  if (patient.birthDate) {
    patient.birthDate = moment(patient.birthDate).format("YYYY-MM-DD");
  }


  if (patient.name && patient.name[0]) {
    //console.log("patient.name", patient.name);

    patient.name.forEach(function(name){
      delete name.resourceType;
    });
  }

  if (patient.telecom && patient.telecom[0]) {
    //console.log("patient.telecom", patient.telecom);
    patient.telecom.forEach(function(telecom){
      delete telecom.resourceType;
    });
  }

  if (patient.address && patient.address[0]) {
    //console.log("patient.address", patient.address);
    patient.address.forEach(function(address){
      delete address.resourceType;
    });
  }

  if (patient.contact && patient.contact[0]) {
    //console.log("patient.contact", patient.contact);

    patient.contact.forEach(function(contact){

      console.log("contact", contact);


      if (contact.name && contact.name.resourceType) {
        //console.log("patient.contact.name", contact.name);
        delete contact.name.resourceType;
      }

      if (contact.telecom && contact.telecom[0]) {
        contact.telecom.forEach(function(telecom){
          delete telecom.resourceType;
        });
      }

    });
  }

  //console.log("Claims.prepForBundle()", patient);

  return patient;
};

/**
 * @summary The displayed name of the patient.
 * @memberOf Claim
 * @name displayName
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * ```
 */

Claim.prototype.displayName = function () {
  process.env.TRACE && console.log("Claims.displayName()");  

  if (this.name && this.name[0]) {
    return this.name[0].text;
  }
};


/**
 * @summary The displayed Meteor.userId() of the patient.
 * @memberOf Claim
 * @name userId
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * ```
 */

Claim.prototype.userId = function () {
  process.env.TRACE && console.log("Claims.userId()");  

  var result = null;
  if (this.extension) {
    this.extension.forEach(function(extension){
      if (extension.url === "Meteor.userId()") {
        result = extension.valueString;
      }
    });
  }
  return result;
};



/**
 * @summary The displayed Meteor.userId() of the patient.
 * @memberOf Claim
 * @name userId
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * ```
 */


/**
 * @summary Anonymize the patient record
 * @memberOf Claim
 * @name removeProtectedInfo
 * @version 1.2.3
 * @returns {Object}
 * @example
 * ```js
 * ```
 */

Claim.prototype.removeProtectedInfo = function (options) {
  process.env.TRACE && console.log("Claims.anonymize()", this);  

  console.log("Claims.anonymize()");  

  // 1. Names
  if(this.name && this.name[0]){
    var anonymizedName = this.name[0];

    if(this.name[0].family){
      anonymizedName.family = '';
    }
    if(this.name[0].given && this.name[0].given[0]){
      anonymizedName.given = [];          
    }
    if(this.name[0].text){
      anonymizedName.text = '';
    }

    this.name = [];
    this.name.push(anonymizedName);
  }

  // 3.  dates


  // 4. Phone numbers
  // 5.  Fax Numbers
  // 6.  Identifiers
  // 7.  Medical Record Nubers
  // 17.  Photos

  return this;
}


/**
 * @summary Anonymize the patient record
 * @memberOf Claim
 * @name anonymize
 * @version 1.2.3
 * @returns {Object}
 * @example
 * ```js
 * ```
 */

Claim.prototype.anonymize = function () {
  process.env.TRACE && console.log("Claims.hash()", this);  

  console.log("Claims.hash()");  


  if(this.name && this.name[0]){
    var anonymizedName = this.name[0];

    if(this.name[0].family){
      anonymizedName.family = Anon.name(this.name[0].family);        
    }
    if(this.name[0].given && this.name[0].given[0]){
      var secretGiven = Anon.name(this.name[0].given[0]);
      anonymizedName.given = [];      
      anonymizedName.given.push(secretGiven);
    }
    if(this.name[0].text){
      anonymizedName.text = Anon.name(this.name[0].text);
    }

    this.name = [];
    this.name.push(anonymizedName);
  }

  return this;
}


Anon = {
  name: function(name){
    var anonName = '';
    for(var i = 0; i < name.length; i++){
      if(name[i] === " "){
        anonName = anonName + " ";
      } else {
        anonName = anonName + "*";
      }
    }
    return anonName;
  },
  phone: function(){
    return "NNN-NNN-NNNN";
  },
  ssn: function(){
    return "###-##-####"
  }
}


export { Claim, Claims, ClaimSchema };
