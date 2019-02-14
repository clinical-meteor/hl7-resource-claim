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
import { BaseSchema, DomainResourceSchema, HumanNameSchema, IdentifierSchema, ContactPointSchema, AddressSchema } from 'meteor/clinical:hl7-resource-datatypes';



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




ClaimDstu2 = new SimpleSchema({
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
  "active" : {
    type: Boolean,
    optional: true,
    defaultValue: true
    },
  "name" : {
    optional: true,
    type: Array
    },
  "name.$" : {
    optional: true,
    type: HumanNameSchema 
    },
  "telecom" : {
    optional: true,
    type: Array
    },
  "telecom.$" : {
    optional: true,
    type: ContactPointSchema
    },
  "gender" : {
    optional: true,
    allowedValues: ['male', 'female', 'other', 'unknown'],
    type: String
    },
  "birthDate" : {
    optional: true,
    type: String,
  },
  "_birthDate" : {
      optional: true,
      type: Date,
      autoValue: function() {
        var dateArray = [];
        var date;
        var value = this.field('birthDate').value;
        if(typeof value === 'string'){
          dateArray = value.split('-');
          date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2])
        }
        
        if(date){
          return date;
        }
      }
    },
  "deceasedBoolean" : {
    optional: true,
    type: Boolean
    },
  "deceasedDateTime" : {
    optional: true,
    type: Date
    },
  "address" : {
    optional: true,
    type: Array
    },
  "address.$" : {
    optional: true,
    type: AddressSchema 
    },
  "maritalStatus" : {
    optional: true,
    type: CodeableConceptSchema
    },
  "multipleBirthBoolean" : {
    optional: true,
    type: Boolean
    },
  "multipleBirthInteger" : {
    optional: true,
    type: Number
    },
  "photo" : {
    optional: true,
    type: Array
    },
  "photo.$" : {
    optional: true,
    type: AttachmentSchema 
    },

  "contact" : {
    optional: true,
    type:  Array
    },
  "contact.$" : {
    optional: true,
    type:  Object 
    },    
  "contact.$.relationship" : {
    optional: true,
    type: Array
    },
  "contact.$.relationship.$" : {
    optional: true,
    type: CodeableConceptSchema 
    },
  "contact.$.name" : {
    optional: true,
    type: HumanNameSchema
    },
  "contact.$.telecom" : {
    optional: true,
    type: Array
    },
  "contact.$.telecom.$" : {
    optional: true,
    type: ContactPointSchema
    },
  "contact.$.address" : {
    optional: true,
    type: Array
    },
  "contact.$.address.$" : {
    optional: true,
    type: AddressSchema
    },
  "contact.$.gender" : {
    optional: true,
    allowedValues: ['male', 'female', 'other', 'unknown'],
    type: Code
    },
  "contact.$.organization" : {
    optional: true,
    type: String
    },
  "contact.$.period" : {
    optional: true,
    type: PeriodSchema
    },

  "animal" : {
    optional: true,
    type: Object
    },
  "animal.species" : {
    type: String
    //type: CodeableConceptSchema
    },
  "animal.breed" : {
    optional: true,
    type: CodeableConceptSchema
    },
  "animal.genderStatus" : {
    optional: true,
    type: CodeableConceptSchema
    },

  "communication" : {
    optional: true,
    type:  Array
    },
  "communication.$" : {
    optional: true,
    type:  Object 
    },    
  "communication.$.language" : {
    type: CodeableConceptSchema
    },
  "communication.$.preferred" : {
    optional: true,
    type: Boolean
    },
  "generalPractitioner" : {
    optional: true,
    type: Array
    },
  "generalPractitioner.$" : {
    optional: true,
    type: ReferenceSchema
    },
  "managingOrganization" : {
    optional: true,
    type: ReferenceSchema
    },

  "link" : {
    optional: true,
    type:  Array
    },
  "link.$" : {
    optional: true,
    type:  Object 
    },   
  "link.$.other" : {
    type: ReferenceSchema
    },
  "link.$.type" : {
    allowedValues: ['replacee', 'refer', 'seealso'],
    type: Code
    },
  "test" : {
    optional: true,
    type: Boolean
    }
});





ClaimStu3 = new SimpleSchema({
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
  "active" : {
    type: Boolean,
    optional: true,
    defaultValue: true
    },
  "name" : {
    optional: true,
    type: Array
    },
  "name.$" : {
    optional: true,
    type: HumanNameSchema 
    },
  "telecom" : {
    optional: true,
    type: Array
    },
  "telecom.$" : {
    optional: true,
    type: ContactPointSchema
    },
  "gender" : {
    optional: true,
    allowedValues: ['male', 'female', 'other', 'unknown'],
    type: String
    },
  "birthDate" : {
    optional: true,
    type: String,
  },
  "_birthDate" : {
      optional: true,
      type: Date,
      autoValue: function() {
        var dateArray = [];
        var date;
        var value = this.field('birthDate').value;
        if(typeof value === 'string'){
          dateArray = value.split('-');
          date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2])
        }
        
        if(date){
          return date;
        }
      }
    },
  "deceasedBoolean" : {
    optional: true,
    type: Boolean
    },
  "deceasedDateTime" : {
    optional: true,
    type: Date
    },
  "address" : {
    optional: true,
    type: Array
    },
  "address.$" : {
    optional: true,
    type: AddressSchema 
    },
  "maritalStatus" : {
    optional: true,
    type: CodeableConceptSchema
    },
  "multipleBirthBoolean" : {
    optional: true,
    type: Boolean
    },
  "multipleBirthInteger" : {
    optional: true,
    type: Number
    },
  "photo" : {
    optional: true,
    type: Array
    },
  "photo.$" : {
    optional: true,
    type: AttachmentSchema 
    },

  "contact" : {
    optional: true,
    type:  Array
    },
  "contact.$" : {
    optional: true,
    type:  Object 
    },    
  "contact.$.relationship" : {
    optional: true,
    type: Array
    },
  "contact.$.relationship.$" : {
    optional: true,
    type: CodeableConceptSchema 
    },
  "contact.$.name" : {
    optional: true,
    type: HumanNameSchema
    },
  "contact.$.telecom" : {
    optional: true,
    type: Array
    },
  "contact.$.telecom.$" : {
    optional: true,
    type: ContactPointSchema
    },
  "contact.$.address" : {
    optional: true,
    type: Array
    },
  "contact.$.address.$" : {
    optional: true,
    type: AddressSchema
    },
  "contact.$.gender" : {
    optional: true,
    allowedValues: ['male', 'female', 'other', 'unknown'],
    type: Code
    },
  "contact.$.organization" : {
    optional: true,
    type: String
    },
  "contact.$.period" : {
    optional: true,
    type: PeriodSchema
    },

  "animal" : {
    optional: true,
    type: Object
    },
  "animal.species" : {
    type: String
    //type: CodeableConceptSchema
    },
  "animal.breed" : {
    optional: true,
    type: CodeableConceptSchema
    },
  "animal.genderStatus" : {
    optional: true,
    type: CodeableConceptSchema
    },

  "communication" : {
    optional: true,
    type:  Array
    },
  "communication.$" : {
    optional: true,
    type:  Object 
    },    
  "communication.$.language" : {
    type: CodeableConceptSchema
    },
  "communication.$.preferred" : {
    optional: true,
    type: Boolean
    },
  "generalPractitioner" : {
    optional: true,
    type: Array
    },
  "generalPractitioner.$" : {
    optional: true,
    type: ReferenceSchema
    },
  "managingOrganization" : {
    optional: true,
    type: ReferenceSchema
    },

  "link" : {
    optional: true,
    type:  Array
    },
  "link.$" : {
    optional: true,
    type:  Object 
    },   
  "link.$.other" : {
    type: ReferenceSchema
    },
  "link.$.type" : {
    allowedValues: ['replacee', 'refer', 'seealso'],
    type: Code
    },
  "test" : {
    optional: true,
    type: Boolean
    }
});




ClaimSchema = ClaimDstu2;

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
 * @summary This function takes a DTSU2 resource and returns it as STU3.  i.e. it converts from v1.0.2 to v3.0.0
 * @name toMongo
 * @version 3.0.0
 * @returns { Claim }
 * @example
 * ```js
 * ```
 */
Claims.toStu3 = function(patientJson){
  if(patientJson){

    // quick cast from string to boolean
    if(typeof patientJson.birthDate === "string"){
      patientJson.birthDate = new Date(patientJson.birthDate);
    }

    // quick cast from string to boolean
    if(patientJson.deceasedBoolean){
      patientJson.deceasedBoolean = (patientJson.deceasedBoolean == "true") ? true : false;
    }

    // STU3 only has a single entry for family name; not an array
    if(patientJson.name && patientJson.name[0] && patientJson.name[0].family && patientJson.name[0].family[0] ){
      patientJson.name[0].family = patientJson.name[0].family[0];      
    }

    // make sure the full name is filled out
    if(patientJson.name && patientJson.name[0] && patientJson.name[0].family && !patientJson.name[0].text ){
      patientJson.name[0].text = patientJson.name[0].given[0] + ' ' + patientJson.name[0].family;      
    }
  }
  return patientJson;
}


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


export { Claim, Claims, ClaimSchema, ClaimStu3, ClaimDstu2 };