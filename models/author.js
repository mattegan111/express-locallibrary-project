var mongoose = require('mongoose');
const { DateTime } = require('luxon');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for author's lifespan
AuthorSchema.virtual('lifespan').get(function() {
  var lifetime_string = '';
  if (this.date_of_birth) {
    lifetime_string = DateTime
    .fromJSDate(this.date_of_birth)
    .toLocaleString(DateTime.DATE_MED);
  }
  lifetime_string += ' - ';
  if (this.date_of_death) {
    lifetime_string += DateTime
    .fromJSDate(this.date_of_death)
    .toLocaleString(DateTime.DATE_MED)
  }
  return lifetime_string;
});

// Virtual for author's lifespan formatted
AuthorSchema.virtual('lifespan_formatted').get(function() {
  var lifetime_string = 'N/A';

  if (this.date_of_birth && this.date_of_death) {
    lifetime_string = DateTime
    .fromJSDate(this.date_of_birth)
    .toLocaleString(DateTime.DATE_MED);

    lifetime_string += ' - ';

    lifetime_string += DateTime
    .fromJSDate(this.date_of_death)
    .toLocaleString(DateTime.DATE_MED)
  }

  else if (this.date_of_birth && !this.date_of_death) {
    lifetime_string = DateTime
    .fromJSDate(this.date_of_birth)
    .toLocaleString(DateTime.DATE_MED);

    lifetime_string += ' - ';

    lifetime_string += 'current'
  }
  
  else if (!this.date_of_birth && this.date_of_death) {
    lifetime_string = 'N/A';

    lifetime_string += ' - ';

    lifetime_string += DateTime
    .fromJSDate(this.date_of_death)
    .toLocaleString(DateTime.DATE_MED)
  }

  return lifetime_string;
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);

